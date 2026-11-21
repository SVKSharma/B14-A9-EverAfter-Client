import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware, getOAuthState } from "better-auth/api";
import { MongoClient, ObjectId } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to ever-after-client/.env (same value as the server)."
  );
}

// Reuse the client across dev hot reloads so we do not exhaust Atlas connections.
const globalForMongo = globalThis as typeof globalThis & {
  __everAfterMongoClient?: MongoClient;
};

const mongoClient = globalForMongo.__everAfterMongoClient ?? new MongoClient(mongoUri);
if (process.env.NODE_ENV !== "production") {
  globalForMongo.__everAfterMongoClient = mongoClient;
}

const db = mongoClient.db(process.env.MONGODB_DB?.trim() || "everafter");

interface UserDoc {
  _id: string | ObjectId;
  id?: string;
  email?: string;
  role?: string;
  isBlocked?: boolean;
}

const users = db.collection<UserDoc>("users");

/**
 * Better Auth's Mongo adapter stores the user id as an ObjectId `_id`,
 * while the public API exposes it as a hex string.
 */
function toUserObjectId(value: string): ObjectId | null {
  return ObjectId.isValid(value) ? new ObjectId(value) : null;
}

/**
 * Roles a person may choose for themselves. `admin` is never in this list, and
 * it is provisioned manually outside the app.
 */
function publicRole(value: unknown): "vendor" | "customer" {
  return value === "vendor" ? "vendor" : "customer";
}

/**
 * Google sign-up carries the chosen role inside the signed OAuth state. The
 * value is client-supplied but tamper-evident and whitelisted, so the worst a
 * forged value can do is create a vendor account — never an admin.
 */
async function roleFromOAuthState(): Promise<"vendor" | "customer" | null> {
  try {
    const state = await getOAuthState();
    return state && "role" in state ? publicRole((state as { role?: unknown }).role) : null;
  } catch {
    return null;
  }
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

export const auth = betterAuth({
  appName: "EverAfter",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  database: mongodbAdapter(db, { client: mongoClient, usePlural: true }),

  plugins: [
    jwt({
      schema: { jwks: { modelName: "jwk" } },
    }),
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    maxPasswordLength: 128,
    autoSignIn: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  user: {
    additionalFields: {
      // Default and only fallback role. Admin is never selectable at sign-up.
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/update-user") {
        // `role` is only settable at account creation. Without this, any
        // signed-in user could POST {"role":"admin"} and promote themselves.
        if ((ctx.body ?? {}).role !== undefined) {
          throw new APIError("BAD_REQUEST", {
            message: "Account role cannot be changed from the app.",
          });
        }
        return;
      }

      if (ctx.path !== "/sign-up/email") return;

      const body = (ctx.body ?? {}) as { password?: unknown; role?: unknown };

      if (typeof body.password === "string" && !PASSWORD_PATTERN.test(body.password)) {
        throw new APIError("BAD_REQUEST", {
          message:
            "Password must be at least 6 characters and include an uppercase and a lowercase letter.",
        });
      }

      if (body.role !== undefined && body.role !== "vendor" && body.role !== "customer") {
        throw new APIError("BAD_REQUEST", {
          message: "Account role must be either vendor or customer.",
        });
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          let requestedRole = (user as { role?: unknown }).role;

          // Google sign-up has no role on the user payload: the person picks it
          // on our form before being sent to Google, and it rides the signed
          // OAuth state. Existing Google users never reach this hook.
          if (requestedRole === undefined) {
            requestedRole = (await roleFromOAuthState()) ?? undefined;
          }

          return {
            data: {
              ...user,
              // Force the only two public roles; anything else becomes customer.
              role: publicRole(requestedRole),
              isBlocked: false,
            },
          };
        },
        after: async (user) => {
          // The Mongo adapter stores Better Auth's id as an ObjectId `_id`.
          // Mirror the hex id into `id` so Express lookups (`vendorId` → `users.id`)
          // and the documented contract keep working.
          const objectId = toUserObjectId(String(user.id));
          if (objectId) {
            await users.updateOne({ _id: objectId }, { $set: { id: String(user.id) } });
          }
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const userId = String(session.userId);
          const objectId = toUserObjectId(userId);
          const account = await users.findOne({
            $or: [{ id: userId }, ...(objectId ? [{ _id: objectId }] : [])],
          });

          if (account?.isBlocked) {
            throw new APIError("FORBIDDEN", {
              message: "This account has been blocked. Contact support for help.",
            });
          }

          return { data: session };
        },
      },
    },
  },
});
