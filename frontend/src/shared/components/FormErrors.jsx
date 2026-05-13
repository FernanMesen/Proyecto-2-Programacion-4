export function FormErrors({ details = [] }) {
  if (!details.length) return null;
  return (
    <div className="alert alert-error">
      <strong>Revisá los siguientes errores:</strong>
      <ul>
        {details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </div>
  );
}
