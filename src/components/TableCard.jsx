import styles from "./TableCard.module.css"
import { useNavigate, useLocation } from "react-router"
import { calculateOrderTotal } from "../utils/order"

export default function TableCard({ table }) {

    const navigate = useNavigate()
    const currentPath = useLocation().pathname

    const tableId = table.id

    const tableStatus = 
        table.status === "pending" ? "Pendiente" :
        table.status === "reserved" ? "Reservada" :
        table.status === "unavailable" ? "No disponible" :
        table.status === "available" ? "Disponible" :
        "Disponible"
    
    const statusStyle = 
        tableStatus === "Pendiente" ? styles.isPending :
        tableStatus === "Reservada" ? styles.isReserved :
        styles.isAvailable

    const tableType = table.type === "eat in" ? "Servir" : "Llevar"

    const currentClients = table.currentClients

    const tableTotal = calculateOrderTotal(table.currentOrder)

    const handleCardClick = () => {
        navigate(`${currentPath}/${tableId}`)
    }

    return(
        <article className={styles.tableCard} onClick={handleCardClick}>
            <header>
                <h4>Mesa {tableId}</h4>

                <div className={`${styles.seatsContainer} ${statusStyle}`}>
                    <p>{currentClients}/{table.seats}</p>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M10 13a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M8 21v-1a2 2 0 0 1 2 -2h4a2 2 0 0 1 2 2v1" />
                        <path d="M15 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M17 10h2a2 2 0 0 1 2 2v1" />
                        <path d="M5 5a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                        <path d="M3 13v-1a2 2 0 0 1 2 -2h2" />
                    </svg>
                </div>
                
            </header>
            
            <div className={styles.centerContent}>
                <p className={statusStyle}
                >
                    {tableStatus}</p>
                <p>{tableType}</p>
            </div>

            <footer>
                <small>Total</small>
                <em>$ {tableTotal}</em>
            </footer>
        </article>
    )
}