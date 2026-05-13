import { apiRequest } from "../../../shared/api/apiClient.js";

export function getDashboardStats() {
  return apiRequest("/api/admin/dashboard");
}

export function getEmpresasPendientes() {
  return apiRequest("/api/admin/empresas/pendientes");
}

export function aprobarEmpresa(id) {
  return apiRequest(`/api/admin/empresas/${id}/aprobar`, { method: "POST" });
}

export function getOferentesPendientes() {
  return apiRequest("/api/admin/oferentes/pendientes");
}

export function aprobarOferente(id) {
  return apiRequest(`/api/admin/oferentes/${id}/aprobar`, { method: "POST" });
}

export function getCaracteristicasArbol() {
  return apiRequest("/api/admin/caracteristicas");
}

export function getTodasCaracteristicas() {
  return apiRequest("/api/admin/caracteristicas/todas");
}

export function crearCaracteristica(nombre, padreId) {
  return apiRequest("/api/admin/caracteristicas", {
    method: "POST",
    body: { nombre, padreId: padreId || null },
  });
}
