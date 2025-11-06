"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  requestAccount,
  switchToSepolia,
  getAllProjects,
  getProjectsByClient,
  getProjectsByFreelancer,
  getCurrentNetwork,
  formatStatus,
  Project as BlockchainProject,
} from "@/lib/blockchain";

interface User {
  address: string;
  role: "client" | "freelancer" | "both";
  name?: string;
}

interface WalletContextType {
  isConnected: boolean;
  user: User | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  projects: Project[];
  refreshProjects: () => Promise<void>;
  loading: boolean;
}

interface Project {
  id: string;
  title: string;
  description: string;
  budget: string;
  deadline: string;
  status: "Open" | "Accepted" | "WorkSubmitted" | "Completed" | "Disputed";
  client: string;
  freelancer?: string;
  createdAt: Date;
  workSubmitted?: boolean;
  ipfsHash?: string;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Mock users for demo purposes
const mockUsers = [
  {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5",
    role: "both" as const,
    name: "Alice (Client & Freelancer)",
  },
  {
    address: "0x123d35Cc6634C0532925a3b8D4C9db96590b5",
    role: "freelancer" as const,
    name: "Bob (Freelancer)",
  },
  {
    address: "0x456d35Cc6634C0532925a3b8D4C9db96590b5",
    role: "client" as const,
    name: "Charlie (Client)",
  },
];

// Mock initial projects
const initialProjects: Project[] = [
  {
    id: "1",
    title: "Build a React Component",
    description:
      "Need a custom data visualization component for our dashboard application.",
    budget: "0.5",
    deadline: "2025-10-15",
    status: "WorkSubmitted",
    client: "0x742d35Cc6634C0532925a3b8D4C9db96590b5",
    freelancer: "0x123d35Cc6634C0532925a3b8D4C9db96590b5",
    createdAt: new Date("2025-09-20"),
    workSubmitted: true,
    ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
  },
  {
    id: "2",
    title: "Smart Contract Audit",
    description:
      "Security review needed for our DeFi protocol smart contracts.",
    budget: "2.0",
    deadline: "2025-10-20",
    status: "Open",
    client: "0x456d35Cc6634C0532925a3b8D4C9db96590b5",
    createdAt: new Date("2025-09-22"),
  },
  {
    id: "3",
    title: "Mobile App Design",
    description: "UI/UX design for a crypto wallet mobile application.",
    budget: "1.2",
    deadline: "2025-10-25",
    status: "Accepted",
    client: "0x742d35Cc6634C0532925a3b8D4C9db96590b5",
    freelancer: "0x123d35Cc6634C0532925a3b8D4C9db96590b5",
    createdAt: new Date("2025-09-21"),
  },
];

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);

  const convertBlockchainProject = (bp: BlockchainProject): Project => {
    // Extract title from description (first line before \n\n)
    const descLines = bp.description.split('\n\n');
    const title = descLines[0] || bp.description.substring(0, 50);
    const description = descLines[1] || bp.description;
    
    return {
      id: bp.id,
      title: title.substring(0, 100), // Limit title length
      description: description,
      budget: bp.amount,
      deadline: new Date(bp.deadline * 1000).toISOString().split('T')[0],
      status: formatStatus(bp.status) as Project['status'],
      client: bp.client,
      freelancer: bp.freelancer !== "0x0000000000000000000000000000000000000000" ? bp.freelancer : undefined,
      createdAt: new Date(), // We don't have creation time, use current
      workSubmitted: bp.deliverableIPFSHash !== "",
      ipfsHash: bp.deliverableIPFSHash || undefined,
    };
  };

  const refreshProjects = async () => {
    if (!isConnected) {
      console.log("Not connected, skipping project refresh");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching all projects from blockchain...");
      const blockchainProjects = await getAllProjects();
      console.log("Fetched projects:", blockchainProjects);
      
      if (blockchainProjects.length === 0) {
        console.log("No projects found on blockchain");
        setProjects([]);
      } else {
        const converted = blockchainProjects.map(convertBlockchainProject);
        console.log("Converted projects:", converted);
        setProjects(converted);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      
      // Don't alert on empty results, only on actual errors
      if (error instanceof Error && !error.message.includes("No projects")) {
        const errorMsg = error.message || 'Unknown error';
        console.error("Failed to fetch projects:", errorMsg);
        // Set empty array instead of throwing error
        setProjects([]);
      } else {
        // No projects is not an error
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const connect = async () => {
    console.log("Connect function called");
    console.log("window.ethereum available:", typeof window !== 'undefined' && typeof window.ethereum !== 'undefined');
    
    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      try {
        console.log("Attempting to connect to MetaMask...");
        
        // Check and switch to Sepolia network
        const currentChainId = await getCurrentNetwork();
        console.log("Current chain ID:", currentChainId);
        
        if (currentChainId !== 11155111) {
          console.log("Switching to Sepolia network...");
          await switchToSepolia();
        }

        // Request account access
        console.log("Requesting account access...");
        const address = await requestAccount();
        console.log("Connected address:", address);

        // Set up the user
        const userData = {
          address,
          role: "both" as const,
          name: `${address.slice(0, 6)}...${address.slice(-4)}`,
        };

        setUser(userData);
        setIsConnected(true);

        // Store in localStorage for persistence
        localStorage.setItem("connectedWallet", JSON.stringify(userData));

        // Fetch projects from blockchain
        console.log("Fetching projects from blockchain...");
        await refreshProjects();

        // Listen for account changes
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', handleAccountsChanged);
          window.ethereum.on('chainChanged', handleChainChanged);
          window.ethereum.on('disconnect', handleDisconnect);
        }
        
        console.log("Wallet connected successfully!");
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        alert("Failed to connect to MetaMask. Please make sure you're on Sepolia network and try again.");
      }
    } else {
      console.error("MetaMask not detected");
      alert("Please install MetaMask to use this feature!");
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      const newAddress = accounts[0];
      setUser(prev => prev ? {
        ...prev,
        address: newAddress,
        name: `${newAddress.slice(0, 6)}...${newAddress.slice(-4)}`
      } : null);
      await refreshProjects();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const disconnect = () => {
    setUser(null);
    setIsConnected(false);
    setProjects([]);
    localStorage.removeItem("connectedWallet");

    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
      window.ethereum.removeListener('disconnect', handleDisconnect);
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          const stored = localStorage.getItem("connectedWallet");
          if (stored) {
            const userData = JSON.parse(stored);
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0 && accounts[0].toLowerCase() === userData.address.toLowerCase()) {
              setUser(userData);
              setIsConnected(true);
              
              // Fetch projects from blockchain
              await refreshProjects();
              
              if (window.ethereum) {
                window.ethereum.on('accountsChanged', handleAccountsChanged);
                window.ethereum.on('chainChanged', handleChainChanged);
                window.ethereum.on('disconnect', handleDisconnect);
              }
            } else {
              localStorage.removeItem("connectedWallet");
            }
          }
        } catch (error) {
          console.error("Error checking wallet connection", error);
        }
      }
    };

    checkConnection();

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        user,
        connect,
        disconnect,
        projects,
        refreshProjects,
        loading,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

export type { User, Project };
