import { create } from "zustand"
import { loadBusiness } from "../services/businessService"

export const useBusinessStore = create((set, get) => ({

    business: null,

    initializeBusiness: async () => {
        if (get().business) return

        const loadedBusiness = await loadBusiness()
        if (!loadedBusiness?.menu?.sections?.length) return

        set({ business: loadedBusiness })
    }
}))