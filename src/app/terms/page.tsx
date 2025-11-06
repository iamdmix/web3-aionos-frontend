import { Card } from "@/components/card";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Terms of Service
      </h1>

      <Card className="p-8">
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600">
              By accessing and using ProofChain, you accept and agree to be
              bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Smart Contract Interactions
            </h2>
            <p className="text-gray-600">
              All transactions on ProofChain are executed through smart
              contracts on the blockchain. Users acknowledge that smart contract
              transactions are irreversible and agree to the associated risks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Intellectual Property
            </h2>
            <p className="text-gray-600">
              Work submitted through ProofChain remains the intellectual
              property of the creator, unless otherwise specified in the project
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. Dispute Resolution
            </h2>
            <p className="text-gray-600">
              Disputes are handled through on-chain governance mechanisms. Users
              agree to abide by the decisions of the decentralized dispute
              resolution system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-600">
              ProofChain operates as a decentralized platform. The platform
              creators are not liable for any losses incurred through the use of
              the platform or smart contract interactions.
            </p>
          </section>
        </div>
      </Card>
    </div>
  );
}
