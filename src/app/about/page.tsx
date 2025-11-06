import { Card } from "@/components/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        About ProofChain
      </h1>

      <Card className="p-8">
        <div className="space-y-6">
          <p className="text-gray-600">
            ProofChain is a decentralized freelancing platform that leverages
            blockchain technology to create a transparent, secure, and trustless
            environment for clients and freelancers.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">Our Mission</h2>
          <p className="text-gray-600">
            We aim to eliminate the need for trust in freelancing relationships
            by using smart contracts and IPFS to create immutable proof of work
            and secure escrow systems.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">How It Works</h2>
          <ul className="space-y-2 text-gray-600 list-disc list-inside">
            <li>
              Clients create projects with funds locked in smart contract escrow
            </li>
            <li>
              Freelancers submit work directly to IPFS for permanent storage
            </li>
            <li>
              All interactions are recorded on-chain for transparent reputation
              building
            </li>
            <li>
              Disputes are handled through decentralized governance mechanisms
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
