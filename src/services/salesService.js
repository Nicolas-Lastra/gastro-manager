const STORAGE_KEY = "salesHisotry"

export function loadSalesFromStorage() {

    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : null

    } catch(error) {
        console.error('Error loading sales history from localStorage:\n', error)
        return null
    }
}

export function registerSale(sale) {
    const sales = loadSalesFromStorage() || []
    sales.push(sale)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sales))
}