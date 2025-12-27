import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loadTablesTemplate } from "../services/tableService"

function getAssignedQty(table, lineId) {
    return table.checks
        .flatMap((c) => c.items)
        .filter((i) => i.lineId === lineId)
        .reduce((sum, i) => sum + i.qty, 0)
}

function reconcileLineAssignments(table, lineId, nextOrderQty) {
    if (nextOrderQty <= 0) {
        return {
            ...table,
            checks: table.checks.map((check) => ({
                ...check,
                items: check.items.filter((i) => i.lineId !== lineId)
            }))
        }
    }

    const assigned = getAssignedQty(table, lineId)
    if (assigned <= nextOrderQty) return table

    let excess = assigned - nextOrderQty

    const nextChecks = [...table.checks].map((c) => ({
        ...c, items: [...c.items]
    }))

    for (let checkIndex = nextChecks.length - 1; checkIndex >= 0 && excess > 0; checkIndex--) {
        const check = nextChecks[checkIndex]
        const itemIndex = check.items.findIndex((i) => i.lineId === lineId)
        if (itemIndex === -1) continue // no match found

        const item = check.items[itemIndex]
        const dec = Math.min(item.qty, excess)
        const newQty = item.qty - dec
        excess -= dec

        if (newQty <= 0) {
            check.items.splice(itemIndex, 1) // item deleted
        } else {
            check.items[itemIndex] = {...item, qty: newQty}
        }
    }

    return {...table, checks: nextChecks }
}

export const useTablesStore = create(

    persist(
        (set, get) => ({
            tables: [],

            initializeTables: async () => {
                const current = get().tables
                if (current.length > 0) return

                const template = await loadTablesTemplate()
                const normalized = template.map((table) => ({
                    ...table,
                    currentClients: 0,
                    currentOrder: [],
                    checks: []
                }))

                set({ tables: normalized })
            },

            getTableById: (id) => {
                return get().tables.find((table) => table.id === Number(id))
            },

            updateTable: (id, updates) => {
                set({
                    tables: get().tables.map((table) =>
                        table.id === id ? { ...table, ...updates } : table
                    )
                })
            },

            resetTables: async () => {
                const template = await loadTablesTemplate()

                const normalized = template.map((table) => ({
                    ...table,
                    currentClients: 0,
                    currentOrder: [],
                    checks: []
                }))

                set({ tables: normalized })

                localStorage.removeItem("tablesStore")
            },
            
            createCheck: (tableId) => {
                set({
                    tables: get().tables.map(table =>
                        table.id === tableId 
                        ? {
                            ...table,
                            checks: [...table.checks,
                                {
                                    checkId: crypto.randomUUID(),
                                    name: `Cuenta ${table.checks.length + 1}`,
                                    items: [],
                                    status: "open"
                                }
                            ]
                        }
                        : table
                    )
                })
            },

            addProductToOrder: (tableId, product) => {
                set({
                    tables: get().tables.map((table) => {
                        if (table.id !== tableId) return table

                        const existing = table.currentOrder.find((line) => line.productId === product.id)

                        if (existing) {
                            const nextOrder = table.currentOrder.map((line) => 
                                line.productId === product.id ? { ...line, qty: line.qty + 1 } : line
                            )

                            return { ...table, currentOrder: nextOrder }
                        }

                        const nextOrder = [
                            ...table.currentOrder, {
                                lineId: crypto.randomUUID(),
                                productId: product.id,
                                name: product.name,
                                price: product.price,
                                qty: 1,
                            }
                        ]

                        return { ...table, currentOrder: nextOrder }
                    })
                })
            },

            increaseOrderLine: (tableId, lineId, qty = 1) => {
                set({
                    tables: get().tables.map((table) => {
                        if (table.id !== tableId) return table
                        
                        const line = table.currentOrder.find((l) => l.lineId === lineId)
                        if (!line) {
                            console.log(`LineId ${lineId} no encontrada`)
                            return table
                        }

                        const nextOrder = table.currentOrder.map((l) => 
                            l.lineId === lineId ? { ...l, qty: l.qty + qty } : l)

                        return { ...table, currentOrder: nextOrder }
                    })
                })
            },

            decreaseOrderLine: (tableId, lineId, qty = 1) => {
                set({
                    tables: get().tables.map((table) => {
                        if (tableId !== table.id) {
                            return table
                        }
                        
                        const line = table.currentOrder.find((l) => l.lineId === lineId)
                        if (!line) return table

                        const nextQty = line.qty - qty

                        if (nextQty <= 0) {
                            const nextTable = reconcileLineAssignments(table, lineId, 0)
                            return {
                                ...nextTable,
                                currentOrder: nextTable.currentOrder.filter((l) => l.lineId !== lineId)
                            }
                        }

                        const nextOrder = table.currentOrder.map((l) =>
                            l.lineId === lineId ? { ...l, qty: nextQty } : l)

                        const tableWithNextOrder = { ...table, currentOrder: nextOrder }
                        return reconcileLineAssignments(tableWithNextOrder, lineId, nextQty)
                    })
                })
            },

            resetCheck: (tableId) => {
                const emptyCheck = []
                set({
                    tables: get().tables.map(table =>
                        table.id === tableId 
                        ? {
                            ...table,
                            checks: emptyCheck
                        }
                        : table
                    )
                })
            },

            assignItemToCheck: (tableId, checkId, lineId, qty = 1) => {
                set({
                    tables: get().tables.map(table => {
                        if (table.id !== tableId) return table

                        const orderLine = table.currentOrder.find(l => l.lineId === lineId)
                        if (!orderLine) return table

                        const usedQty = table.checks
                            .flatMap(c => c.items)
                            .filter(i => i.lineId === lineId)
                            .reduce((a, b) => a + b.qty, 0)

                        if (usedQty + qty > orderLine.qty) return table

                        return {
                            ...table,
                            checks: table.checks.map(check => {
                                if (check.checkId !== checkId) return check

                                const existing = check.items.find(i => i.lineId === lineId)

                                return {
                                    ...check,
                                    items: existing
                                    ? check.items.map(i =>
                                        i.lineId === lineId
                                            ? { ...i, qty: i.qty + qty }
                                            : i
                                        )
                                    : [...check.items, { lineId, qty }]
                                }
                            })
                        }
                    })
                })
            },

            unassignItemFromCheck: (tableId, checkId, lineId, qty = 1) => {
                set({
                    tables: get().tables.map((table) => {
                        if (table.id !== tableId) return table
                        console.log("Table id: ", table.id)

                        return {
                            ...table,
                            checks: table.checks.map((check) => {
                                if (check.checkId !== checkId) return check

                                const existing = check.items.find((i) => i.lineId === lineId)
                                if (!existing) return check

                                const nextQty = existing.qty - qty

                                return {
                                    ...check,
                                    items:
                                    nextQty <= 0
                                        ? check.items.filter((i) => i.lineId !== lineId)
                                        : check.items.map((i) =>
                                            i.lineId === lineId ? { ...i, qty: nextQty } : i
                                        )
                                }
                            })
                        }
                    })
                })
            },
        }),
        {
            name: "tablesStore"
        }
    )
)