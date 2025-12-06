import { useState, useEffect } from "react"
import MenuList from "../components/MenuList"

export default function Menu() {
    const [loading, setLoading] = useState(true)
    const [businessName, setBusinessName] = useState('')
    const [menuSections, setMenuSections] = useState([])

    useEffect(() => {
        async function fetchMenu() {
            try {
                setLoading(true)

                const response = await fetch('/menu.json')
                const json = await response.json()

                setBusinessName(json.business.name)
                setMenuSections(json.menu.sections)
                setLoading(false)
            } catch(error) {
                console.error('Error fetching menu: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    return (
        <main>
            <meta name="description" content="Edita tu carta como prefieras, establece precios, fotos y más." />
            <h1>Menú</h1>
            {loading && <h2>{businessName}</h2>}
            <MenuList sections={menuSections} />
        </main>
    )
}