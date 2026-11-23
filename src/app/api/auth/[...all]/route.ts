import type { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { getAuth, resetAuthClient } from "@/lib/auth";

type Method = "GET" | "POST";

/**
 * Better Auth catches driver failures internally and turns them into a 500
 * response, so a dead Mongo pool would otherwise stay cached for the life of the
 * serverless instance. A 5xx from the handler is retried exactly once against a
 * freshly built client; the request is cloned so the body is still readable.
 */
async function handle(request: NextRequest, method: Method): Promise<Response> {
  const first = await toNextJsHandler(getAuth())[method](request.clone());

  if (first.status < 500) return first;

  resetAuthClient();
  return toNextJsHandler(getAuth())[method](request.clone());
}

export async function GET(request: NextRequest) {
  return handle(request, "GET");
}

export async function POST(request: NextRequest) {
  return handle(request, "POST");
}
