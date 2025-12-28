import type { Metadata } from "next";
import NavBar from "@/src/components/nav-bar";
import Footer from "../components/footer";
import "./globals.css";
import { CartProvider } from "../contexts/cart-provider";
import { getCart } from "../dal/cart/queries";
import { Roboto_Condensed } from "next/font/google";
import { getAllCollections } from "../dal/collection/queries";

const roboto_condensed = Roboto_Condensed({
    subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Preuve New York",
  description: "Be The Proof You Want To See",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartPromise = getCart();
  const collectionsPromise = getAllCollections();

  return (
    <html className="h-full" lang="en">
      <body className={`${roboto_condensed.className} antialiased h-full flex flex-col`}>
        <CartProvider cartPromise={cartPromise}>
          <NavBar collectionsPromise={collectionsPromise} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
