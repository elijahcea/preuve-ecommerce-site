import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Preuve New York",
  description: "Be the proof.",
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
