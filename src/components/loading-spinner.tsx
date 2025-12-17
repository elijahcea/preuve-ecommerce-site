import { ArrowPathIcon } from "@heroicons/react/24/outline"

export default function LoadingSpinner({ 
    styles = ["animate-spin", "[animation-duration:2s]", "size-6"] 
}: { 
    styles?: string[] 
}) {
    return (
        <ArrowPathIcon aria-hidden="true" className={styles.join(" ")} />
    )
}