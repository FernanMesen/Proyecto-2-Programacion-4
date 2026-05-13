export function formatSalario(value) {
  if (!value) return "A convenir";
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    minimumFractionDigits: 0,
  }).format(Number(value));
}

export function formatFecha(value) {
  if (!value) return "N/D";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-CR", { dateStyle: "medium" }).format(date);
}

export function valueOrDefault(value, fallback = "N/D") {
  return value === null || value === undefined || value === "" ? fallback : value;
}