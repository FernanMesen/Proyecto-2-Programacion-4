import { Link } from "react-router-dom";

export function AccessDeniedPage() {
  return (
    <main className="container">
      <section className="card">
        <h1>Acceso denegado</h1>
        <p>No tenés permisos para acceder a esta sección.</p>
        <Link className="btn btn-secondary" to="/">Volver al inicio</Link>
      </section>
    </main>
  );
}
