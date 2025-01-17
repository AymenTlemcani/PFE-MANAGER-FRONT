import {
  Plus,
  RefreshCw,
  Building,
  FileText,
  GraduationCap,
} from "lucide-react"; // Fixed icon name
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "../../hooks/useTranslation"; // Add this import
import { Avatar } from "../../components/ui/Avatar";
import { Tooltip } from "../../components/ui/Tooltip";
import { Button } from "../../components/ui/Button"; // Add Button import

// Add getStatusColor helper function at the top level
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "proposed":
      return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200";
    case "validated":
      return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
    case "assigned":
      return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";
    case "inprogress":
      return "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200";
    case "completed":
      return "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const currentLang = localStorage.getItem("language") || "en";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: currentLang === "en", // Use 12-hour format for English, 24-hour for French
  };

  return new Intl.DateTimeFormat(
    currentLang === "fr" ? "fr-FR" : "en-US",
    options
  ).format(date);
};

export function ProjectsPage() {
  const navigate = useNavigate();
  const { projects, loading, refreshProjects } = useProjectContext(); // Add loading and refreshProjects
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation(); // Add translation hook

  const handleNewProject = () => {
    if (user?.role === "Company") {
      navigate("/projects/company/new");
    } else {
      navigate("/projects/new");
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshProjects();
      showSnackbar("Projects refreshed successfully", "success");
    } catch (error) {
      showSnackbar("Failed to refresh projects", "error");
    }
  };

  // Add LoadingOverlay component
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {t.common.loading}
        </span>
      </div>
    </div>
  );

  // Add helper function to filter company projects and internships
  const filterCompanyProjects = (projects: Project[]) => {
    const userProjects = projects.filter(
      (p) => p.submitted_by === user?.user_id
    );
    return {
      internships: userProjects.filter((p) => p.type === "Internship"),
      otherProjects: userProjects.filter((p) => p.type !== "Internship"),
    };
  };

  return (
    <div className="space-y-6 relative">
      {loading && <LoadingOverlay />}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user?.role === "Company" ? "Internship Offers" : "My Projects"}
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {t.projectForm.refresh || "Refresh"} {/* Use fallback text */}
          </Button>
          <button
            onClick={handleNewProject}
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            {user?.role === "Company"
              ? "Post New Internship"
              : "Submit New PFE"}
          </button>
        </div>
      </div>

      {user?.role === "Company" ? (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filterCompanyProjects(projects).internships.length > 0 ? (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filterCompanyProjects(projects).internships.map(
                    (project) => (
                      <div key={project.project_id} className="py-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                              {project.title}
                            </h3>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">
                                  Required Skills:
                                </span>{" "}
                                {project.technologies}
                              </p>
                              {project.internship_details && (
                                <>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">
                                      Duration:
                                    </span>{" "}
                                    {project.internship_details.duration} months
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-medium">
                                      Location:
                                    </span>{" "}
                                    {project.internship_details.location}
                                  </p>
                                </>
                              )}
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-medium">Submitted:</span>{" "}
                                {formatDate(project.submission_date)}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                              project.status
                            )}`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                    No Internship Offers
                  </h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    You haven't posted any internship offers yet. Click "Post
                    New Internship" to create one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {user?.role === "company"
                ? "Project Proposals"
                : "Submitted PFE Projects"}
            </h2>
            {user?.role === "company" ? (
              <CompanyProjectsList projects={projects} />
            ) : (
              <ProjectsList projects={projects} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsList({ projects }) {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation(); // Add translation hook

  if (!projects || projects.length === 0) {
    if (user?.role === "Teacher") {
      return (
        <div className="text-center py-12">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No Projects Proposed
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You haven't submitted any project proposals yet. Click "Submit New
            Project Proposal" to create one.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
          No Projects Found
        </h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          {t.projectForm.noProjects}
        </p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "proposed":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200";
      case "validated":
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
      case "assigned":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";
      case "inprogress":
        return "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200";
      case "completed":
        return "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {projects.map((project) => (
        <div key={project.project_id} className="py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <div className="space-y-1">
                {/* Option field */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">{t.projectForm.option}:</span>{" "}
                  {project.option}
                </p>

                {/* Project Type field */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">
                    {t.projectForm.projectType}:
                  </span>{" "}
                  {project.type}
                </p>

                {/* Co-supervisor field - only show if exists */}
                {project.co_supervisor_name && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {t.studentProject.coSupervisor}:
                    </span>{" "}
                    {project.co_supervisor_name} {project.co_supervisor_surname}
                  </p>
                )}

                {/* Technologies field */}
                {project.technologies && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {t.projectForm.requiredTechnologies}:
                    </span>{" "}
                    {project.technologies}
                  </p>
                )}

                {/* Material Needs field - only show if exists */}
                {project.material_needs && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {t.projectForm.materialNeeds}:
                    </span>{" "}
                    {project.material_needs}
                  </p>
                )}

                {/* Updated Submission Date field */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">
                    {t.studentProject.submitted}:
                  </span>{" "}
                  {formatDate(project.submission_date)}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                project.status
              )}`}
            >
              {project.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Also update the company projects list
function CompanyProjectsList({ projects }) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { t } = useTranslation(); // Add translation hook

  const companyProjects = projects.filter((p) => p.companyId === user?.id);

  if (!companyProjects || companyProjects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No projects submitted yet. Click "Submit New Project Proposal" to get
        started.
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Review":
        return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200";
      case "Under Evaluation":
        return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";
      case "Approved":
        return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {companyProjects.map((project) => (
        <div key={project.id} className="py-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <div className="space-y-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Required Skills:</span>{" "}
                  {project.technologies}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Type:</span> {project.type}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Duration:</span>{" "}
                  {project.duration}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium">Submitted:</span>{" "}
                  {formatDate(project.submittedDate)}
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
                  onClick={() =>
                    navigate(`/projects/company/edit/${project.id}`)
                  }
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
