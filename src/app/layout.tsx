import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeRegistry from './ThemeRegistry';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Pantry App",
  description: "Manage your pantry items",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ThemeRegistry>
        <body className={inter.className}>{children}</body>
      </ThemeRegistry>
    </html>
  );
}