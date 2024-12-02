import { Briefcase, Users, Clock, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function CompanyDashboard() {
  const stats = [
    { label: "Active Projects", value: "3", icon: Briefcase },
    { label: "Student Interns", value: "5", icon: Users },
    { label: "Pending Proposals", value: "2", icon: Clock },
    { label: "Completed Projects", value: "7", icon: CheckCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Company Dashboard</h1>
        <Button>Submit New Project Proposal</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active Projects
          </h2>
          <ActiveProjectsList />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Project Proposals
          </h2>
          <ProposalsList />
        </div>
      </div>
    </div>
  );
}

function ActiveProjectsList() {
  const projects = [
    {
      id: 1,
      title: "E-commerce Analytics Dashboard",
      student: "Alice Smith",
      supervisor: "Dr. James Wilson",
      status: "On Track",
    },
    {
      id: 2,
      title: "Mobile Payment Integration",
      student: "Bob Johnson",
      supervisor: "Dr. Emily Brown",
      status: "Review Needed",
    },
    {
      id: 3,
      title: "Customer Data Platform",
      student: "Carol Williams",
      supervisor: "Dr. Michael Lee",
      status: "On Track",
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {projects.map((project) => (
        <div key={project.id} className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Student: {project.student}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Supervisor: {project.supervisor}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                project.status === "On Track"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProposalsList() {
  const proposals = [
    {
      id: 1,
      title: "AI Customer Service Bot",
      requirements: "Python, NLP, Machine Learning",
      status: "Pending Review",
      submittedDate: "2024-03-15",
    },
    {
      id: 2,
      title: "Blockchain Transaction System",
      requirements: "Solidity, Web3.js, React",
      status: "Under Evaluation",
      submittedDate: "2024-03-18",
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {proposals.map((proposal) => (
        <div key={proposal.id} className="py-4">
          <h3 className="text-sm font-medium text-gray-900">
            {proposal.title}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Requirements: {proposal.requirements}
          </p>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Submitted: {proposal.submittedDate}
            </p>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
              {proposal.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
