import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { Loading } from "../../../shared/components/Loading.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getMisPuestos, buscarCandidatos, getDetalleCandidato } from "../services/empresaService.js";

export function BuscarCandidatosPage() {
  const [searchParams] = useSearchParams();
  const puestoIdParam = searchParams.get("puestoId") || "";

  const [puestos, setPuestos] = useState([]);
  const [puestoId, setPuestoId] = useState(puestoIdParam);
  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    getMisPuestos()
      .then((ps) => setPuestos(ps.filter((p) => p.activo)))
      .catch(console.error);
  }, []);

  const handleBuscar = useCallback(async (e) => {
    if (e) e.preventDefault();
    if (!puestoId) return;
    setError(""); setLoading(true);
    try {
      const data = await buscarCandidatos(puestoId);
      setCandidatos(data);
      setBuscado(true);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [puestoId]);

  useEffect(() => {
    if (puestoIdParam) handleBuscar();
  }, [puestoIdParam]);

  async function verDetalle(id) {
    setLoadingDetalle(true);
    try {
      const d = await getDetalleCandidato(id);
      setDetalle(d);
    } catch (err) {
      setError(getFriendlyErrorMessage(err));
    } finally {
      setLoadingDetalle(false);
    }
  }

  return (
    <main className="container">
      <h1>🔍 Buscar Candidatos</h1>

      <section className="card">
        <form className="actions" onSubmit={handleBuscar} style={{ alignItems: "flex-end" }}>
          <div className="field" style={{ flex: 1 }}>
            <label htmlFor="puestoId">Seleccioná un puesto activo</label>
            <select
              id="puestoId"
              value={puestoId}
              onChange={(e) => setPuestoId(e.target.value)}
            >
              <option value="">— Elegí un puesto —</option>
              {puestos.map((p) => (
                <option key={p.id} value={p.id}>{p.descripcion}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={!puestoId || loading}>
            {loading ? "Buscando…" : "Buscar"}
          </button>
        </form>
      </section>

      <Alert type="error">{error}</Alert>

      {loading ? (
        <Loading message="Buscando candidatos…" />
      ) : buscado && (
        <section className="card">
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>
            Candidatos encontrados ({candidatos.length})
          </h2>
          {candidatos.length === 0 ? (
            <p className="empty-state">No hay candidatos que coincidan con los requisitos.</p>
          ) : (
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Coincidencias</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatos.map((c) => (
                    <tr key={c.id}>
                      <td>{c.nombre}</td>
                      <td>{c.correo}</td>
                      <td>
                        <span className="badge badge-info">
                          {c.coincidencias} / {c.total}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => verDetalle(c.id)}
                        >
                          Ver perfil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {detalle && (
        <div className="modal-overlay" onClick={() => setDetalle(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>👤 {detalle.nombre}</h3>
            <div className="detail-grid" style={{ marginBottom: "1rem" }}>
              <p><strong>Correo:</strong> {detalle.correo}</p>
              <p><strong>Identificación:</strong> {detalle.identificacion}</p>
              <p><strong>Teléfono:</strong> {detalle.telefono || "N/D"}</p>
              <p><strong>Residencia:</strong> {detalle.residencia || "N/D"}</p>
            </div>
            <strong>Habilidades:</strong>
            {detalle.habilidades?.length > 0 ? (
              <ul style={{ marginTop: 6, paddingLeft: 18 }}>
                {detalle.habilidades.map((h, i) => (
                  <li key={i}>{h.caracteristica} — Nivel {h.nivel}/5</li>
                ))}
              </ul>
            ) : <p className="muted">Sin habilidades registradas.</p>}

            {detalle.cvPath && (
              <div style={{ marginTop: "1rem" }}>
                <a
                  className="btn btn-primary btn-sm"
                  href={`/api/cv/${detalle.cvPath}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  📄 Ver CV (PDF)
                </a>
              </div>
            )}
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setDetalle(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
