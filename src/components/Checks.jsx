import { useTablesStore } from "../store/tablesStore"
import styles from "./Checks.module.css"

export default function Checks({ tableId, checks, selectedCheckId, onSelectCheck }) {
  const createCheck = useTablesStore((s) => s.createCheck)

  return (
    <>
      <header className={styles.checksListHeader}>
        <div>
          <h2>Cuentas</h2>
          <button onClick={() => createCheck(tableId)}>+ NUEVA CUENTA</button>
        </div>
        <progress id="order-progress" max="100" value="70">70%</progress>
        <div>
          <p>Asignado:</p>
          <p>Pendiente:</p>
        </div>
      </header>

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
    </>
  )
}