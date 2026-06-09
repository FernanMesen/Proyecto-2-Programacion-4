import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../shared/components/Loading.jsx";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getPerfilOferente, getMisHabilidades } from "../services/oferenteService.js";

const IC = ({ src, alt, size = 20 }) => (
    <img src={src} alt={alt} style={{ width: size, height: size, verticalAlign: "middle", marginRight: 6 }} />
);

export function OferenteDashboardPage() {
  const [perfil, setPerfil] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getPerfilOferente(), getMisHabilidades()])
      .then(([p, h]) => { setPerfil(p); setHabilidades(h); })
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="container"><Loading message="Cargando tablero…" /></main>;

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <h1>
            <IC src="https://img.icons8.com/ios-filled/50/4771a3/user.png" alt="" size={28} />
            Bienvenido/a, {perfil?.nombre} {perfil?.primerApellido}
          </h1>
          <p className="muted">{perfil?.correo}</p>
        </div>
      </header>

      <Alert type="error">{error}</Alert>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="num">{habilidades.length}</div>
          <div className="lbl">Habilidades registradas</div>
        </div>
        <div className="stat-card">
          <div className="num">
            {perfil?.cvPath
              ? <img src="https://img.icons8.com/ios-filled/50/16a34a/checkmark.png" alt="Sí" style={{ width: 32, height: 32 }} />
              : <img src="https://img.icons8.com/ios-filled/50/dc2626/close.png" alt="No" style={{ width: 32, height: 32 }} />
            }
          </div>
          <div className="lbl">CV subido</div>
        </div>
      </div>

      <div className="actions">
        <Link className="btn btn-primary" to="/buscar">Buscar puestos</Link>
        <Link className="btn btn-secondary" to="/oferente/habilidades">Mis habilidades</Link>
        <Link className="btn btn-secondary" to="/oferente/cv">
          <IC src="https://img.icons8.com/ios-filled/50/000000/resume.png" alt="" />
          Mi CV
        </Link>
      </div>

      {perfil && (
        <section className="card" style={{ marginTop: "1.5rem", maxWidth: 480 }}>
          <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Mis datos</h2>
          <div className="detail-grid">
            <p><strong>Identificación:</strong> {perfil.identificacion}</p>
            <p><strong>Nacionalidad:</strong> {perfil.nacionalidad || "N/D"}</p>
            <p><strong>Teléfono:</strong> {perfil.telefono || "N/D"}</p>
            <p><strong>Residencia:</strong> {perfil.residencia || "N/D"}</p>
          </div>
        </section>
      )}
    </main>
  );
}
