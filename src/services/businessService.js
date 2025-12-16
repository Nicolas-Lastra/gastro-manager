export async function loadBusiness() {
    
    try {
        const response = await fetch('/business.json')
        if(!response.ok) throw new Error(`HTTP ${response.status}`)
        const json = await response.json()
        return json

    } catch(error) {
        console.error('Error fetching raw data: \n', error)
        return null
    }
}