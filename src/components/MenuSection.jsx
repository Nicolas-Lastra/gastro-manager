import MenuItemCard from "./MenuItemCard"
import useSections from "../hooks/useSections"
import MenuSubsection from "./MenuSubsection"

export function DisplayItems({ items }) {

    return(
        <>
            {items.map((item) => (
                <MenuItemCard key={item.id} item={item} />
            ))}
        </>
    )
}

export default function MenuSection({ section }) {

    const {hasSubsections, hasDirectItems} = useSections()
    
    return (
        <div className="menu-section">
            <h2>{section.name}</h2>
            {hasDirectItems(section) && <>
                <div className="menu-subsection">
                    <DisplayItems items={section.items}/>
                </div>
            </>}
            {hasSubsections(section) && <MenuSubsection subsections={section.subsections} />}
        </div>
    )
}