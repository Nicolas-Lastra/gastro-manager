import { useParams } from "react-router"
import { useId, useState, useEffect } from "react"
import { useTablesStore } from "../store/tablesStore"
import { useProductsStore } from "../store/productsStore"
import { calculateOrderTotal } from "../utils/order"
import ProductsList from "../components/ProductsList"
import Order from "../components/Order"
import ChecksList from "../components/ChecksList"
import SplitOrder from "../components/SplitOrder"

function useTables() {
    const idText = useId()
    const idType = useId()
    const idStatus = useId()

    const { tableId } = useParams()

    const table = useTablesStore((state) => state.getTableById(tableId))
    const updateTable = useTablesStore((state) => state.updateTable)
    const tableTotal = calculateOrderTotal(table.currentOrder)

    const handleAddClient = (event) => {
        event.preventDefault()
        updateTable(table.id, {
            currentClients: table.currentClients + 1
        })
    }

    const handleRemoveClient = (event) => {
        event.preventDefault()
        if(table.currentClients > 0) {
            updateTable(table.id, {
                currentClients: table.currentClients - 1
            })
        }
    }

    const handleTableType = (event) => {
        event.preventDefault()
        const tableType = event.target.value
        updateTable(table.id, {
            type: tableType
        })
    }

    const handleTableStatus = (event) => {
        event.preventDefault()
        const tableStatus = event.target.value
        updateTable(table.id, {
            status: tableStatus
        })
    }

    return {
        idText,
        idType,
        idStatus,
        table,
        tableTotal,
        updateTable,
        handleAddClient,
        handleRemoveClient,
        handleTableType,
        handleTableStatus
    }
}

export default function TableDetail() {

    const {
        idText,
        idType,
        idStatus,
        table,
        tableTotal,
        handleAddClient,
        handleRemoveClient,
        handleTableType,
        handleTableStatus
    } = useTables()

    const products = useProductsStore((state) => state.products)
    const [searchTerm, setSearchTerm] = useState('')
    const addProductToOrder = useTablesStore(state => state.addProductToOrder)
    const increaseOrderLine = useTablesStore(state => state.increaseOrderLine)
    const decreaseOrderLine = useTablesStore(state => state.decreaseOrderLine)

    const filteredProducts = products.filter(product => {
        if (!searchTerm) return true
        return product.name.toLowerCase().includes(searchTerm.toLowerCase())
    })

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleAddProduct = (productId) => {
        const product = products.find((p) => p.id === productId)
        if (!product) return
        addProductToOrder(table.id, product)
    }

    const createCheck = useTablesStore((state) => state.createCheck)

    const [selectedCheckId, setSelectedCheckId] = useState(null)

    useEffect(() => {
        if (!table) return
        if (!selectedCheckId && table.checks.length > 0) {
            setSelectedCheckId(table.checks[0].checkId)
        }
    }, [table, selectedCheckId])

    useEffect(() => {
        if (!table) return
        if (table.currentOrder.length === 0) return
        if (table.checks.length > 0) return

        createCheck(table.id)
    }, [table, createCheck])

    return(
        <main>
            <h1>Mesa - {table.id}</h1>
            <p>Estado: {
                    table.status === "available" ? "Disponible" : 
                    table.status === "reserved" ? "Reservado" : 
                    table.status === "unavailable" ? "No disponible" : 
                    table.status === "pending" ? "Pendiente" : 
                    "Disponible"
                }
            </p>
            <p>Clientes: {table.currentClients}/{table.seats}</p>
            <p>Total: <em>$ {tableTotal}</em></p>
            <p>Para: {table.type === "eat in" ? "Servir" : table.type === "takeaway" ? "Llevar" : ""}</p>

            <form>

                <div className="table-type">
                    <select name={idType}
                    onChange={handleTableType}
                    defaultValue={table.type === "eat in" ? "eat in" : table.type === "takeaway" ? "takeaway" : ""}
                    >
                        <option value="eat in">Servir</option>
                        <option value="takeaway">Llevar</option>
                    </select>
                </div>
                <div className="table-status">
                    <select
                    name={idStatus}
                    onChange={handleTableStatus}
                    defaultValue={
                        table.status === "available" ? "available" : 
                        table.status === "reserved" ? "reserved" : 
                        table.status === "unavailable" ? "unavailable" : 
                        table.status === "pending" ? "pending" : 
                        ""
                    }
                    >
                        <option value="available">Disponible</option>
                        <option value="reserved">Reservado</option>
                        <option value="unavailable">No disponible</option>
                        <option value="pending">Pendiente</option>
                    </select>
                </div>
                <div className="buttons">
                    <button onClick={handleAddClient}>Agregar cliente</button>
                    <button onClick={handleRemoveClient} >Quitar cliente</button>
                </div>
            </form>

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
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </form>

            <ProductsList products={filteredProducts} onAddProduct={handleAddProduct} />
            <Order
                currentOrder={table.currentOrder}
                onIncreaseButton={(lineId) => increaseOrderLine(table.id, lineId)}
                onDecreaseButton={(lineId) => decreaseOrderLine(table.id, lineId)}
            />
            <ChecksList
                tableId={table.id}
                checks={table.checks}
                selectedCheckId={selectedCheckId}
                onSelectCheck={setSelectedCheckId}
            />
            <SplitOrder table={table} selectedCheckId={selectedCheckId} />
            
        </main>
    )
}