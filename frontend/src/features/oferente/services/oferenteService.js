import { apiRequest } from "../../../shared/api/apiClient.js";

export function getPerfilOferente() {
  return apiRequest("/api/oferente/perfil");
}

export function getMisHabilidades() {
  return apiRequest("/api/oferente/habilidades");
}

export function guardarHabilidad(caracteristicaId, nivel) {
  return apiRequest("/api/oferente/habilidades", {
    method: "POST",
    body: { caracteristicaId, nivel },
  });
}

export function eliminarHabilidad(id) {
  return apiRequest(`/api/oferente/habilidades/${id}`, { method: "DELETE" });
}

export function subirCV(formData) {
  return apiRequest("/api/oferente/cv", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export function aplicarPuesto(puestoId, mensaje) {
  return apiRequest(`/api/oferente/puestos/${puestoId}/aplicar`, {
    method: "POST",
    body: { mensaje },
  });
}
