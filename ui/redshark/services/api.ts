// API client — wrapper chung cho moi request den backend
const BASE = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:8080";

let authToken: string | null = null;

export function setToken(t: string | null) {
  authToken = t;
}

function headers(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { ...extra };
  if (authToken) h["Authorization"] = `Bearer ${authToken}`;
  return h;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const err = new Error(`API ${res.status}: ${init?.method ?? "GET"} ${url}`);
    console.error("[API]", err.message);
    throw err;
  }
  if (res.status === 204 || res.status === 205) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function withJsonBody(method: "POST" | "PUT", body: unknown): RequestInit {
  return {
    method,
    headers: headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(body),
  };
}

export const api = {
  get: <T>(path: string): Promise<T> =>
    request(`${BASE}${path}`, { headers: headers() }),

  post: <T>(path: string, body: unknown): Promise<T> =>
    request(`${BASE}${path}`, withJsonBody("POST", body)),

  put: <T>(path: string, body: unknown): Promise<T> =>
    request(`${BASE}${path}`, withJsonBody("PUT", body)),

  delete: <T>(path: string): Promise<T> =>
    request(`${BASE}${path}`, { method: "DELETE", headers: headers() }),
};
