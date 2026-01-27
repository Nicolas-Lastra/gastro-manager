import { useTablesStore } from "../store/tablesStore"
import styles from "./Checks.module.css"

export default function Checks({ tableId, assigned, tableTotal }) {
  const createCheck = useTablesStore((s) => s.createCheck)

  const pending = tableTotal - assigned
  const orderProgress = tableTotal === 0 ? 0 : assigned / tableTotal * 100

  return (
    <>
      <header className={styles.checksListHeader}>
        <div>
          <h2>Cuentas</h2>
          <button onClick={() => createCheck(tableId)}>+ NUEVA CUENTA</button>
        </div>
        <progress id="order-progress" max="100" value={orderProgress}>{orderProgress}%</progress>
        <div>
          <p>Asignado: ${assigned}</p>
          <p>Pendiente: ${pending}</p>
        </div>
      </header>
    </>
  )
}