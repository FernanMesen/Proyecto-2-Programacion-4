import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { formatSalario } from "../../../shared/utils/formatters.js";
import { getMisPuestos, activarPuesto, desactivarPuesto } from "../services/empresaService.js";

export function MisPuestosPage() {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const cargar = useCallback(() => {
    setLoading(true);
    getMisPuestos()
      .then(setPuestos)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  async function handleToggle(puesto) {
    setError(""); setSuccess("");
    try {
      if (puesto.activo) {
        await desactivarPuesto(puesto.id);
        setSuccess("Puesto desactivado correctamente.");
      } else {
        await activarPuesto(puesto.id);
        setSuccess("Puesto activado correctamente.");
      }
      cargar();
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    }
  }

  return (
    <main className="container">
      <header className="page-header">
        <h1>Mis Puestos</h1>
        <Link className="btn btn-success" to="/empresa/puestos/nuevo">➕ Nuevo puesto</Link>
      </header>

      <Alert type="success">{success}</Alert>
      <Alert type="error">{error}</Alert>

      {loading ? (
        <Loading message="Cargando puestos…" />
      ) : puestos.length === 0 ? (
        <p className="empty-state">No tenés puestos publicados aún.</p>
      ) : (
        <div className="puestos-grid">
          {puestos.map((p) => (
            <div className="puesto-card" key={p.id}>
              <span className={`badge badge-${p.activo ? p.tipo?.toLowerCase() : "inactivo"}`}>
                {p.activo ? p.tipo : "INACTIVO"}
              </span>
              <h3 style={{ margin: "8px 0 4px", fontSize: "1rem" }}>{p.descripcion}</h3>
              <p style={{ margin: "0 0 10px", fontWeight: 700 }}>{formatSalario(p.salario)}</p>
              {p.caracteristicas?.length > 0 && (
                <p className="muted" style={{ fontSize: "0.85rem", margin: "0 0 10px" }}>
                  {p.caracteristicas.length} característica(s) requeridas
                </p>
              )}
              <div className="actions" style={{ flexWrap: "wrap" }}>
                <Link className="btn btn-primary btn-sm" to={`/empresa/candidatos?puestoId=${p.id}`}>
                  Candidatos
                </Link>
                <Link className="btn btn-secondary btn-sm" to={`/empresa/aplicaciones/${p.id}`}>
                  Aplicaciones
                </Link>
                <button
                  type="button"
                  className={`btn btn-sm ${p.activo ? "btn-danger" : "btn-success"}`}
                  onClick={() => handleToggle(p)}
                >
                  {p.activo ? "❌Desactivar" : "✅Activar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
