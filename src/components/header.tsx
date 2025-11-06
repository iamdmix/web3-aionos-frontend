"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletIcon } from "@heroicons/react/24/outline";
import { useWallet } from "@/contexts/WalletContext";
import { useState, useEffect } from "react";

export function Header() {
  const pathname = usePathname();
  const { isConnected, user, connect, disconnect } = useWallet();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-semibold text-gray-900">
              ProofChain
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/marketplace" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Marketplace
              </Link>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
            </nav>
            <div>
              <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-900">
            ProofChain
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/marketplace"
              className={`text-sm font-medium transition-colors ${
                pathname === "/marketplace"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Wallet Button */}
          <div>
            {isConnected && user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">{user.name}</span>
                <button
                  onClick={disconnect}
                  className="flex items-center space-x-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <WalletIcon className="h-4 w-4" />
                  <span>{truncateAddress(user.address)}</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
