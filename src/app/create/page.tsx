"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { useWallet } from "@/contexts/WalletContext";
import { useProjectActions } from "@/lib/useBlockchain";

export default function CreateProjectPage() {
  const router = useRouter();
  const { isConnected, user, refreshProjects } = useWallet();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { create } = useProjectActions();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !user) {
      alert("Please connect your wallet first!");
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.budget ||
      !formData.deadline
    ) {
      alert("Please fill in all fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert deadline to Unix timestamp
      const deadlineTimestamp = Math.floor(
        new Date(formData.deadline).getTime() / 1000
      );

      // Combine title and description for blockchain storage
      const fullDescription = `${formData.title}\n\n${formData.description}`;

      console.log("Creating project on blockchain...");
      
      // Create project on blockchain
      const tx = await create(fullDescription, deadlineTimestamp, formData.budget);
      
      console.log("Project created! Transaction:", tx);
      alert("Project created successfully! Funds locked in escrow. Refreshing projects...");
      
      // Wait a moment for the blockchain state to update
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh projects list
      console.log("Refreshing projects...");
      await refreshProjects();
      
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating project:", error);
      alert(`Failed to create project: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create a New Project
        </h1>

        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Wallet Connection Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please connect your wallet to create a new project and fund the
            escrow.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create a New Project
      </h1>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Enter project title..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Project Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Describe your project requirements..."
              required
            />
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Budget (ETH)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              step="0.01"
              min="0"
              value={formData.budget}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="0.5"
              required
            />
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Project..." : "Fund & Create Project"}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This will lock {formData.budget || "X"} ETH
            in a smart contract escrow on Sepolia testnet. Funds will only be released when you
            approve completed work.
          </p>
        </div>
      </Card>
    </div>
  );
}
