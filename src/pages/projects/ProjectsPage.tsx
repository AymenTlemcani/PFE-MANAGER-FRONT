import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuthStore } from "../../store/authStore";
// Add these imports
import { Avatar } from "../../components/ui/Avatar";
import { Tooltip } from "../../components/ui/Tooltip";

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
  const user = useAuthStore((state) => state.user);

  // Modified to show projects based on user role
  const userProjects = projects.filter((p) => {
    if (user?.role === "student") {
      return p.studentId === user?.id;
    } else if (user?.role === "teacher") {
      return p.supervisorId === user?.id || p.coSupervisorId === user?.id;
    }
    return false;
  });

  if (!userProjects || userProjects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No projects submitted yet. Click "Submit New PFE" to get started.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Partner Validation":
        return "bg-yellow-100 text-yellow-800";
      case "Pending Review":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProjectTypeLabel = (type: string) => {
    switch (type?.toLowerCase()) {
      case "classic":
        return "Classic";
      case "innovative":
        return "Innovative";
      case "research":
        return "Research";
      case "company_internship":
        return "Company Internship";
      default:
        return type || "N/A";
    }
  };

  return (
    <div className="divide-y divide-gray-200">
      {userProjects.map((project) => (
        <div key={project.id} className="py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {project.title}
                </h3>
                <Tooltip
                  content={
                    <div className="p-2">
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={project.submitterAvatar}
                          fallback={project.submitterName[0]}
                          size="sm"
                        />
                        <div>
                          <p className="font-medium">{project.submitterName}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {project.submittedBy}
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Proposed by</span>
                    <Avatar
                      src={project.submitterAvatar}
                      fallback={project.submitterName[0]}
                      size="xs"
                      className="cursor-pointer"
                    />
                  </div>
                </Tooltip>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Option:</span> {project.option}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Type:</span>{" "}
                  {getProjectTypeLabel(project.type)}
                </p>
                {project.partnerName && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Partner:</span>{" "}
                    {project.partnerName}
                  </p>
                )}
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Technologies:</span>{" "}
                  {project.technologies}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Submitted:</span>{" "}
                  {new Date(project.submittedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
              {project.status === "Rejected" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/projects/new?edit=${project.id}`)}
                >
                  Edit & Resubmit
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
