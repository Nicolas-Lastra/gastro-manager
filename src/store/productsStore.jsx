import { create } from "zustand"
import { loadProductsFromMenu } from '../services/productsService'

export const useProductsStore = create((set, get) => ({
    products: [],
    initialized: false,

    initializeProducts: async () => {
        if (get().initialized) return

        const loadedProducts = await loadProductsFromMenu()
        if (!loadedProducts?.length) return

        set({ products: loadedProducts, initialized: true })
    },

    getProductById: (id) => {
        return get().products.find(product => product.id === id)
    }
})) 