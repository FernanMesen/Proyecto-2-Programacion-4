export function Loading({ message = "⏳Cargando…" }) {
  return (
    <section className="card">
      <p className="muted">{message}</p>
    </section>
  );
}
