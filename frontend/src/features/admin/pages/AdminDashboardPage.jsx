import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loading } from "../../../shared/components/Loading.jsx";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import { getDashboardStats } from "../services/adminService.js";

export function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch((err) => setError(getFriendlyErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <main className="container"><Loading message="Cargando panel…" /></main>;

  return (
    <main className="container">
      <h1><><img src="https://img.icons8.com/ios-filled/50/4771a3/shield.png" alt="" style={{width:24,height:24,verticalAlign:"middle",marginRight:8}} />Panel de Administración</></h1>

      <Alert type="error">{error}</Alert>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="num" style={{ color: "#d97706" }}>{stats?.empresasPendientes ?? 0}</div>
          <div className="lbl">Empresas pendientes</div>
        </div>
        <div className="stat-card">
          <div className="num" style={{ color: "#d97706" }}>{stats?.oferentesPendientes ?? 0}</div>
          <div className="lbl">Oferentes pendientes</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats?.totalEmpresas ?? 0}</div>
          <div className="lbl">Total empresas</div>
        </div>
        <div className="stat-card">
          <div className="num">{stats?.totalOferentes ?? 0}</div>
          <div className="lbl">Total oferentes</div>
        </div>
      </div>

      <div className="actions">
        <Link className="btn btn-primary" to="/admin/empresas">Revisar empresas</Link>
        <Link className="btn btn-primary" to="/admin/oferentes">Revisar oferentes</Link>
        <Link className="btn btn-secondary" to="/admin/caracteristicas">Características</Link>
      </div>
    </main>
  );
}
