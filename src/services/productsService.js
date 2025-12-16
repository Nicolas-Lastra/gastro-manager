export async function loadProductsFromMenu() {

    try {
        const response = await fetch('./business.json')
        if(!response.ok) throw new Error(`HTTP ${response.status}`)
        const json = response.json()
        const sections = json.menu.sections

        const products = []

        sections.forEach(section => {
            
            if (section.items) {
                section.items.forEach(item => {
                    products.push({ ...item, sectionId: section.id })
                })
            }

            if (section.subsections) {
                section.subsections.forEach(subsection => {
                    subsection.items.forEach(item => {
                        products.push({ ...item, sectionId: section.id })
                    })
                })
            }
        })

        return products

    } catch(error) {
        console.log('Error fetching products from menu.\n', error)
        return null
    }
}