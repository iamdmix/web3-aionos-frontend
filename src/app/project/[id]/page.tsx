"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { useWallet } from "@/contexts/WalletContext";
import {
  getProject,
  acceptProject,
  submitWork,
  approveWork,
  raiseDispute,
  formatStatus,
  Project as BlockchainProject,
} from "@/lib/blockchain";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, isConnected } = useWallet();
  const [project, setProject] = useState<BlockchainProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [ipfsInput, setIpfsInput] = useState("");

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    setLoading(true);
    try {
      const projectId = parseInt(id, 10);
      if (isNaN(projectId)) {
        throw new Error("Invalid project ID");
      }
      const projectData = await getProject(projectId);
      setProject(projectData);
    } catch (error) {
      console.error("Error loading project:", error);
      alert("Failed to load project. Make sure the project ID is valid.");
    } finally {
      setLoading(false);
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return "-";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleAccept = async () => {
    if (!isConnected || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    setSubmitting(true);
    try {
      const projectId = parseInt(id, 10);
      await acceptProject(projectId);
      alert("Project accepted successfully!");
      await loadProject();
    } catch (error: any) {
      console.error("Error accepting project:", error);
      alert(`Failed to accept project: ${error.message || error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!isConnected || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!window.confirm("Are you sure you want to approve this work and release funds?")) {
      return;
    }

    setSubmitting(true);
    try {
      const projectId = parseInt(id, 10);
      await approveWork(projectId);
      alert("Work approved and funds released successfully!");
      await loadProject();
    } catch (error: any) {
      console.error("Error approving work:", error);
      alert(`Failed to approve work: ${error.message || error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDispute = async () => {
    if (!isConnected || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    if (!window.confirm("Are you sure you want to raise a dispute?")) {
      return;
    }

    setSubmitting(true);
    try {
      const projectId = parseInt(id, 10);
      await raiseDispute(projectId);
      alert("Dispute raised successfully!");
      await loadProject();
    } catch (error: any) {
      console.error("Error raising dispute:", error);
      alert(`Failed to raise dispute: ${error.message || error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitWork = async () => {
    if (!isConnected || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    const ipfsHash = window.prompt("Enter IPFS hash of your work:");
    if (!ipfsHash) return;

    setSubmitting(true);
    try {
      const projectId = parseInt(id, 10);
      await submitWork(projectId, ipfsHash);
      alert("Work submitted successfully!");
      await loadProject();
    } catch (error: any) {
      console.error("Error submitting work:", error);
      alert(`Failed to submit work: ${error.message || error}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: number) => {
    const statusText = formatStatus(status);
    const baseClasses =
      "inline-flex px-2 py-1 text-xs font-medium rounded-full";
    switch (statusText) {
      case "Open":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "Accepted":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "WorkSubmitted":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "Completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Disputed":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found</p>
          <Link href="/marketplace">
            <Button className="mt-4">Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isClient = user?.address && project.client && user.address.toLowerCase() === project.client.toLowerCase();
  const isFreelancer = user?.address && project.freelancer && project.freelancer !== "0x0000000000000000000000000000000000000000" && user.address.toLowerCase() === project.freelancer.toLowerCase();
  const canAcceptProject = user?.address && !isClient && project.status === 0 && (!project.freelancer || project.freelancer === "0x0000000000000000000000000000000000000000");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{project.description}</h1>

      {/* Details Section */}
      <Card className="p-6 mb-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Status
            </label>
            <span className={getStatusBadge(project.status)}>
              {formatStatus(project.status)}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Client Address
              </label>
              <Link
                href={`/profile/${project.client}`}
                className="block text-sm text-gray-900 hover:text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded border break-all"
                title={project.client}
              >
                {truncateAddress(project.client)}
              </Link>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Freelancer Address
              </label>
              {project.freelancer && project.freelancer !== "0x0000000000000000000000000000000000000000" ? (
                <Link
                  href={`/profile/${project.freelancer}`}
                  className="block text-sm text-gray-900 hover:text-gray-700 font-mono bg-gray-50 px-3 py-2 rounded border break-all"
                  title={project.freelancer}
                >
                  {truncateAddress(project.freelancer)}
                </Link>
              ) : (
                <div className="text-sm text-gray-500 bg-yellow-50 px-3 py-2 rounded border border-yellow-200">
                  Not yet assigned (Open for any freelancer)
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Project Amount
            </label>
            <div className="text-lg text-gray-900 font-semibold">
              {project.amount} ETH
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">
              Deadline
            </label>
            <div className="text-sm text-gray-900">
              {new Date(project.deadline * 1000).toLocaleDateString()}
            </div>
          </div>
        </div>
      </Card>

      {/* Deliverable Section */}
      <Card className="p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Work Submission
        </h2>
        {project.deliverableIPFSHash ? (
          <div className="text-center py-8">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                Work Submitted
              </span>
            </div>
            <a
              href={`https://ipfs.io/ipfs/${project.deliverableIPFSHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" className="px-4 py-2">
                View on IPFS
              </Button>
            </a>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Awaiting submission from the freelancer.
          </div>
        )}
      </Card>

      {/* Contextual Actions */}
      {!isConnected && (
        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <p className="text-center text-yellow-800">
            Please connect your wallet to interact with this project
          </p>
        </Card>
      )}

      {isConnected && canAcceptProject && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            💼 Available Project
          </h2>
          <p className="text-gray-700 mb-4">
            This project is open and waiting for a freelancer. You can accept it and start working!
          </p>
          <Button
            onClick={handleAccept}
            variant="primary"
            className="w-full sm:w-auto px-6 py-3 text-base"
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Accept Project & Start Working"}
          </Button>
        </Card>
      )}

      {isConnected && isClient && project.status === 0 && (
        <Card className="p-6 bg-gray-50 border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            ⏳ Waiting for Freelancer
          </h2>
          <p className="text-gray-700">
            Your project is listed on the marketplace. Any freelancer can accept and start working on it.
          </p>
        </Card>
      )}

      {isConnected && project.status === 1 && isFreelancer && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <Button
            onClick={handleSubmitWork}
            variant="primary"
            className="w-full sm:w-auto px-6 py-3 text-base"
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Submit Work"}
          </Button>
        </Card>
      )}

      {isConnected && project.status === 2 && isClient && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleApprove}
              variant="primary"
              className="px-6 py-3 text-base"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Approve & Release Funds"}
            </Button>
            <button
              onClick={handleDispute}
              className="rounded-md border border-red-300 bg-white px-6 py-3 text-base font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? "Processing..." : "Raise Dispute"}
            </button>
          </div>
        </Card>
      )}

      {isConnected && (isClient || isFreelancer) && project.status === 1 && (
        <Card className="p-6 mt-4">
          <button
            onClick={handleDispute}
            className="w-full sm:w-auto rounded-md border border-red-300 bg-white px-6 py-3 text-base font-medium text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? "Processing..." : "Raise Dispute"}
          </button>
        </Card>
      )}
    </div>
  );
}
