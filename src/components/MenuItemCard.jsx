import styles from './MenuItemCard.module.css'

export default function MenuItemCard({ item }) {

    return (
        <article className={styles.itemCard}>
            <div className={styles.descriptionContainer}>
                <small>$ {item.price}</small>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
            </div>
            <img src={`${item.id}.webp`} alt={`${item.name}`} />
        </article>
    )
}