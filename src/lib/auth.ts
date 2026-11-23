import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { APIError, createAuthMiddleware, getOAuthState } from "better-auth/api";
import { MongoClient, ObjectId, type MongoClientOptions } from "mongodb";

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error(
    "MONGODB_URI is not set. Add it to ever-after-client/.env (same value as the server)."
  );
}

const MONGO_URI: string = mongoUri;
const databaseName = process.env.MONGODB_DB?.trim() || "everafter";

/**
 * Serverless-friendly pool settings.
 *
 * `maxIdleTimeMS` matters on Vercel: a lambda can be frozen for minutes and the
 * sockets in the pool go stale. Letting the driver retire idle sockets avoids
 * reusing a dead one after a thaw, and a short server-selection timeout means a
 * genuinely unreachable cluster fails fast instead of hanging a render.
 */
const MONGO_OPTIONS: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 0,
  maxIdleTimeMS: 60_000,
  serverSelectionTimeoutMS: 10_000,
  connectTimeoutMS: 10_000,
};

interface UserDoc {
  _id: string | ObjectId;
  id?: string;
  email?: string;
  role?: string;
  isBlocked?: boolean;
}

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

/**
 * A Mongo topology that fails its first connection is closed permanently by the
 * driver, so every later call on that client throws `MongoTopologyClosedError`.
 * Because a serverless instance keeps its module state between requests, one bad
 * cold start used to poison every request that instance served.
 *
 * The client and the Better Auth instance are therefore replaceable: when we see
 * a closed/dead connection we drop both and build fresh ones.
 */
const globalForAuth = globalThis as typeof globalThis & {
  __everAfterMongoClient?: MongoClient;
  __everAfterAuth?: Auth;
};

function createMongoClient(): MongoClient {
  return new MongoClient(MONGO_URI, MONGO_OPTIONS);
}

function buildAuth() {
  const client = globalForAuth.__everAfterMongoClient ?? createMongoClient();
  globalForAuth.__everAfterMongoClient = client;

  const db = client.db(databaseName);
  const users = db.collection<UserDoc>("users");

  return betterAuth({
    appName: "EverAfter",
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,

    database: mongodbAdapter(db, { client, usePlural: true }),

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
}

export type Auth = ReturnType<typeof buildAuth>;

/** Lazily builds Better Auth so importing this module during a build does not connect. */
export function getAuth(): Auth {
  const cached = globalForAuth.__everAfterAuth;
  if (cached) return cached;

  const created = buildAuth();
  globalForAuth.__everAfterAuth = created;
  return created;
}

/**
 * Drops the cached client + auth instance so the next call reconnects from scratch.
 *
 * The old client is closed after a short grace period rather than immediately:
 * on a warm instance several requests share this module state, and closing a
 * pool that another in-flight request is still using would break that request.
 * A genuinely dead topology has nothing left to close anyway.
 */
export function resetAuthClient() {
  const stale = globalForAuth.__everAfterMongoClient;

  globalForAuth.__everAfterAuth = undefined;
  globalForAuth.__everAfterMongoClient = undefined;

  if (!stale) return;

  const timer = setTimeout(() => {
    void stale.close().catch(() => {});
  }, 30_000);

  // Never keep a serverless invocation alive just to close a socket.
  timer.unref?.();
}

const DEAD_CONNECTION_MESSAGES =
  /topology is closed|client is closed|must be connected|connection .* closed|not connected/i;

/** True for the "pool is dead, reconnect" family of driver errors. */
export function isDeadConnectionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const { name, message } = error as { name?: unknown; message?: unknown };

  if (
    name === "MongoTopologyClosedError" ||
    name === "MongoClientClosedError" ||
    name === "MongoNotConnectedError" ||
    name === "MongoNetworkError" ||
    name === "MongoNetworkTimeoutError" ||
    name === "MongoServerSelectionError"
  ) {
    return true;
  }

  return typeof message === "string" && DEAD_CONNECTION_MESSAGES.test(message);
}

/**
 * Runs a Better Auth call and transparently rebuilds the connection once if the
 * driver reports a dead pool. Safe by design: these errors are raised before a
 * query reaches the database, so retrying cannot duplicate a write.
 */
export async function runWithAuthRetry<T>(run: (auth: Auth) => Promise<T>): Promise<T> {
  try {
    return await run(getAuth());
  } catch (error) {
    if (!isDeadConnectionError(error)) throw error;

    resetAuthClient();
    return await run(getAuth());
  }
}
