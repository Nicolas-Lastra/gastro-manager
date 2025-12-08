import MenuItemCard from "./MenuItemCard"
import useSections from "../hooks/useSections"
import MenuSubsection from "./MenuSubsection"
import { useEffect, useRef } from "react"
import gsap from "gsap"

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
    const sectionRef = useRef(null)

    useEffect(() => {
        if(!sectionRef.current) return
        const cards = sectionRef.current.querySelectorAll("article")
        if(!cards.length) return

        // gsap.from(cards, {
        //     opacity: 0,
        //     y: 20,
        //     duration: 0.4,
        //     stagger: 0.06,
        //     ease: 'power2.out'
        // })

        gsap.from(cards, {
            scale: .9,
            opacity: 0,
            stagger: 0.06
        })

    }, [section])
    
    return (
        <div className="menu-section" ref={sectionRef}>
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