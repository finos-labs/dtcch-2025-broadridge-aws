import { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LoanLex",
  description: "Lexical analysis of loan documents",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>{children}</body>
    </html>
  );
}
