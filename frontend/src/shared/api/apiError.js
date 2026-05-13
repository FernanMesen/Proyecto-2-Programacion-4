export class ApiError extends Error {
  constructor({ status, error, message, path, details }) {
    super(message || "Ocurrió un error al comunicarse con la API");
    this.name = "ApiError";
    this.status = status;
    this.error = error;
    this.path = path;
    this.details = Array.isArray(details) ? details : [];
  }
}

export function getFriendlyErrorMessage(error) {
  if (!error) return "Ocurrió un error inesperado.";
  if (error instanceof ApiError) {
    if (error.status === 401) return "Tu sesión no es válida o expiró.";
    if (error.status === 403) return "No tenés permisos para realizar esta acción.";
    if (error.status === 404) return error.message || "No se encontró el recurso solicitado.";
    return error.message || "La API respondió con un error.";
  }
  return error.message || "Ocurrió un error inesperado.";
}

export function detailsToFieldErrors(details = []) {
  const fieldErrors = {};
  for (const detail of details) {
    const idx = detail.indexOf(":");
    if (idx === -1) continue;
    const field = detail.slice(0, idx).trim();
    const msg = detail.slice(idx + 1).trim();
    if (field) fieldErrors[field] = msg;
  }
  return fieldErrors;
}
