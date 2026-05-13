import { apiRequest } from "../../../shared/api/apiClient.js";

export function registrarEmpresa(data) {
  return apiRequest("/api/auth/registro/empresa", {
    method: "POST",
    body: data,
    auth: false,
  });
}

export function registrarOferente(data) {
  return apiRequest("/api/auth/registro/oferente", {
    method: "POST",
    body: data,
    auth: false,
  });
}
