import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preuve New York",
  description: "Be The Proof You Want To See",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
