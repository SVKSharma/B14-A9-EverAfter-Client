import type { ApiSuccess, PaginationMeta } from "@/types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api").replace(/\/+$/, "");

export function getApiUrl(path = ""): string {
  if (!path) return API_URL;
  return `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type TokenProvider = (options: { forceRefresh?: boolean }) => Promise<string | null>;

let tokenProvider: TokenProvider | null = null;

/**
 * Registered by the auth layer once Better Auth is configured. Keeping it
 * injectable lets public pages call the API without importing auth code.
 */
export function registerTokenProvider(provider: TokenProvider | null) {
  tokenProvider = provider;
}

export class ApiError extends Error {
  status: number;
  errors?: { field?: string; message: string }[] | string[];

  constructor(message: string, status = 0, errors?: ApiError["errors"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<ApiSuccess<T>> {
  const { body, auth = true, headers, ...rest } = options;

  const send = async (forceRefresh = false) => {
    const finalHeaders = new Headers(headers);
    finalHeaders.set("Accept", "application/json");

    let isFormData = false;
    if (body instanceof FormData) {
      isFormData = true;
    } else if (body !== undefined) {
      finalHeaders.set("Content-Type", "application/json");
    }

    if (auth && tokenProvider) {
      const token = await tokenProvider({ forceRefresh });
      if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
    }

    return fetch(getApiUrl(path), {
      ...rest,
      headers: finalHeaders,
      body: body === undefined ? undefined : isFormData ? (body as FormData) : JSON.stringify(body),
    });
  };

  let response: Response;
  try {
    response = await send();
    if (response.status === 401 && auth && tokenProvider) {
      response = await send(true);
    }
  } catch {
    throw new ApiError("Unable to reach the server. Please check your connection and try again.");
  }

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = null;
    }
  }

  if (!response.ok) {
    const data = payload as { message?: string; errors?: ApiError["errors"] } | null;
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data?.errors
    );
  }

  if (!payload) {
    return { success: true, data: undefined as T };
  }

  return payload as ApiSuccess<T>;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await request<T>(path, options);
  return response.data;
}

export interface PageResult<T> {
  data: T;
  meta?: PaginationMeta;
}

export async function apiFetchPage<T>(path: string, options: RequestOptions = {}): Promise<PageResult<T>> {
  const response = await request<T>(path, options);
  return { data: response.data, meta: response.meta };
}

export function buildQuery(
  params: Record<string, string | number | boolean | null | undefined>
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : "";
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
