const STORAGE_KEY = "tablesState"

export function loadTablesFromSotrage() {

    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : null

    } catch(error) {
        console.error('Error fetching data from localStorage ', error)
        return null
    }
}

export function saveTableStorage(tables) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables))
}

export async function loadTablesTemplate() {
    const res = await fetch('/tables.json')
    const json = await res.json()
    return json.tables
}