import { useTablesStore } from "../store/tablesStore"

export default function ChecksList({ tableId, checks, selectedCheckId, onSelectCheck }) {
  const createCheck = useTablesStore((s) => s.createCheck)

  return (
    <div>
      <h2>Cuentas</h2>

      <button onClick={() => createCheck(tableId)}>Agregar cuenta</button>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {checks.map((check) => (
          <button
            key={check.checkId}
            onClick={() => onSelectCheck(check.checkId)}
            style={{ fontWeight: selectedCheckId === check.checkId ? "bold" : "normal" }}
          >
            {check.name}
          </button>
        ))}
      </div>
    </div>
  )
}