import { BookOpen, Clock, CheckCircle, Calendar } from "lucide-react";
import { Button } from "../../components/ui/Button";

export function StudentDashboard() {
  const stats = [
    { label: "Project Status", value: "In Progress", icon: BookOpen },
    { label: "Days Until Review", value: "15", icon: Clock },
    { label: "Tasks Completed", value: "8/12", icon: CheckCircle },
    { label: "Next Meeting", value: "Mar 25", icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Current Project
            </h2>
            <Button variant="outline" size="sm">
              Submit Progress Report
            </Button>
          </div>
          <ProjectDetails />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Upcoming Tasks
          </h2>
          <TaskList />
        </div>
      </div>
    </div>
  );
}

function ProjectDetails() {
  const project = {
    title: "AI-based Image Recognition System",
    supervisor: "Dr. Sarah Wilson",
    startDate: "2024-01-15",
    status: "In Progress",
    description:
      "Development of an AI system for real-time image recognition using deep learning techniques.",
  };

  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium text-gray-900">{project.title}</h3>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Supervisor: {project.supervisor}
        </p>
        <p className="text-sm text-gray-600">Start Date: {project.startDate}</p>
        <p className="text-sm text-gray-600">Status: {project.status}</p>
        <p className="text-sm text-gray-600">{project.description}</p>
      </div>
    </div>
  );
}

function TaskList() {
  const tasks = [
    {
      id: 1,
      title: "Submit Literature Review",
      deadline: "2024-03-25",
      status: "Pending",
    },
    {
      id: 2,
      title: "Prepare Progress Presentation",
      deadline: "2024-03-28",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Complete Implementation Phase",
      deadline: "2024-04-15",
      status: "Not Started",
    },
  ];

  return (
    <div className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <div key={task.id} className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {task.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Due: {task.deadline}</p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                task.status === "Pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : task.status === "In Progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {task.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
