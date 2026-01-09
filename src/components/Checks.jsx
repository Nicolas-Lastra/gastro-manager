import { useTablesStore } from "../store/tablesStore"
import styles from "./Checks.module.css"

export default function ChecksList({ tableId, checks, selectedCheckId, onSelectCheck }) {
  const createCheck = useTablesStore((s) => s.createCheck)

  return (
    <div>
      <div className={styles.checksListHeader}>
        <h2>Cuentas</h2>
        <button onClick={() => createCheck(tableId)}>+ NUEVA CUENTA</button>
      </div>

      <div>
        {checks.map((check, index) => (
          <button
            key={check.checkId}
            onClick={() => onSelectCheck(check.checkId)}
            style={{ fontWeight: selectedCheckId === check.checkId ? "bold" : "normal" }}
          >
            Cuenta {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}