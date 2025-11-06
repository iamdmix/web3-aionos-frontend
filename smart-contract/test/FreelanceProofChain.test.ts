const { ethers } = require("hardhat");
const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("FreelanceProofChain", function () {

  // A fixture to set up the initial state for each test
  async function deployFreelanceProofChainFixture() {
    // Get multiple signer accounts for different roles
    const [owner, freelancer, thirdParty] = await ethers.getSigners();

    const FreelanceProofChain = await ethers.getContractFactory("FreelanceProofChain");
    const contract = await FreelanceProofChain.deploy();

    return { contract, owner, freelancer, thirdParty };
  }

  // Test suite for the createProject function
  describe("createProject", function () {
    it("Should allow a client to create a project and escrow funds", async function () {
      const { contract, owner } = await loadFixture(deployFreelanceProofChainFixture);
      const projectDescription = "Build a new website";
      const projectDeadline = Math.floor(Date.now() / 1000) + 86400; // 1 day from now
      const escrowAmount = ethers.parseEther("1.0");

      await expect(contract.createProject(projectDescription, projectDeadline, { value: escrowAmount }))
        .to.emit(contract, "ProjectCreated")
        .withArgs(1, owner.address, escrowAmount);

      const newProject = await contract.projects(1);
      expect(newProject.id).to.equal(1);
      expect(newProject.client).to.equal(owner.address);
      expect(newProject.amount).to.equal(escrowAmount);
      expect(newProject.status).to.equal(0); // Enum ProjectStatus.Created
    });

    it("Should fail if no funds are sent", async function () {
      const { contract } = await loadFixture(deployFreelanceProofChainFixture);
      await expect(contract.createProject("Test", 0, { value: 0 }))
        .to.be.revertedWith("Amount must be greater than zero.");
    });
  });

  // Test suite for the acceptProject function
  describe("acceptProject", function () {
    it("Should allow a freelancer to accept a project", async function () {
      const { contract, freelancer } = await loadFixture(deployFreelanceProofChainFixture);
      await contract.createProject("Test", 0, { value: ethers.parseEther("1.0") });

      await expect(contract.connect(freelancer).acceptProject(1))
        .to.emit(contract, "ProjectAccepted")
        .withArgs(1, freelancer.address);

      const project = await contract.projects(1);
      expect(project.freelancer).to.equal(freelancer.address);
      expect(project.status).to.equal(1); // Enum ProjectStatus.Accepted
    });

    it("Should prevent the client from accepting their own project", async function () {
      const { contract, owner } = await loadFixture(deployFreelanceProofChainFixture);
      await contract.createProject("Test", 0, { value: ethers.parseEther("1.0") });

      await expect(contract.connect(owner).acceptProject(1))
        .to.be.revertedWith("Client cannot accept their own project.");
    });
  });

  // Test suite for the submitWork function
  describe("submitWork", function () {
    it("Should allow the assigned freelancer to submit work", async function () {
      const { contract, freelancer } = await loadFixture(deployFreelanceProofChainFixture);
      const ipfsHash = "Qm...";
      await contract.createProject("Test", 0, { value: ethers.parseEther("1.0") });
      await contract.connect(freelancer).acceptProject(1);

      await expect(contract.connect(freelancer).submitWork(1, ipfsHash))
        .to.emit(contract, "WorkSubmitted")
        .withArgs(1, ipfsHash);

      const project = await contract.projects(1);
      expect(project.deliverableIPFSHash).to.equal(ipfsHash);
      expect(project.status).to.equal(2); // Enum ProjectStatus.WorkSubmitted
    });
  });

  // Test suite for the approveWork function
  describe("approveWork", function () {
    it("Should allow the client to approve work and release funds", async function () {
      const { contract, owner, freelancer } = await loadFixture(deployFreelanceProofChainFixture);
      const escrowAmount = ethers.parseEther("1.0");
      await contract.connect(owner).createProject("Test", 0, { value: escrowAmount });
      await contract.connect(freelancer).acceptProject(1);
      await contract.connect(freelancer).submitWork(1, "Qm...");

      await expect(contract.connect(owner).approveWork(1))
        .to.changeEtherBalances([freelancer, contract], [escrowAmount, ethers.parseEther("-1.0")]);

      const project = await contract.projects(1);
      expect(project.status).to.equal(3); // Enum ProjectStatus.Approved
    });
  });

  // Test suite for the raiseDispute function
  describe("raiseDispute", function () {
    it("Should allow the client to raise a dispute", async function () {
      const { contract, owner } = await loadFixture(deployFreelanceProofChainFixture);
      await contract.createProject("Test", 0, { value: ethers.parseEther("1.0") });

      await expect(contract.connect(owner).raiseDispute(1))
        .to.emit(contract, "DisputeRaised")
        .withArgs(1);

      const project = await contract.projects(1);
      expect(project.status).to.equal(4); // Enum ProjectStatus.Disputed
    });

    it("Should allow the freelancer to raise a dispute", async function () {
      const { contract, freelancer } = await loadFixture(deployFreelanceProofChainFixture);
      await contract.createProject("Test", 0, { value: ethers.parseEther("1.0") });
      await contract.connect(freelancer).acceptProject(1);

      await expect(contract.connect(freelancer).raiseDispute(1))
        .to.emit(contract, "DisputeRaised")
        .withArgs(1);

      const project = await contract.projects(1);
      expect(project.status).to.equal(4); // Enum ProjectStatus.Disputed
    });

    it("Should prevent a third party from raising a dispute", async function () {
      const { contract, thirdParty } = await loadFixture(deployFreelanceProofChainFixture);
      await contract.createProject("Test", 0, { value: ethers.parseEther("1.0") });

      await expect(contract.connect(thirdParty).raiseDispute(1))
        .to.be.revertedWith("Only client or freelancer can dispute.");
    });
  });
});