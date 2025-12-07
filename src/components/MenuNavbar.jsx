import styles from './MenuNavbar.module.css'

export default function MenuNavbar({ sections, onSectionChange, currentSection }) {

    const handleSectionChange = (sectionId) => {
        onSectionChange(sectionId)
    }

    return(
        <nav className={styles.navbarMenu}>
            {sections.map((section) => (
                <button
                    onClick={() => handleSectionChange(section.id)}
                    className={`${styles.navbarButton} ${styles.menuActive} ${currentSection === section.id ? styles.activeSection : ''}`}
                    key={`nav-${section.id}`}
                >
                    {section.name}
                </button>
            ))}
        </nav>
    )
}