import { useState } from "react"
import { useEffect } from "react"
import TableCard from "../components/TableCard"

export default function TableManagement() {

    const [loading, setLoading] = useState(true)
    const [tables, setTables] = useState([])

    useEffect(() => {
        async function fetchTables() {
            try {
                setLoading(true)
                const response = await fetch('./tables.json')
                const json = await response.json()

                setTables(json.tables)
                
                setLoading(false)
            } catch(error) {
                console.error('Error fetching tables: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchTables()
    }, [])

    return(
        <main>
            <meta name="description" content="Edita tus mesas, cantidad de clientes, delivery y más." />
            <h1>Gestión de Mesas</h1>
            {loading && <small>Cargando</small>}
            <div className="tables-container">
                {tables.map((table) => (
                    <TableCard key={`table-${table.id}`} table={table}/>
                ))}
            </div>
        </main>
    )
}