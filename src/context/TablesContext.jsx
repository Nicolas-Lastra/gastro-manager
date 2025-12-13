import { createContext, use, useReducer, useEffect } from "react";
import { 
    loadTablesFromSotrage,
    saveTableStorage,
    loadTablesTemplate
} from "../services/tableService";

export const TablesContext = createContext()

function tablesReducer(state, action) {
    switch (action.type) {
        case "SET_TABLES":
            return action.payload

        case "UPDATE_TABLE":
            return state.map((table) => 
                table.id === action.payload.id
                    ? {...table, ...action.payload.updates}
                    : table
            )

        case "RESET_TABLES":
            return action.payload

        default:
            return state
    }
}

export function TablesProvider({ children }) {
    const [tables, dispatch] = useReducer(tablesReducer, [])

    // Initialize tables from localStorage or the json template
    useEffect(() => {
        async function intializeTables() {
            const localData = loadTablesFromSotrage()

            if (localData) {
                dispatch({
                    type: "SET_TABLES",
                    payload: localData
                })
            } else {
                const template = await loadTablesTemplate()
                const normalized = template.map((table) => ({
                    ...table,
                    currentClients: 0,
                    currentOrder: null
                }))

                dispatch({ type: "SET_TABLES", payload: normalized })
            }
        }

        intializeTables()

    }, [])

    // Save changes in localStorage
    useEffect(() => {
        if (tables.length > 0) {
            saveTableStorage(tables)
        }
    }, [tables])

    const updateTable = (id, updates) => {
        dispatch({ type: "UPDATE_TABLE", payload: {id, updates} })
    }

    const resetTables = async () => {
        const template = await loadTablesTemplate()

        const normalized = template.tables.map((table) => ({
            ...table,
            currentClients: 0,
            currentOrder: null
        }))

        dispatch({
            type: "RESET_TABLES",
            payload: normalized
        })

        localStorage.removeItem("tablesState")
    }

    const getTableById = (id) => tables.find((table) => table.id == id)

    const value = {
        tables,
        updateTable,
        getTableById,
        resetTables
    }

    return (
        <TablesContext
            value={value}
        >
            {children}
        </TablesContext>
    )
}

export function useTables() {
    // return use(TablesContext)
    const context = use(TablesContext)
    
    if (context === undefined) throw new Error('useTables must be within a TablesProvider')
    
    return context
}