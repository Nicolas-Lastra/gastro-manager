import MenuSection from "./MenuSection"

export default function MenuList({ sections }) {

    return(
        <>
            {sections.map((section) => (
                <MenuSection key={section.id} section={section} />
            ))}
        </>
    )
}