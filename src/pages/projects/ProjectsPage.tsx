import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../context/ProjectContext";

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects } = useProjectContext();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <button
          onClick={() => navigate("/projects/new")}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Submit New PFE
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Submitted PFE Projects
          </h2>
          <ProjectsList projects={projects} />
        </div>
      </div>
    </div>
  );
}

function ProjectsList({ projects }) {
  return (
    <div className="divide-y divide-gray-200">
      {projects.map((project) => (
        <div key={project.id} className="py-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Option: {project.option} | Type: {project.type}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Submitted: {project.submittedDate}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                project.status === "In Progress"
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
