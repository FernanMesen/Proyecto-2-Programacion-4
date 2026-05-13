import { ApiError } from "./apiError.js";
import { clearStoredToken, getStoredToken } from "../../features/auth/utils/storage.js";

async function parseResponseBody(response) {
  if (response.status === 204) return null;
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) return response.json();
  return response.text();
}

export async function apiRequest(path, options = {}) {
  const { method = "GET", body, headers = {}, auth = true, isFormData = false } = options;

  const requestHeaders = { ...headers };

  if (body !== undefined && !isFormData) {
    requestHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getStoredToken();
    if (token) requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const data = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) clearStoredToken();

    if (data && typeof data === "object") {
      throw new ApiError({
        status: data.status ?? response.status,
        error: data.error ?? response.statusText,
        message: data.mensaje ?? data.message ?? data.error,
        path: data.path,
        details: data.details,
      });
    }

    throw new ApiError({
      status: response.status,
      error: response.statusText,
      message: typeof data === "string" && data ? data : response.statusText,
      path,
      details: [],
    });
  }

  return data;
}
