import { Link } from "react-router-dom";
import { formatSalario } from "../../../shared/utils/formatters.js";

export function PuestoCard({ puesto }) {
  const tipo = puesto.tipo?.toLowerCase();

  return (
    <div className="puesto-card">
      <span className={`badge badge-${tipo}`}>{puesto.tipo}</span>
      <h3 style={{ margin: "8px 0 4px", fontSize: "1rem" }}>{puesto.empresa?.nombre}</h3>
      <p style={{ margin: "0 0 6px", fontSize: "0.9rem", color: "#4b5563" }}>{puesto.descripcion}</p>
      <p style={{ margin: "0 0 10px", fontWeight: 700 }}>{formatSalario(puesto.salario)}</p>

      {puesto.caracteristicas?.length > 0 && (
        <div className="tooltip-wrap" style={{ display: "block", marginBottom: 10 }}>
          <span className="tooltip-trigger">▸ Ver requisitos</span>
          <div className="tooltip-content">
            <strong>Características requeridas:</strong>
            <ul>
              {puesto.caracteristicas.map((c) => (
                <li key={c.id}>
                  {c.rutaCompleta} — nivel mín. {c.nivelMinimo}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <Link className="btn btn-primary btn-sm" to={`/puesto/${puesto.id}`}>
        Ver detalle
      </Link>
    </div>
  );
}
