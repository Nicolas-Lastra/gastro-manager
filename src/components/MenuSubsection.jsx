import { DisplayItems } from "./MenuSection"

export default function MenuSubsection({ subsections }) {

    return (
        <>
            {subsections.map((subsection) => (
                <div key={subsection.id} className="menu-subsection">
                    <h3 >{subsection.name}</h3>
                    <DisplayItems items={subsection.items} />
                </div>              
            ) )}
        </>
    )
}