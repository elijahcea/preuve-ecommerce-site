import type { Metadata } from "next";
import Header from "@/src/components/header";
import Footer from "../components/footer";
import "./globals.css";
import { CartProvider } from "../contexts/cart-provider";
import { getCart } from "../dal/cart/queries";

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

  return (
    <html lang="en">
      <body className={`antialiased`}>
        <CartProvider cartPromise={cartPromise}>
          <Header />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
