import { useEffect } from "react"
import TableCard from "../components/TableCard"
import { useTablesStore } from "../store/tablesStore"

export default function TableManagement() {
    
    const tables = useTablesStore((state) => state.tables)
    const initializeTables = useTablesStore((state) => state.initializeTables)
    
    useEffect(() => {
        initializeTables()
    }, [initializeTables])

    return(
        <main>
            <meta name="description" content="Edita tus mesas, cantidad de clientes, delivery y más." />
            <h1>Gestión de Mesas</h1>
            <div className="tables-container">
                {tables.map((table) => (
                    <TableCard key={`table-${table.id}`} table={table}/>
                ))}
            </div>
        </main>
    )
}