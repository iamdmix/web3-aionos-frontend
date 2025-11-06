import { ethers } from "hardhat";

async function main() {
    console.log("Deploying FreelanceProofChain contract...");

    // Get the contract factory
    const FreelanceProofChain = await ethers.getContractFactory("FreelanceProofChain");

    // Deploy the contract
    const freelanceProofChain = await FreelanceProofChain.deploy();

    await freelanceProofChain.waitForDeployment();

    const contractAddress = await freelanceProofChain.getAddress();

    console.log("FreelanceProofChain deployed to:", contractAddress);
    console.log("Deployment transaction hash:", freelanceProofChain.deploymentTransaction()?.hash);

    // Wait for a few block confirmations
    console.log("Waiting for block confirmations...");
    await freelanceProofChain.deploymentTransaction()?.wait(5);

    console.log("Contract verified and ready!");
    console.log("\nSave this contract address for your frontend:");
    console.log("CONTRACT_ADDRESS=", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
