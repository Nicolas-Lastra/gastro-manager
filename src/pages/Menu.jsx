import { useState, useEffect } from "react"
import MenuSection from "../components/MenuSection"
import MenuNavbar from "../components/MenuNavbar"

export default function Menu() {
    const [loading, setLoading] = useState(true)
    const [businessName, setBusinessName] = useState('')
    const [menuSections, setMenuSections] = useState([])
    const [currentSection, setCurrentSection] = useState([])

    useEffect(() => {
        async function fetchMenu() {
            try {
                setLoading(true)

                const response = await fetch('/menu.json')
                const json = await response.json()

                setBusinessName(json.business.name)
                setMenuSections(json.menu.sections)
                setCurrentSection(json.menu.sections[0])
                setLoading(false)
            } catch(error) {
                console.error('Error fetching menu: ', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMenu()
    }, [])

    const handleSectionChange = (sectionId) => {
        setCurrentSection(menuSections.find(item => item.id === sectionId))
    }

    return (
        <main>
            <meta name="description" content="Edita tu carta como prefieras, establece precios, fotos y más." />
            <h1>Menú - {businessName}</h1>
            {loading && <small>Cargando ...</small>}
            <MenuNavbar sections={menuSections} onSectionChange={handleSectionChange} currentSection={currentSection.id} />
            {/* <MenuList sections={menuSections} /> */}
            <MenuSection section={currentSection} />
        </main>
    )
}