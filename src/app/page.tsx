import Link from "next/link";
import {
  ShieldCheckIcon,
  LinkIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/button";
import { Card } from "@/components/card";

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Decentralized Freelancing.{" "}
            <span className="text-gray-900">Verifiable Trust.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Our platform leverages blockchain technology and IPFS to create a
            transparent and secure environment for clients and freelancers. All
            work is submitted on-chain, and payments are handled via a trustless
            escrow.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/marketplace">
              <Button variant="primary" className="px-6 py-3 text-base">
                Explore Marketplace
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="secondary" className="px-6 py-3 text-base">
                Create a Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Secure Escrow */}
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
              <ShieldCheckIcon className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              Secure Escrow
            </h3>
            <p className="mt-4 text-gray-600">
              Funds are locked in a smart contract until work is completed and
              approved, ensuring both parties are protected throughout the
              project lifecycle.
            </p>
          </Card>

          {/* Immutable Proof */}
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
              <LinkIcon className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              Immutable Proof
            </h3>
            <p className="mt-4 text-gray-600">
              All work submissions are stored on IPFS, creating a permanent and
              tamper-proof record of deliverables that can be verified by
              anyone.
            </p>
          </Card>

          {/* On-Chain Reputation */}
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-gray-50">
              <UserIcon className="h-6 w-6 text-gray-600" />
            </div>
            <h3 className="mt-6 text-lg font-semibold text-gray-900">
              On-Chain Reputation
            </h3>
            <p className="mt-4 text-gray-600">
              Every interaction builds a transparent reputation history stored
              on the blockchain, making it impossible to fake credentials or
              hide past disputes.
            </p>
          </Card>
        </div>
      </div>

      {/* Workflow Section */}
      <div className="bg-gray-50 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          The Workflow
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          A simple, transparent process from project creation to payment
        </p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">1. Create</div>
            <h4 className="font-semibold text-gray-900 mb-2">Client Posts Project</h4>
            <p className="text-sm text-gray-600">
              Client creates a project with description, budget, and deadline. Funds are locked in smart contract escrow.
            </p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">2. Accept</div>
            <h4 className="font-semibold text-gray-900 mb-2">Freelancer Claims Project</h4>
            <p className="text-sm text-gray-600">
              ANY freelancer can browse the marketplace and accept an open project. First come, first served!
            </p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">3. Submit</div>
            <h4 className="font-semibold text-gray-900 mb-2">Freelancer Delivers Work</h4>
            <p className="text-sm text-gray-600">
              Freelancer uploads deliverables to IPFS and submits the hash on-chain for permanent verification.
            </p>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold text-gray-900 mb-2">4. Release</div>
            <h4 className="font-semibold text-gray-900 mb-2">Client Approves & Pays</h4>
            <p className="text-sm text-gray-600">
              Client reviews work and approves. Smart contract automatically releases payment to freelancer.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
