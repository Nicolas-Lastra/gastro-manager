export default function useSections() {

    const hasSubsections = (section) => {
        return Array.isArray(section.subsections) && section.subsections.length > 0
    }

    const hasDirectItems = (section) => {
        return Array.isArray(section.items) && section.items.length > 0
    }

    return {
        hasSubsections,
        hasDirectItems
    }
}