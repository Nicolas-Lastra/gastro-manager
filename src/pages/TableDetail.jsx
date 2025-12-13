import { useParams } from "react-router"
import { useId } from "react"
import { useTables } from "../context/TablesContext"

export default function TableDetail() {

    const idText = useId()

    const { tableId } = useParams()
    const { getTableById, updateTable } = useTables()
    const table = getTableById(tableId)
    console.log(table)

    const handleAddProduct = (event) => {
        event.preventDefault()
        console.log('Agregando producto')
    }

    const handleAddClient = (event) => {
        event.preventDefault()
        updateTable(table.id, { currentClients: table.currentClients + 1 })
        console.log(table.currentClients)
    }

    const handleRemoveClient = (event) => {
        event.preventDefault()
        if(table.currentClients > 0) {
            updateTable(table.id, { currentClients: table.currentClients - 1 })
        }
        console.log(table.currentClients)
    }

    return(
        <main>
            <h1>Mesa - {table.id}</h1>
            <p>Estado: {table.status}</p>
            <p>Clientes: {table.currentClients}/{table.seats}</p>
            <p>Para: {table.type}</p>

            <form>
                <div className="search-bar">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-search"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                        <path d="M21 21l-6 -6" />
                    </svg>

                    <input
                        type="text"
                        placeholder="Ingresa el nombre de un producto"
                        name={idText}
                    />
                    <button onClick={handleAddProduct}>Agregar</button>
                </div>

                <div className="search-filters">
                    <select name="" id=""></select>
                </div>
                <div className="buttons">
                    <button onClick={handleAddClient}>Agregar cliente</button>
                    <button onClick={handleRemoveClient} >Quitar cliente</button>
                </div>
            </form>
        </main>
    )
}