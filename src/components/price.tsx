export default function Price({
    amount,
    locale = "en-US", 
    currency = "USD", 
    styles = []
}: {
    amount: number,
    locale?: string, 
    currency?: string, 
    styles?: string[]
}) {
    return (
        <p className={styles.join(" ")}>
            {new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount)}
        </p>
    )
}