import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../shared/components/Loading.jsx";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getPerfilEmpresa, getMisPuestos } from "../services/empresaService.js";

const IC = ({ src, alt, size = 20 }) => (
    <img src={src} alt={alt} style={{ width: size, height: size, verticalAlign: "middle", marginRight: 6 }} />
);

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
          <h1>
            <IC src="https://img.icons8.com/ios-filled/50/4771a3/company.png" alt="" size={28} />
            Bienvenida, {perfil?.nombre}
          </h1>
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
        <Link className="btn btn-primary" to="/empresa/puestos">
          <IC src="https://img.icons8.com/ios-filled/50/ffffff/list.png" alt="" />
          Mis puestos
        </Link>
        <Link className="btn btn-success" to="/empresa/puestos/nuevo">
          <IC src="https://img.icons8.com/ios-filled/50/ffffff/plus-math.png" alt="" />
          Publicar puesto
        </Link>
        <Link className="btn btn-secondary" to="/empresa/candidatos">
          <IC src="https://img.icons8.com/ios-filled/50/000000/search.png" alt="" />
          Buscar candidatos
        </Link>
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
