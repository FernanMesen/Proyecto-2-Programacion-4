import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext.jsx";

export function Navbar() {
    const { isAuthenticated, username, isAdmin, isEmpresa, isOferente, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login?logout=true", { replace: true });
    }

    return (
        <nav className="navbar">
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                padding: "0 2rem",
                gap: "1rem",
                width: "100%",
            }}>

                {/* Izquierda — Bolsa de Empleo */}
                <div style={{ display: "flex", alignItems: "center" }}>
                    <Link className="brand" to="/">
                        💼 Bolsa de Empleo
                    </Link>
                </div>

                <div className="nav-links">
                    <Link to="/buscar">Buscar puestos</Link>

                    {isEmpresa && (
                        <>
                            <Link to="/empresa/dashboard">Inicio</Link>
                            <Link to="/empresa/puestos">Mis puestos</Link>
                            <Link to="/empresa/puestos/nuevo">Publicar puesto</Link>
                            <Link to="/empresa/candidatos">Candidatos</Link>
                        </>
                    )}

                    {isOferente && (
                        <>
                            <Link to="/oferente/dashboard">Inicio</Link>
                            <Link to="/oferente/habilidades">Mis habilidades</Link>
                            <Link to="/oferente/cv">Mi CV</Link>
                        </>
                    )}

                    {isAdmin && (
                        <>
                            <Link to="/admin/dashboard">Panel admin</Link>
                            <Link to="/admin/empresas">Empresas</Link>
                            <Link to="/admin/oferentes">Oferentes</Link>
                            <Link to="/admin/caracteristicas">Características</Link>
                        </>
                    )}
                </div>

                <div className="nav-user" style={{ justifyContent: "flex-end" }}>
                    {isAuthenticated ? (
                        <>
              <span>
                👤 <strong>{username}</strong>
              </span>
                            <button type="button" className="btn btn-danger btn-sm" onClick={handleLogout}>
                                Salir
                            </button>
                        </>
                    ) : (
                        <>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "4px",
                                border: "1px solid rgba(255,255,255,0.4)",
                                borderRadius: "8px", padding: "3px 8px",
                            }}>
                <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "0.8rem", marginRight: "4px" }}>
                  Registrar:
                </span>
                                <Link className="btn btn-secondary btn-sm" to="/registro/empresa">
                                    🏢 Empresa
                                </Link>
                                <Link className="btn btn-secondary btn-sm" to="/registro/oferente">
                                    👤 Oferente
                                </Link>
                            </div>
                            <Link className="btn btn-primary btn-sm" to="/login">
                                Login
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}