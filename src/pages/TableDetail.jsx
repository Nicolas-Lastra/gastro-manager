import { useParams } from "react-router"
import { useId, useState, useEffect } from "react"
import { useTablesStore } from "../store/tablesStore"
import { useProductsStore } from "../store/productsStore"
import { calculateOrderTotal } from "../utils/order"
import ProductsList from "../components/ProductsList"
import Order from "../components/Order"
import ChecksList from "../components/Checks"
import SplitOrder from "../components/SplitOrder"
import styles from "./TableDetail.module.css"

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
    const [isProductsOpen, setIsProductsOpen] = useState(false)

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

    const closeProdcutsModal = () => {
        setIsProductsOpen(false)
        setSearchTerm("")
    }

    const createCheck = useTablesStore((state) => state.createCheck)
    const deleteCheck = useTablesStore((state) => state.deleteCheck)

    const [selectedCheckId, setSelectedCheckId] = useState(null)
    
    const handleDeleteSelectedCheck = (checkIdToDelete) => {
        if (!checkIdToDelete) return

        const remainingCheck = table.checks.filter((c) => c.checkId !== checkIdToDelete)
        const nextSelectedId = remainingCheck[0]?.checkId ?? null

        setSelectedCheckId(nextSelectedId)
        deleteCheck(table.id, checkIdToDelete)
    }

    useEffect(() => {
        if (!table) return

        const exists = table.checks.some((c) => c.checkId === selectedCheckId)

        if (!selectedCheckId || !exists) {
            setSelectedCheckId(table.checks[0]?.checkId ?? null)
        }
    }, [table?.checks, selectedCheckId])

    useEffect(() => {
        if (!table) return
        if (table.currentOrder.length === 0) return
        if (table.checks.length > 0) return

        createCheck(table.id)
    }, [table, createCheck])

    useEffect(() => {
        if(!isProductsOpen) return

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                closeProdcutsModal()
            }
        }

        window.addEventListener("keydown", onKeyDown)
        return() => window.removeEventListener("keydown", onKeyDown)
    }, [isProductsOpen])

    return(
        <main className={styles.tableDetailMain}>
            <section>
                <header className={styles.tableHeader}>
                    <div className={styles.titleAndStatus}>
                        <h1>Mesa #{table.id}</h1>
                        
                        <select
                        className={styles.tablesSelect}
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
                        
                        <select name={idType}
                        className={styles.tablesSelect}
                        onChange={handleTableType}
                        defaultValue={
                            table.type === "eat in" ? "eat in" :
                            table.type === "takeaway" ? "takeaway" :
                            ""
                        }
                        >
                            <option value="eat in">Servir</option>
                            <option value="takeaway">Llevar</option>
                        </select>
                    </div>
                    <div className={styles.clients}>
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
                        <p>{table.currentClients}/{table.seats} Personas</p>
                        <div className="small-buttons-container">
                            <button className="small-button" onClick={handleAddClient} >+</button>
                            <button className="small-button" onClick={handleRemoveClient} >-</button>
                        </div>
                    </div>
                </header>

                <form className={styles.searchbar} role="search" onSubmit={(e) => e.preventDefault()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
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
                        placeholder="Buscar ítem para agregar al pedido ..."
                        aria-label="Buscar producto"
                        onFocus={() => setIsProductsOpen(true)}
                        name={idText}
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </form>

                {isProductsOpen && (
                    <div
                        className={styles.modalOverlay}
                        onClick={closeProdcutsModal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="products-dialog-title"
                        >
                        <div
                            className={styles.modalContent}
                            onClick={(e) => e.stopPropagation()}
                            >
                                <header className={styles.modalHeader}>
                                    <h2>Agregar Producto</h2>
                                    <button
                                        type="button"
                                        className={styles.modalCloseButton}
                                        onClick={closeProdcutsModal}
                                        aria-label="Cerrar"
                                        title="Cerrar (Esc)"
                                    >X
                                    </button>
                                </header>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Buscar producto ..."
                                    value={searchTerm}
                                    className={styles.searchbar}
                                    onChange={handleSearchChange}
                            />

                                <ProductsList products={filteredProducts} onAddProduct={handleAddProduct} />
                        </div>
                    </div>
                )}

                <Order
                    currentOrder={table.currentOrder}
                    onIncreaseButton={(lineId) => increaseOrderLine(table.id, lineId)}
                    onDecreaseButton={(lineId) => decreaseOrderLine(table.id, lineId)}
                />
            </section>

            <section>
                <ChecksList
                    tableId={table.id}
                    checks={table.checks}
                    selectedCheckId={selectedCheckId}
                    onSelectCheck={setSelectedCheckId}
                />
                <SplitOrder table={table} selectedCheckId={selectedCheckId} onDeleteSelectedCheck={handleDeleteSelectedCheck} />
            </section>
            
        </main>
    )
}