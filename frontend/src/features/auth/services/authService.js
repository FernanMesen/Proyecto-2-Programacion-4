import { apiRequest } from "../../../shared/api/apiClient.js";

export function loginRequest(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });
}
