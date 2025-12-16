import { useState, useEffect } from "react"
import MenuSection from "../components/MenuSection"
import MenuNavbar from "../components/MenuNavbar"
import { useBusinessStore } from "../store/businessStore"

export default function Menu() {
    const [currentSection, setCurrentSection] = useState(null)

    const business = useBusinessStore((state) => state.business)

    useEffect(() => {
        if(!business) return

        if (!currentSection && business.menu.sections.length > 0) {
            setCurrentSection(business.menu.sections[0])
        }

    }, [business])

    if (!business || !currentSection) {
        return (
            <main>
                <small>Cargando ...</small>
            </main>
        )
    }

    const businessName = business.business.name
    const menuSections = business.menu.sections

    const handleSectionChange = (sectionId) => {
        const nextSection = menuSections.find((section) => section.id === sectionId)
        if (nextSection) {
            setCurrentSection(nextSection)
        }
    }

    return (
        <main>
            <meta
                name="description"
                content="Edita tu carta como prefieras, establece precios, fotos y más."
            />
            <h1>Menú - {businessName}</h1>
            <MenuNavbar
                sections={menuSections}
                onSectionChange={handleSectionChange}
                currentSection={currentSection.id}
            />
            <MenuSection section={currentSection} />
        </main>
    )
}