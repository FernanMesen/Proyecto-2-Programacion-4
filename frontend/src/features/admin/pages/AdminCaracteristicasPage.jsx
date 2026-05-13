import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert } from "../../../shared/components/Alert.jsx";
import { getFriendlyErrorMessage } from "../../../shared/api/apiError.js";
import {
    getCaracteristicasArbol,
    getTodasCaracteristicas,
    crearCaracteristica,
} from "../services/adminService.js";

function NodoArbol({ nodo, nivel = 0 }) {
    return (
        <>
            <li style={{ margin: "4px 0", paddingLeft: nivel * 16 }}>
        <span style={{ fontWeight: nodo.esHoja ? 400 : 700, color: nodo.esHoja ? "#4b5563" : "#1f2937" }}>
          {nodo.esHoja ? "• " : "▾ "}
            {nodo.nombre}
        </span>
            </li>
            {nodo.hijos?.map((h) => (
                <NodoArbol key={h.id} nodo={h} nivel={nivel + 1} />
            ))}
        </>
    );
}

export function AdminCaracteristicasPage() {
    const [arbol, setArbol] = useState([]);
    const [todas, setTodas] = useState([]);
    const [form, setForm] = useState({ nombre: "", padreId: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const cargar = useCallback(() => {
        getCaracteristicasArbol().then(setArbol).catch(console.error);
        getTodasCaracteristicas().then(setTodas).catch(console.error);
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(""); setSuccess("");
        try {
            await crearCaracteristica(form.nombre, form.padreId || null);
            setSuccess(`Característica "${form.nombre}" creada correctamente.`);
            setForm({ nombre: "", padreId: "" });
            cargar();
        } catch (err) {
            setError(getFriendlyErrorMessage(err));
        }
    }

    return (
        <main className="container">
            <p><Link to="/admin/dashboard" className="btn btn-secondary btn-sm">← Volver al panel</Link></p>
            <h1>📂 Gestión de Características</h1>

            <div className="grid-2">
                <section className="card">
                    <h2 style={{ marginTop: 0, fontSize: "1rem" }}>Nueva característica</h2>

                    <Alert type="success">{success}</Alert>
                    <Alert type="error">{error}</Alert>

                    <form className="form-layout" onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="nombre">Nombre *</label>
                            <input
                                id="nombre" name="nombre" value={form.nombre}
                                onChange={handleChange} required
                                placeholder="Ej: React, Python, JUnit…"
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="padreId">Categoría padre (opcional)</label>
                            <select id="padreId" name="padreId" value={form.padreId} onChange={handleChange}>
                                <option value="">— Raíz (sin padre) —</option>
                                {todas.map((c) => (
                                    <option key={c.id} value={c.id}>{c.nombre}</option>
                                ))}
                            </select>
                        </div>

                        <button type="submit" className="btn btn-success">➕ Crear característica</button>
                    </form>
                </section>

                <section>
                    <h2 style={{ marginTop: 0 }}>Árbol de características</h2>
                    <section className="card">
                        {arbol.length === 0 ? (
                            <p className="empty-state">No hay características registradas.</p>
                        ) : (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {arbol.map((n) => (
                                    <NodoArbol key={n.id} nodo={n} nivel={0} />
                                ))}
                            </ul>
                        )}
                    </section>
                </section>
            </div>
        </main>
    );
}