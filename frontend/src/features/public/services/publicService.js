import { apiRequest } from "../../../shared/api/apiClient.js";

export function getUltimosPuestos() {
  return apiRequest("/api/public/puestos/recientes", { auth: false });
}

export function buscarPuestos(caracteristicaIds = []) {
  const qs = caracteristicaIds.length
    ? "?" + caracteristicaIds.map((id) => `caracteristicaIds=${id}`).join("&")
    : "";
  return apiRequest(`/api/public/puestos/buscar${qs}`);
}

export function getDetallePuesto(id) {
  return apiRequest(`/api/public/puestos/${id}`);
}

export function getCaracteristicasArbol() {
  return apiRequest("/api/public/caracteristicas", { auth: false });
}
