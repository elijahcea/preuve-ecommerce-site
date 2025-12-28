import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex mt-auto justify-between p-5 text-xs">
            <ul className="flex gap-5">
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