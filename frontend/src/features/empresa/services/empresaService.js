import { apiRequest } from "../../../shared/api/apiClient.js";

export function getPerfilEmpresa() {
  return apiRequest("/api/empresa/perfil");
}

export function getMisPuestos() {
  return apiRequest("/api/empresa/puestos");
}

export function crearPuesto(data) {
  return apiRequest("/api/empresa/puestos", { method: "POST", body: data });
}

export function desactivarPuesto(id) {
  return apiRequest(`/api/empresa/puestos/${id}/desactivar`, { method: "POST" });
}

export function activarPuesto(id) {
  return apiRequest(`/api/empresa/puestos/${id}/activar`, { method: "POST" });
}

export function buscarCandidatos(puestoId) {
  return apiRequest(`/api/empresa/candidatos/buscar?puestoId=${puestoId}`);
}

export function getDetalleCandidato(id) {
  return apiRequest(`/api/empresa/candidatos/${id}`);
}

export function getAplicacionesPuesto(puestoId) {
  return apiRequest(`/api/empresa/puestos/${puestoId}/aplicaciones`);
}
