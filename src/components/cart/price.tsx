export default function Price({ 
    locale, 
    currency = "USD", 
    amount,
    styles = []
}: { 
    locale: string, 
    currency?: string, 
    amount: number,
    styles?: string[]
}) {
    return (
        <p className={styles.join(" ")}>
            {new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount)}
        </p>
    )
}