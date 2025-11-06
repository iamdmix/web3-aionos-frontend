import type React from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WalletProvider } from "@/contexts/WalletContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ProofChain - Decentralized Freelancing Platform",
  description:
    "Decentralized freelancing with verifiable trust through blockchain and IPFS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <body className="min-h-screen bg-white flex flex-col">
        <WalletProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </WalletProvider>
      </body>
    </html>
  );
}
