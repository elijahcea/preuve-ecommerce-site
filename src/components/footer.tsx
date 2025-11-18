import Link from "next/link"

export default function Footer() {
    return (
        <footer>
            <ul>
                <Link href="/faq">FAQ</Link>
                <Link href="/terms">TERMS & CONDITIONS</Link>
                <a href="https://www.instagram.com/" target="_blank">INSTRAGRAM</a>
                <Link href="/contact">CONTACT US</Link>
            </ul>
            <div>
                2025, <Link href="/">PREUVE NY</Link>
            </div>
        </footer>
    )
}