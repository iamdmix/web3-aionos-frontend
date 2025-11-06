// Contract configuration
export const CONTRACT_ADDRESS = "0x1a457bb399358b726ab275bda3d3dd778c8ad23a";
export const SEPOLIA_CHAIN_ID = 11155111;
export const NETWORK_NAME = "Sepolia";

export const CONTRACT_ABI = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "DisputeRaised",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "freelancer",
                "type": "address"
            }
        ],
        "name": "ProjectAccepted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "client",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "ProjectCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            }
        ],
        "name": "WorkApproved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "ipfsHash",
                "type": "string"
            }
        ],
        "name": "WorkSubmitted",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            }
        ],
        "name": "acceptProject",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            }
        ],
        "name": "approveWork",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_description",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_deadline",
                "type": "uint256"
            }
        ],
        "name": "createProject",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "getAddressStatistics",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "totalAsClient",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalAsFreelancer",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "completedAsClient",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "completedAsFreelancer",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalSpentAsClient",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalEarnedAsFreelancer",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllProjectIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllProjects",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_client",
                "type": "address"
            }
        ],
        "name": "getClientProjectIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_client",
                "type": "address"
            }
        ],
        "name": "getClientProjects",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_freelancer",
                "type": "address"
            }
        ],
        "name": "getFreelancerProjectIds",
        "outputs": [
            {
                "internalType": "uint256[]",
                "name": "",
                "type": "uint256[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_freelancer",
                "type": "address"
            }
        ],
        "name": "getFreelancerProjects",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOpenProjects",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getProjectCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256[]",
                "name": "_projectIds",
                "type": "uint256[]"
            }
        ],
        "name": "getProjectsByIds",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum FreelanceProofChain.ProjectStatus",
                "name": "_status",
                "type": "uint8"
            }
        ],
        "name": "getProjectsByStatus",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_start",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_end",
                "type": "uint256"
            }
        ],
        "name": "getProjectsInRange",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "address payable",
                        "name": "client",
                        "type": "address"
                    },
                    {
                        "internalType": "address payable",
                        "name": "freelancer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "deadline",
                        "type": "uint256"
                    },
                    {
                        "internalType": "enum FreelanceProofChain.ProjectStatus",
                        "name": "status",
                        "type": "uint8"
                    },
                    {
                        "internalType": "string",
                        "name": "deliverableIPFSHash",
                        "type": "string"
                    }
                ],
                "internalType": "struct FreelanceProofChain.Project[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalValueLocked",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            }
        ],
        "name": "projectExists",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "projects",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "address payable",
                "name": "client",
                "type": "address"
            },
            {
                "internalType": "address payable",
                "name": "freelancer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
            },
            {
                "internalType": "enum FreelanceProofChain.ProjectStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "internalType": "string",
                "name": "deliverableIPFSHash",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            }
        ],
        "name": "raiseDispute",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_projectId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_ipfsHash",
                "type": "string"
            }
        ],
        "name": "submitWork",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
] as const;
