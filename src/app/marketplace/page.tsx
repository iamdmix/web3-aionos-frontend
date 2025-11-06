"use client";

import Link from "next/link";
import { WalletIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/card";
import { useOpenProjects } from "@/lib/useBlockchain";

export default function MarketplacePage() {
  const { projects: openProjectsRaw, loading } = useOpenProjects();

  // Convert blockchain project shape to UI-friendly values
  const openProjects = openProjectsRaw.map((p) => ({
    id: p.id,
    title: p.description ? p.description.substring(0, 50) : "Untitled",
    description: p.description,
    budget: p.amount,
    deadline: new Date(p.deadline * 1000).toLocaleDateString(),
  }));

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Open Projects</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Projects</h1>
        <p className="text-gray-600">
          Browse available projects and accept one to start working. Any freelancer can claim these projects!
        </p>
      </div>

      {openProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600 mb-4">No open projects available at the moment</p>
          <p className="text-gray-500 text-sm mb-4">
            Check back later or create your own project if you're a client
          </p>
          <Link href="/create" className="text-gray-900 font-medium hover:text-gray-700">
            Create a new project →
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {openProjects.map((project) => (
            <Card key={project.id} className="p-6 border-2 border-blue-100 hover:border-blue-300 transition-colors" hover>
              <div className="mb-3">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  🟢 Open for Freelancers
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <WalletIcon className="h-4 w-4" />
                  <span className="font-medium">{project.budget} ETH</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Due: {project.deadline}</span>
                </div>
              </div>

              <Link
                href={`/project/${project.id}`}
                className="inline-block w-full text-center bg-gray-900 text-white font-medium px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                View & Accept Project →
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
