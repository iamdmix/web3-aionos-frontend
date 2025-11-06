"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { useWallet } from "@/contexts/WalletContext";
import { useUserProjects } from "@/lib/useBlockchain";

export default function DashboardPage() {
  const { isConnected, user, loading: walletLoading, refreshProjects } = useWallet();
  const { asClient, asFreelancer, loading: projectsLoading, refetch } = useUserProjects(
    user?.address || null
  );
  const loading = walletLoading || projectsLoading;
  const [activeTab, setActiveTab] = useState<"client" | "freelancer">("client");

  const handleRefresh = async () => {
    console.log("Manually refreshing projects...");
    await Promise.all([refreshProjects(), refetch()]);
  };

  if (!isConnected || !user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Dashboard
        </h1>

        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Wallet Connection Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to view your projects and dashboard.
          </p>
        </Card>
      </div>
    );
  }

  // Use projects from blockchain hook
  const userProjects = {
    asClient: asClient,
    asFreelancer: asFreelancer,
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Accepted":
        return "bg-blue-100 text-blue-800";
      case "WorkSubmitted":
        return "bg-purple-100 text-purple-800";
      case "Open":
        return "bg-yellow-100 text-yellow-800";
      case "Disputed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Dashboard</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
        <Button 
          variant="secondary" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Projects"}
        </Button>
      </div>

      {/* Tabbed Interface */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("client")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "client"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              As Client
            </button>
            <button
              onClick={() => setActiveTab("freelancer")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "freelancer"
                  ? "border-gray-900 text-gray-900"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              As Freelancer
            </button>
          </nav>
        </div>
      </div>

      {/* Project Lists */}
      <div className="space-y-4 mb-8">
        {activeTab === "client" ? (
          <>
              {userProjects.asClient.length > 0 ? (
                userProjects.asClient.map((project) => {
                  const title = project.description ? project.description.split('\n')[0].substring(0, 50) : 'Untitled';
                  const statusText = String(project.status);
                  return (
                    <Card key={project.id} className="p-6" hover>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {title}
                            </h3>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                                statusText
                              )}`}
                            >
                              {statusText}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Budget: {project.amount} ETH | Project ID: {project.id}
                          </p>
                        </div>
                      <Link
                        href={`/project/${project.id}`}
                        className="text-gray-600 hover:text-gray-900 ml-4"
                      >
                        View Details {'\u2192'}
                      </Link>
                      </div>
                    </Card>
                  );
                })
              ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600">
                  No projects created yet as a client.
                </p>
                <Link href="/create" className="mt-4 inline-block">
                  <Button variant="primary">Create Your First Project</Button>
                </Link>
              </Card>
            )}
          </>
        ) : (
          <>
            {userProjects.asFreelancer.length > 0 ? (
              userProjects.asFreelancer.map((project) => {
                const title = project.description ? project.description.split('\n')[0].substring(0, 50) : 'Untitled';
                const statusText = String(project.status);
                return (
                  <Card key={project.id} className="p-6" hover>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                          </h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                              statusText
                            )}`}
                          >
                            {statusText}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Budget: {project.amount} ETH | Project ID: {project.id}
                        </p>
                      </div>
                      <Link
                        href={`/project/${project.id}`}
                        className="text-gray-600 hover:text-gray-900 ml-4"
                      >
                        View Details {'\u2192'}
                      </Link>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="p-8 text-center">
                <p className="text-gray-600">
                  No freelance projects accepted yet.
                </p>
                <Link href="/marketplace" className="mt-4 inline-block">
                  <Button variant="secondary">Browse Marketplace</Button>
                </Link>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Action Button */}
      <div className="text-center">
        <Link href="/create">
          <Button variant="primary" className="px-8 py-3">
            Create New Project
          </Button>
        </Link>
      </div>
    </div>
  );
}
