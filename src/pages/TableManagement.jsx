import TableCard from "../components/TableCard"
import { useTables } from "../context/TablesContext"

export default function TableManagement() {

    const { tables } = useTables()

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