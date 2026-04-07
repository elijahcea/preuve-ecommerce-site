import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex max-md:flex-col gap-4 items-center mt-auto justify-between p-6 text-xs">
      <ul className="flex max-md:flex-col items-center gap-4">
        <Link href="/faq">FAQ</Link>
        <Link href="/terms">TERMS & CONDITIONS</Link>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          INSTRAGRAM
        </a>
        <Link href="/contact">CONTACT US</Link>
      </ul>
      <div>
        © {year}, <Link href="/">PREUVE NY</Link>
      </div>
    </footer>
  );
}
