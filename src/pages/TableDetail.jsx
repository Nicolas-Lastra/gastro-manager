import { useParams } from "react-router"
import { useId, useState } from "react"
import { useTablesStore } from "../store/tablesStore"
import { useEffect } from "react"
import { useProductsStore } from "../store/productsStore"
import ProductsList from "../components/ProductsList"

export default function TableDetail() {

    const idText = useId()
    const idType = useId()
    const idStatus = useId()

    const { tableId } = useParams()

    const table = useTablesStore((state) => state.getTableById(tableId))
    const updateTable = useTablesStore((state) => state.updateTable)
    const products = useProductsStore((state) => state.products)
    const [searchTerm, setSearchTerm] = useState('')

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

        const existing = table.currentOrder.find(
            item => item.productId === productId
        )

        let newOrder

        if (existing) {
            newOrder = table.currentOrder.map(
                item => item.productId === productId 
                    ? { ...item, qty: item.qty + 1 }
                    : item
            )
        } else {
            newOrder = [
                ...table.currentOrder,
                {
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1
                }
            ]
        }

        updateTable(table.id, {
            currentOrder: newOrder
        })
    }

    const handleRemoveProduct = (productId) => {

        const existing = table.currentOrder.find(
            item => item.productId === productId
        )

        if (!existing) return

        let newOrder

        if (existing.qty === 1) {
            newOrder = table.currentOrder.filter(
                item => item.productId !== productId
            )
        } else {
            newOrder = table.currentOrder.map(
                item => item.productId === productId 
                    ? { ...item, qty: item.qty - 1 }
                    : item
            )
        }

        updateTable(table.id, {
            currentOrder: newOrder
        })
    }

    useEffect(() => {
        console.log(table.currentOrder)
    }, [table])

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

            <ProductsList products={filteredProducts} onAddProduct={handleAddProduct} onRemoveProduct={handleRemoveProduct} />
        </main>
    )
}