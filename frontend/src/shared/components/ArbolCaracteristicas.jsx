
export function ArbolCaracteristicas({ nodos = [], seleccionadas = {}, onToggle, onNivel, modoSeleccion = false }) {
  return (
    <div className="arbol">
      <ul style={{ paddingLeft: 0, listStyle: "none" }}>
        {nodos.map((n) => (
          <NodoCarac
            key={n.id}
            nodo={n}
            seleccionadas={seleccionadas}
            onToggle={onToggle}
            onNivel={onNivel}
            modoSeleccion={modoSeleccion}
          />
        ))}
      </ul>
    </div>
  );
}

function NodoCarac({ nodo, seleccionadas, onToggle, onNivel, modoSeleccion }) {
  const hayHijos = nodo.hijos && nodo.hijos.length > 0;
  const sel = seleccionadas[nodo.id];

  return (
    <li style={{ margin: "4px 0" }}>
      <span style={{ fontWeight: hayHijos ? "700" : "400", color: hayHijos ? "#1f2937" : "#4b5563" }}>
        {modoSeleccion && !hayHijos && (
          <input
            type="checkbox"
            checked={!!sel}
            onChange={() => onToggle(nodo.id)}
            style={{ marginRight: 6 }}
          />
        )}
        {hayHijos ? `▾ ${nodo.nombre}` : nodo.nombre}
        {modoSeleccion && sel && !hayHijos && (
          <select
            value={sel.nivel || 1}
            onChange={(e) => onNivel(nodo.id, parseInt(e.target.value))}
            style={{ marginLeft: 8, padding: "2px 6px", fontSize: "0.8rem", borderRadius: 4, border: "1px solid #cbd5e1" }}
          >
            {[1, 2, 3, 4, 5].map((v) => (
              <option key={v} value={v}>Nivel {v}</option>
            ))}
          </select>
        )}
      </span>
      {hayHijos && (
        <ul style={{ paddingLeft: 18, listStyle: "none" }}>
          {nodo.hijos.map((h) => (
            <NodoCarac
              key={h.id}
              nodo={h}
              seleccionadas={seleccionadas}
              onToggle={onToggle}
              onNivel={onNivel}
              modoSeleccion={modoSeleccion}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
