import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../shared/components/Loading.jsx";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getPerfilEmpresa, getMisPuestos } from "../services/empresaService.js";

export function EmpresaDashboardPage() {
  const [perfil, setPerfil] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPerfilEmpresa(), getMisPuestos()])
      .then(([p, ps]) => { setPerfil(p); setPuestos(ps); })
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="container"><Loading message="Cargando tablero…" /></main>;

  const activos = puestos.filter((p) => p.activo).length;

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>👋 Bienvenida, {perfil?.nombre}</h1>
          <p className="muted">{perfil?.localizacion}</p>
        </div>
      </header>

      <Alert type="error">{error}</Alert>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="num">{puestos.length}</div>
          <div className="lbl">Total puestos</div>
        </div>
        <div className="stat-card">
          <div className="num">{activos}</div>
          <div className="lbl">Puestos activos</div>
        </div>
        <div className="stat-card">
          <div className="num">{puestos.length - activos}</div>
          <div className="lbl">Puestos inactivos</div>
        </div>
      </div>

      <div className="actions">
        <Link className="btn btn-primary" to="/empresa/puestos">📋 Mis puestos</Link>
        <Link className="btn btn-success" to="/empresa/puestos/nuevo">➕ Publicar puesto</Link>
        <Link className="btn btn-secondary" to="/empresa/candidatos">🔍 Buscar candidatos</Link>
      </div>

      {perfil && (
        <section className="card" style={{ marginTop: "1.5rem", maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Datos de la empresa</h2>
          <div className="detail-grid">
            <p><strong>Correo:</strong> {perfil.correo}</p>
            <p><strong>Teléfono:</strong> {perfil.telefono || "N/D"}</p>
            <p><strong>Descripción:</strong> {perfil.descripcion || "N/D"}</p>
          </div>
        </section>
      )}
    </main>
  );
}
