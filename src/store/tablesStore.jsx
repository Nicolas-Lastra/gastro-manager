import { create } from "zustand"
import { persist } from "zustand/middleware"
import { loadTablesTemplate } from "../services/tableService"

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
                    currentOrder: null
                }))

                set({ tables: normalized })
            },

            getTableById: (id) => {
                return get().tables.find((table) => table.id == id)
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
                    currentOrder: null
                }))

                set({ tables: normalized })

                localStorage.removeItem("tablesStore")
            }
        }),
        {
            name: "tablesStore"
        }
    )
)