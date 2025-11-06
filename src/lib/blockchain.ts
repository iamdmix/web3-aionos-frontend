import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, SEPOLIA_CHAIN_ID } from "./contract";

// Project status enum matching the smart contract
export enum ProjectStatus {
    Created = 0,
    Accepted = 1,
    WorkSubmitted = 2,
    Approved = 3,
    Disputed = 4,
}

export interface Project {
    id: string;
    description: string;
    client: string;
    freelancer: string;
    amount: string;
    deadline: number;
    status: ProjectStatus;
    deliverableIPFSHash: string;
}

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            const isCircuitBreakerError = 
                error.message?.includes('circuit breaker') ||
                error.code === -32603;
            
            if (i === maxRetries - 1 || !isCircuitBreakerError) {
                throw error;
            }
            
            const delayTime = baseDelay * Math.pow(2, i);
            console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delayTime}ms...`);
            await delay(delayTime);
        }
    }
    throw new Error('Max retries reached');
}

// Get provider (read-only)
export const getProvider = () => {
    if (typeof window !== "undefined" && window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
    }
    // Fallback to public RPC for read-only operations
    return new ethers.JsonRpcProvider("https://eth-sepolia.api.onfinality.io/public");
};

// Get signer (for write operations)
export const getSigner = async () => {
    if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask is not installed");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
};

// Get contract instance (read-only)
export const getContract = () => {
    const provider = getProvider();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// Get contract instance with signer (for write operations)
export const getContractWithSigner = async () => {
    const signer = await getSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};

// Check if MetaMask is installed
export const isMetaMaskInstalled = () => {
    return typeof window !== "undefined" && window.ethereum;
};

// Request account access
export const requestAccount = async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
        throw new Error("MetaMask is not installed");
    }
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    return accounts[0];
};

// Switch to Sepolia network
export const switchToSepolia = async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
        throw new Error("MetaMask is not installed");
    }

    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}` }],
        });
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902 && window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`,
                            chainName: "Sepolia Test Network",
                            nativeCurrency: {
                                name: "Sepolia ETH",
                                symbol: "ETH",
                                decimals: 18,
                            },
                            rpcUrls: ["https://eth-sepolia.api.onfinality.io/public"],
                            blockExplorerUrls: ["https://sepolia.etherscan.io"],
                        },
                    ],
                });
            } catch (addError) {
                throw new Error("Failed to add Sepolia network to MetaMask");
            }
        } else {
            throw switchError;
        }
    }
};

// Get current network
export const getCurrentNetwork = async () => {
    if (!isMetaMaskInstalled() || !window.ethereum) {
        return null;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    return Number(network.chainId);
};

// Create a new project
export const createProject = async (
    description: string,
    deadline: number,
    amountInEth: string
) => {
    return retryWithBackoff(async () => {
        const contract = await getContractWithSigner();
        const amountInWei = ethers.parseEther(amountInEth);

        console.log('Creating project with:', { description, deadline, amountInEth });
        
        const tx = await contract.createProject(description, deadline, {
            value: amountInWei,
            gasLimit: 300000, // Set explicit gas limit to avoid estimation calls
        });

        console.log('Transaction sent:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        
        return tx;
    });
};

// Get a single project by ID
export const getProject = async (projectId: number): Promise<Project> => {
    return retryWithBackoff(async () => {
        const contract = getContract();
        
        // Use the projects mapping to get a single project
        const project = await contract.projects(projectId);

        return {
            id: project.id.toString(),
            description: project.description,
            client: project.client,
            freelancer: project.freelancer,
            amount: ethers.formatEther(project.amount),
            deadline: Number(project.deadline),
            status: Number(project.status) as ProjectStatus,
            deliverableIPFSHash: project.deliverableIPFSHash,
        };
    });
};

// Helper function to verify contract is deployed and accessible
export const verifyContract = async (): Promise<boolean> => {
    try {
        const provider = getProvider();
        const code = await provider.getCode(CONTRACT_ADDRESS);
        
        if (code === "0x" || code === "0x0") {
            console.error("No contract deployed at address:", CONTRACT_ADDRESS);
            return false;
        }
        
        console.log("Contract verified at:", CONTRACT_ADDRESS);
        console.log("Contract code length:", code.length);
        return true;
    } catch (error) {
        console.error("Error verifying contract:", error);
        return false;
    }
};

// Diagnostic function to test contract connectivity
export const diagnoseContract = async () => {
    console.log("=== CONTRACT DIAGNOSTICS ===");
    console.log("Contract Address:", CONTRACT_ADDRESS);
    console.log("Expected Chain ID:", SEPOLIA_CHAIN_ID);
    
    try {
        // Check provider
        const provider = getProvider();
        const network = await provider.getNetwork();
        console.log("Connected Network:", network.name, "Chain ID:", Number(network.chainId));
        
        if (Number(network.chainId) !== SEPOLIA_CHAIN_ID) {
            console.error("❌ WRONG NETWORK! Expected Sepolia (11155111), got:", Number(network.chainId));
            return;
        }
        
        // Check contract deployment
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (code === "0x" || code === "0x0") {
            console.error("❌ NO CONTRACT AT ADDRESS:", CONTRACT_ADDRESS);
            console.log("Please verify:");
            console.log("1. Contract is deployed on Sepolia");
            console.log("2. CONTRACT_ADDRESS in lib/contract.ts matches your deployment");
            return;
        }
        console.log("✅ Contract found, code length:", code.length);
        
        // Try to call contract functions
        const contract = getContract();
        
        console.log("\nTesting contract functions:");
        
        // Test 1: getProjectCount
        try {
            console.log("Calling getProjectCount()...");
            const count = await contract.getProjectCount();
            console.log("✅ getProjectCount() =", count.toString());
        } catch (err: any) {
            console.error("❌ getProjectCount() failed:", err.message);
            console.log("This suggests ABI mismatch - the deployed contract may not have this function");
        }
        
        // Test 2: getAllProjects
        try {
            console.log("Calling getAllProjects()...");
            const projects = await contract.getAllProjects();
            console.log("✅ getAllProjects() returned", projects.length, "projects");
        } catch (err: any) {
            console.error("❌ getAllProjects() failed:", err.message);
        }
        
        // Test 3: Check if it's the old contract version
        try {
            console.log("\nChecking contract version...");
            console.log("Calling projects(1)...");
            const project = await contract.projects(1);
            console.log("✅ projects(1) accessible");
            console.log("Project data:", project);
        } catch (err: any) {
            console.error("❌ projects(1) failed:", err.message);
            console.log("No projects exist yet, or different contract structure");
        }
        
        console.log("\n=== DIAGNOSTICS COMPLETE ===");
        console.log("If you see ABI mismatch errors:");
        console.log("1. Verify CONTRACT_ADDRESS matches your latest deployment");
        console.log("2. Check CONTRACT_ABI in lib/contract.ts matches compiled contract");
        console.log("3. Ensure you deployed the FreelanceProofChain.sol with all view functions");
        
    } catch (error) {
        console.error("Diagnostic failed:", error);
    }
};

// Export for console access
if (typeof window !== 'undefined') {
    (window as any).diagnoseContract = diagnoseContract;
    (window as any).verifyContract = verifyContract;
}

// Get all projects (using new contract function with fallback)
export const getAllProjects = async (): Promise<Project[]> => {
    return retryWithBackoff(async () => {
        const contract = getContract();

        console.log("Fetching all projects from contract...");
        console.log("Contract address:", CONTRACT_ADDRESS);
        
        // First verify contract exists
        const isDeployed = await verifyContract();
        if (!isDeployed) {
            console.error("Contract not found at address. Please verify CONTRACT_ADDRESS in lib/contract.ts");
            return [];
        }
        
        try {
            // First, check if there are any projects
            console.log("Calling getProjectCount()...");
            const projectCount = await contract.getProjectCount();
            console.log(`Project count: ${projectCount.toString()}`);
            
            if (Number(projectCount) === 0) {
                console.log("No projects found in contract");
                return [];
            }
            
            console.log("Calling getAllProjects()...");
            // Use the new getAllProjects function from the contract
            const projectsData = await contract.getAllProjects();
            
            console.log(`Found ${projectsData.length} projects from contract`);
            console.log("Raw project data:", projectsData);

            // Map the contract data to our Project interface
            const projects = projectsData.map((project: any, index: number) => {
                console.log(`Mapping project ${index}:`, {
                    id: project.id.toString(),
                    description: project.description.substring(0, 50),
                    status: Number(project.status),
                    amount: ethers.formatEther(project.amount)
                });
                
                return {
                    id: project.id.toString(),
                    description: project.description,
                    client: project.client,
                    freelancer: project.freelancer,
                    amount: ethers.formatEther(project.amount),
                    deadline: Number(project.deadline),
                    status: Number(project.status) as ProjectStatus,
                    deliverableIPFSHash: project.deliverableIPFSHash,
                };
            });

            console.log(`Successfully mapped ${projects.length} projects`);
            return projects;
        } catch (error: any) {
            console.error("Error calling contract functions:", error);
            console.error("Error details:", {
                code: error.code,
                action: error.action,
                reason: error.reason,
                transaction: error.transaction
            });
            
            // If the contract itself is failing, return empty array
            // This likely means the contract is newly deployed or has a different ABI
            console.warn("Contract functions not accessible. Returning empty array.");
            return [];
        }
    });
};

// Accept a project
export const acceptProject = async (projectId: number) => {
    return retryWithBackoff(async () => {
        const contract = await getContractWithSigner();
        const tx = await contract.acceptProject(projectId, {
            gasLimit: 200000, // Set explicit gas limit
        });
        await tx.wait();
        return tx;
    });
};

// Submit work for a project
export const submitWork = async (projectId: number, ipfsHash: string) => {
    return retryWithBackoff(async () => {
        const contract = await getContractWithSigner();
        const tx = await contract.submitWork(projectId, ipfsHash, {
            gasLimit: 200000, // Set explicit gas limit
        });
        await tx.wait();
        return tx;
    });
};

// Approve work and release funds
export const approveWork = async (projectId: number) => {
    return retryWithBackoff(async () => {
        const contract = await getContractWithSigner();
        const tx = await contract.approveWork(projectId, {
            gasLimit: 200000, // Set explicit gas limit
        });
        await tx.wait();
        return tx;
    });
};

// Raise a dispute
export const raiseDispute = async (projectId: number) => {
    return retryWithBackoff(async () => {
        const contract = await getContractWithSigner();
        const tx = await contract.raiseDispute(projectId, {
            gasLimit: 200000, // Set explicit gas limit
        });
        await tx.wait();
        return tx;
    });
};

// Listen to contract events
export const listenToEvents = (
    eventName: string,
    callback: (...args: any[]) => void
) => {
    const contract = getContract();
    contract.on(eventName, callback);

    // Return cleanup function
    return () => {
        contract.off(eventName, callback);
    };
};

// Get projects by client address (using new contract function with fallback)
export const getProjectsByClient = async (clientAddress: string): Promise<Project[]> => {
    return retryWithBackoff(async () => {
        const contract = getContract();
        
        console.log(`Fetching projects for client ${clientAddress}...`);
        
        try {
            // Use the new getClientProjects function from the contract
            const projectsData = await contract.getClientProjects(clientAddress);
            
            // Map the contract data to our Project interface
            const projects = projectsData.map((project: any) => ({
                id: project.id.toString(),
                description: project.description,
                client: project.client,
                freelancer: project.freelancer,
                amount: ethers.formatEther(project.amount),
                deadline: Number(project.deadline),
                status: Number(project.status) as ProjectStatus,
                deliverableIPFSHash: project.deliverableIPFSHash,
            }));
            
            console.log(`Found ${projects.length} projects for client`);
            return projects;
        } catch (error: any) {
            console.error("Error in getClientProjects, using fallback:", error);
            
            // Fallback: filter from all projects
            const allProjects = await getAllProjects();
            return allProjects.filter(
                (project) => project.client.toLowerCase() === clientAddress.toLowerCase()
            );
        }
    });
};

// Get projects by freelancer address (using new contract function with fallback)
export const getProjectsByFreelancer = async (freelancerAddress: string): Promise<Project[]> => {
    return retryWithBackoff(async () => {
        const contract = getContract();
        
        console.log(`Fetching projects for freelancer ${freelancerAddress}...`);
        
        try {
            // Use the new getFreelancerProjects function from the contract
            const projectsData = await contract.getFreelancerProjects(freelancerAddress);
            
            // Map the contract data to our Project interface
            const projects = projectsData.map((project: any) => ({
                id: project.id.toString(),
                description: project.description,
                client: project.client,
                freelancer: project.freelancer,
                amount: ethers.formatEther(project.amount),
                deadline: Number(project.deadline),
                status: Number(project.status) as ProjectStatus,
                deliverableIPFSHash: project.deliverableIPFSHash,
            }));
            
            console.log(`Found ${projects.length} projects for freelancer`);
            return projects.filter((p: Project) => p.freelancer !== ethers.ZeroAddress);
        } catch (error: any) {
            console.error("Error in getFreelancerProjects, using fallback:", error);
            
            // Fallback: filter from all projects
            const allProjects = await getAllProjects();
            return allProjects.filter(
                (project) =>
                    project.freelancer.toLowerCase() === freelancerAddress.toLowerCase() &&
                    project.freelancer !== ethers.ZeroAddress
            );
        }
    });
};

// Get open projects (using new contract function with fallback)
export const getOpenProjects = async (): Promise<Project[]> => {
    return retryWithBackoff(async () => {
        const contract = getContract();
        
        console.log("Fetching open projects from contract...");
        
        try {
            // Use the new getOpenProjects function from the contract
            const projectsData = await contract.getOpenProjects();
            
            // Map the contract data to our Project interface
            const projects = projectsData.map((project: any) => ({
                id: project.id.toString(),
                description: project.description,
                client: project.client,
                freelancer: project.freelancer,
                amount: ethers.formatEther(project.amount),
                deadline: Number(project.deadline),
                status: Number(project.status) as ProjectStatus,
                deliverableIPFSHash: project.deliverableIPFSHash,
            }));
            
            console.log(`Found ${projects.length} open projects`);
            return projects;
        } catch (error: any) {
            console.error("Error in getOpenProjects, using fallback:", error);
            
            // Fallback: filter from all projects
            const allProjects = await getAllProjects();
            return allProjects.filter((project) => project.status === ProjectStatus.Created);
        }
    });
};

// Format status enum to string
export const formatStatus = (status: ProjectStatus): string => {
    switch (status) {
        case ProjectStatus.Created:
            return "Open";
        case ProjectStatus.Accepted:
            return "Accepted";
        case ProjectStatus.WorkSubmitted:
            return "WorkSubmitted";
        case ProjectStatus.Approved:
            return "Completed";
        case ProjectStatus.Disputed:
            return "Disputed";
        default:
            return "Unknown";
    }
};

// Get account balance
export const getAccountBalance = async (address: string): Promise<string> => {
    const provider = getProvider();
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
};

// Get total number of projects created (using new contract function)
export const getTotalProjectsCount = async (): Promise<number> => {
    const contract = getContract();
    
    try {
        const count = await contract.getProjectCount();
        return Number(count);
    } catch (error) {
        console.error("Error in getTotalProjectsCount:", error);
        throw error;
    }
};

// Get projects by status (using new contract function)
export const getProjectsByStatus = async (status: ProjectStatus): Promise<Project[]> => {
    const contract = getContract();
    
    try {
        console.log(`Fetching projects with status ${status}...`);
        
        // Use the new getProjectsByStatus function from the contract
        const projectsData = await contract.getProjectsByStatus(status);
        
        // Map the contract data to our Project interface
        const projects = projectsData.map((project: any) => ({
            id: project.id.toString(),
            description: project.description,
            client: project.client,
            freelancer: project.freelancer,
            amount: ethers.formatEther(project.amount),
            deadline: Number(project.deadline),
            status: Number(project.status) as ProjectStatus,
            deliverableIPFSHash: project.deliverableIPFSHash,
        }));
        
        console.log(`Found ${projects.length} projects with status ${status}`);
        return projects;
    } catch (error) {
        console.error("Error in getProjectsByStatus:", error);
        throw error;
    }
};

// Get accepted projects (projects in progress)
export const getAcceptedProjects = async (): Promise<Project[]> => {
    return getProjectsByStatus(ProjectStatus.Accepted);
};

// Get work submitted projects (pending client approval)
export const getWorkSubmittedProjects = async (): Promise<Project[]> => {
    return getProjectsByStatus(ProjectStatus.WorkSubmitted);
};

// Get completed projects
export const getCompletedProjects = async (): Promise<Project[]> => {
    return getProjectsByStatus(ProjectStatus.Approved);
};

// Get disputed projects
export const getDisputedProjects = async (): Promise<Project[]> => {
    return getProjectsByStatus(ProjectStatus.Disputed);
};

// Check if an address is the client of a project
export const isProjectClient = async (projectId: number, address: string): Promise<boolean> => {
    const project = await getProject(projectId);
    return project.client.toLowerCase() === address.toLowerCase();
};

// Check if an address is the freelancer of a project
export const isProjectFreelancer = async (projectId: number, address: string): Promise<boolean> => {
    const project = await getProject(projectId);
    return (
        project.freelancer.toLowerCase() === address.toLowerCase() &&
        project.freelancer !== ethers.ZeroAddress
    );
};

// Get project statistics for an address (using new contract function)
export const getAddressStatistics = async (address: string) => {
    const contract = getContract();
    
    try {
        console.log(`Fetching statistics for address ${address}...`);
        
        // Use the new getAddressStatistics function from the contract
        const stats = await contract.getAddressStatistics(address);
        
        return {
            totalAsClient: Number(stats.totalAsClient),
            totalAsFreelancer: Number(stats.totalAsFreelancer),
            completedAsClient: Number(stats.completedAsClient),
            completedAsFreelancer: Number(stats.completedAsFreelancer),
            activeAsClient: Number(stats.totalAsClient) - Number(stats.completedAsClient),
            activeAsFreelancer: Number(stats.totalAsFreelancer) - Number(stats.completedAsFreelancer),
            disputedAsClient: 0, // Would need additional contract function
            disputedAsFreelancer: 0, // Would need additional contract function
            totalSpent: ethers.formatEther(stats.totalSpentAsClient),
            totalEarned: ethers.formatEther(stats.totalEarnedAsFreelancer),
        };
    } catch (error) {
        console.error("Error in getAddressStatistics:", error);
        throw error;
    }
};// Calculate total amount locked in a project
export const getProjectAmount = async (projectId: number): Promise<string> => {
    const project = await getProject(projectId);
    return project.amount;
};

// Calculate total earnings for a freelancer (from completed projects)
export const getFreelancerEarnings = async (freelancerAddress: string): Promise<string> => {
    const projects = await getProjectsByFreelancer(freelancerAddress);
    const completedProjects = projects.filter((p) => p.status === ProjectStatus.Approved);

    const totalEarnings = completedProjects.reduce((sum, project) => {
        return sum + parseFloat(project.amount);
    }, 0);

    return totalEarnings.toFixed(4);
};

// Calculate total spent by a client
export const getClientSpent = async (clientAddress: string): Promise<string> => {
    const projects = await getProjectsByClient(clientAddress);
    const completedProjects = projects.filter((p) => p.status === ProjectStatus.Approved);

    const totalSpent = completedProjects.reduce((sum, project) => {
        return sum + parseFloat(project.amount);
    }, 0);

    return totalSpent.toFixed(4);
};

// Calculate total amount locked (escrowed) by a client
export const getClientLockedAmount = async (clientAddress: string): Promise<string> => {
    const projects = await getProjectsByClient(clientAddress);
    const activeProjects = projects.filter(
        (p) => p.status !== ProjectStatus.Approved && p.status !== ProjectStatus.Disputed
    );

    const totalLocked = activeProjects.reduce((sum, project) => {
        return sum + parseFloat(project.amount);
    }, 0);

    return totalLocked.toFixed(4);
};

// Check if a deadline has passed
export const isDeadlinePassed = (deadline: number): boolean => {
    return Date.now() / 1000 > deadline;
};

// Get time remaining until deadline (in seconds)
export const getTimeUntilDeadline = (deadline: number): number => {
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, deadline - now);
};

// Format time remaining in human-readable format
export const formatTimeRemaining = (seconds: number): string => {
    if (seconds <= 0) return "Expired";

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
};

// Validate IPFS hash format
export const isValidIPFSHash = (hash: string): boolean => {
    // Basic IPFS hash validation (Qm... format or baf... format)
    return /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|baf[0-9a-z]{50,})$/.test(hash);
};

// Get IPFS gateway URL
export const getIPFSUrl = (hash: string): string => {
    if (!hash) return "";
    return `https://ipfs.io/ipfs/${hash}`;
};

// Get multiple IPFS gateway URLs (for redundancy)
export const getIPFSUrls = (hash: string): string[] => {
    if (!hash) return [];
    return [
        `https://ipfs.io/ipfs/${hash}`,
        `https://gateway.pinata.cloud/ipfs/${hash}`,
        `https://cloudflare-ipfs.com/ipfs/${hash}`,
        `https://dweb.link/ipfs/${hash}`,
    ];
};

// Wait for transaction with custom confirmations
export const waitForTransaction = async (
    txHash: string,
    confirmations: number = 1
): Promise<void> => {
    const provider = getProvider();
    console.log(`Waiting for ${confirmations} confirmation(s) for transaction ${txHash}...`);
    const receipt = await provider.waitForTransaction(txHash, confirmations);
    if (receipt?.status === 0) {
        throw new Error("Transaction failed");
    }
    console.log(`Transaction ${txHash} confirmed!`);
};

// Estimate gas for creating a project
export const estimateCreateProjectGas = async (
    description: string,
    deadline: number,
    amountInEth: string
): Promise<string> => {
    try {
        const contract = await getContractWithSigner();
        const amountInWei = ethers.parseEther(amountInEth);

        const gasEstimate = await contract.createProject.estimateGas(
            description,
            deadline,
            { value: amountInWei }
        );

        return ethers.formatUnits(gasEstimate, "gwei");
    } catch (error) {
        console.error("Error estimating gas:", error);
        return "0";
    }
};

// Get gas price
export const getCurrentGasPrice = async (): Promise<string> => {
    const provider = getProvider();
    const feeData = await provider.getFeeData();
    return ethers.formatUnits(feeData.gasPrice || 0, "gwei");
};

// Export transaction history for an address
export const getTransactionHistory = async (address: string) => {
    const allProjects = await getAllProjects();

    const transactions = [];

    // Projects created by address (as client)
    const asClient = allProjects.filter(
        (p) => p.client.toLowerCase() === address.toLowerCase()
    );
    for (const project of asClient) {
        transactions.push({
            type: "PROJECT_CREATED",
            projectId: project.id,
            amount: project.amount,
            status: formatStatus(project.status),
            timestamp: project.deadline,
        });
    }

    // Projects accepted/completed by address (as freelancer)
    const asFreelancer = allProjects.filter(
        (p) => p.freelancer.toLowerCase() === address.toLowerCase() &&
            p.freelancer !== ethers.ZeroAddress
    );
    for (const project of asFreelancer) {
        if (project.status === ProjectStatus.Approved) {
            transactions.push({
                type: "PAYMENT_RECEIVED",
                projectId: project.id,
                amount: project.amount,
                status: formatStatus(project.status),
                timestamp: project.deadline,
            });
        }
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
};

