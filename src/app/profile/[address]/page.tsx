import { use } from "react";

const mockUserData = {
  address: "0x742d35Cc6634C0532925a3b8D4C9db96590b5",
  projectsCompleted: 12,
  totalEarned: "15.7",
  disputesRaised: 1,
  projectHistory: [
    {
      id: "1",
      title: "Build a React Component",
      role: "Freelancer",
      amount: "0.5",
      status: "Completed",
    },
    {
      id: "2",
      title: "Smart Contract Audit",
      role: "Client",
      amount: "2.0",
      status: "In Progress",
    },
    {
      id: "3",
      title: "Mobile App Design",
      role: "Freelancer",
      amount: "1.2",
      status: "Completed",
    },
  ],
}

export default function ProfilePage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const userData = mockUserData // In real app, would fetch based on address

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 font-mono">{userData.address}</h1>

      {/* Stats Card */}
      <div className="rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{userData.projectsCompleted}</div>
            <div className="text-sm text-gray-600">Projects Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{userData.totalEarned} MATIC</div>
            <div className="text-sm text-gray-600">Total Earned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{userData.disputesRaised}</div>
            <div className="text-sm text-red-600">Disputes Raised</div>
          </div>
        </div>
      </div>

      {/* Project History */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Project History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.projectHistory.map((project) => (
                <tr key={project.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{project.amount} MATIC</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : project.status === "In Progress"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
