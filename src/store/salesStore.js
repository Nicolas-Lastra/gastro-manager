import { create } from "zustand"
import { persist } from "zustand/middleware"
import localforage from "localforage"

const salesDB = localforage.createInstance({
    name: "gastro-manager",
    storeName: "sales"
})

export const useSalesStore = create(
    persist(
        (set, get) => ({
            sales: [],

            addSale: (sale) => {
                set({ sales: [sale, ...get().sales] })
            },

            getSalesByDay: (dateKey) =>
                get().sales.filter((s) => new Date(s.createdAt).toDateString() === dateKey)
        }),
        {
            name: "salesStore",
            storage: {
                getItem: async (name) => (await salesDB.getItem(name)) ?? null,
                setItem: async (name, value) => salesDB.setItem(name, value),
                removeItem: async (name) => salesDB.removeItem(name)
            }
        }
    )
)