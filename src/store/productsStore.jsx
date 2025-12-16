import { create } from "zustand"
import { loadProductsFromMenu } from '../services/productsService'

export const useProductsStore = create((set, get) => ({
    products: [],

    initializeProducts: async () => {
        if (get().products) return

        const loadedProducts = await loadProductsFromMenu()
        if (!loadedProducts?.length) return

        set({ products: loadedProducts })
    },

    getProductById: (id) => {
        get().products.find(product => product.id === id)
    }
})) 