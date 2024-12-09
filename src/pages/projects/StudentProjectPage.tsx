import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  FileText,
  Users,
  Plus,
  BookOpen,
  ListChecks,
  ListFilter,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";

interface ProjectWishListItem {
  id: string;
  title: string;
  type: string;
  supervisor: string;
  status: "Pending" | "Accepted" | "Rejected";
  priority: number;
}

interface AvailableProject {
  id: string;
  title: string;
  type: string;
  supervisor: string;
  description: string;
  technologies: string;
  status: "Available" | "Selected";
}

export function StudentProjectPage() {
  const { t } = useTranslation();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [proposedProjects, setProposedProjects] = useState<number>(0);
  const [projectWishList, setProjectWishList] = useState<ProjectWishListItem[]>(
    []
  );
  const [availableProjects, setAvailableProjects] = useState<
    AvailableProject[]
  >([]);
  const [showSelectionList, setShowSelectionList] = useState(false);
  const [projectProposals, setProjectProposals] = useState<any[]>([]);
  const [showProposalsList, setShowProposalsList] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentProjectStatus = async () => {
      try {
        setIsLoading(true);

        // Load proposals from localStorage
        const storedProposals = JSON.parse(
          localStorage.getItem("studentProposals") || "[]"
        );

        // Your existing mock data for other lists
        const mockProjectWishList = [
          {
            id: "1",
            title: "AI-based Image Recognition System",
            type: "Research",
            supervisor: "Dr. Sarah Wilson",
            status: "Pending",
            priority: 1,
          },
          {
            id: "2",
            title: "Blockchain Supply Chain",
            type: "Innovative",
            supervisor: "Dr. John Doe",
            status: "Pending", // Changed to pending to demonstrate no active project
            priority: 2,
          },
        ];

        const mockAvailableProjects: AvailableProject[] = [
          {
            id: "3",
            title: "Machine Learning for IoT",
            type: "Research",
            supervisor: "Dr. Alice Brown",
            description: "Implementing ML algorithms for IoT devices",
            technologies: "Python, TensorFlow, IoT",
            status: "Available",
          },
          {
            id: "4",
            title: "Cloud-Native Architecture",
            type: "Classic",
            supervisor: "Dr. Bob White",
            description: "Designing modern cloud applications",
            technologies: "Kubernetes, Docker, Microservices",
            status: "Available",
          },
        ];

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const acceptedProject = mockProjectWishList.find(
          (p) => p.status === "Accepted"
        );

        setProject(acceptedProject || null);
        setProjectWishList(mockProjectWishList);
        setAvailableProjects(mockAvailableProjects);
        setProjectProposals(storedProposals);
        setProposedProjects(storedProposals.length);
      } catch (error) {
        console.error("Error fetching project status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentProjectStatus();
  }, []);

  // Add function to clear proposals (for testing)
  const clearProposals = () => {
    localStorage.removeItem("studentProposals");
    setProjectProposals([]);
    setProposedProjects(0);
  };

  const handleProjectAcceptance = (projectId: string) => {
    // Mock accepting a project
    const selectedProject = availableProjects.find((p) => p.id === projectId);
    if (selectedProject) {
      setProject({
        ...selectedProject,
        status: "Accepted",
        progressReports: [],
        nextReview: "2024-04-01",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">{t.loading}</div>
      </div>
    );
  }

  // Show project details only if there's an accepted project
  if (project?.status === "Accepted") {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.studentProject.myPFEProject}
          </h1>
          <div className="flex gap-4">
            <Button
              onClick={() => navigate("/projects/new")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.studentProject.submitPFEProject}
            </Button>
            <Button
              onClick={() => navigate("/projects/report")}
              variant="outline"
            >
              {t.studentProject.submitProgressReport}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.studentProject.projectDetails}
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {project.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {t.studentProject.supervisor}
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {project.supervisor}
                    </p>
                  </div>
                  {project.coSupervisor && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t.studentProject.coSupervisor}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {project.coSupervisor}
                      </p>
                    </div>
                  )}
                  {project.partner && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {t.studentProject.partner}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        {project.partner}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.studentProject.technicalDetails}
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.studentProject.technologies}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {project.technologies}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {t.studentProject.hardwareRequirements}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {project.hardwareRequirements}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.studentProject.projectStatus}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {t.studentProject.nextReview}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {project.nextReview}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">
                      {t.studentProject.progressReports}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {project.progressReports.length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t.studentProject.progressReports}
              </h2>
              <div className="space-y-3">
                {project.progressReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">{report.date}</span>
                    <span
                      className={`text-sm font-medium ${
                        report.status === "Submitted"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise show the no project state with wish list
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.studentProject.pfeProjects}
        </h1>
        <div className="flex gap-4">
          {projectProposals.length < 3 && (
            <Button
              onClick={() => navigate("/projects/new")}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.studentProject.proposeNewProject} ({projectProposals.length}/3)
            </Button>
          )}
          <Button
            onClick={() => setShowSelectionList(!showSelectionList)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ListFilter className="h-4 w-4" />
            {t.studentProject.selectionList} ({projectWishList.length})
          </Button>
          <Button
            onClick={() => setShowProposalsList(!showProposalsList)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            {t.studentProject.myProposals} ({projectProposals.length})
          </Button>
        </div>
      </div>

      {showProposalsList && projectProposals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.studentProject.myProjectProposals}
            </h3>
            {/* Add clear button for testing */}
            <Button
              variant="outline"
              size="sm"
              onClick={clearProposals}
              className="text-red-600 hover:text-red-700"
            >
              {t.studentProject.clearAllTesting}
            </Button>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {projectProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {proposal.title}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {proposal.type} • {t.studentProject.submitted}:{" "}
                    {proposal.submittedDate}
                  </p>
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">
                  {proposal.status === "Under Review"
                    ? t.studentProject.underReview
                    : t.studentProject.pending}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showSelectionList && projectWishList.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <ProjectWishList projects={projectWishList} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {availableProjects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {t.studentProject.type}:
                    </span>{" "}
                    {project.type}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {t.studentProject.supervisor}:
                    </span>{" "}
                    {project.supervisor}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium">
                      {t.studentProject.technologies}:
                    </span>{" "}
                    {project.technologies}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {project.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={
                    project.status === "Selected" ? "outline" : "default"
                  }
                  onClick={() => handleProjectAcceptance(project.id)}
                >
                  {project.status === "Selected"
                    ? t.studentProject.selected
                    : t.studentProject.selectProject}
                </Button>
                {/* Mock acceptance button - only for demo */}
                {project.status === "Selected" && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleProjectAcceptance(project.id)}
                  >
                    {t.studentProject.acceptProjectDemo}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoProjectState({
  proposedCount,
  projectWishList,
}: {
  proposedCount: number;
  projectWishList: ProjectWishListItem[];
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [showWishList, setShowWishList] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.studentProject.myPFEProject}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="p-4">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
              {t.studentProject.noActiveProjectYet}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {t.studentProject.browseOrPropose}{" "}
              {proposedCount > 0 &&
                ` (${proposedCount}/3 ${t.studentProject.projectsProposed})`}
              .
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate("/projects")}
              className="flex items-center gap-2"
            >
              <ListChecks className="h-4 w-4" />
              {t.studentProject.browseAvailableProjects}
            </Button>
            {proposedCount < 3 && (
              <Button
                onClick={() => navigate("/projects/new")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {t.studentProject.proposeNewProject}
              </Button>
            )}
          </div>

          {projectWishList.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowWishList(!showWishList)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showWishList ? t.studentProject.hide : t.studentProject.show}{" "}
                {t.studentProject.myProjectSelectionList} (
                {projectWishList.length})
              </button>
              {showWishList && <ProjectWishList projects={projectWishList} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectWishList({ projects }: { projects: ProjectWishListItem[] }) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
        {t.studentProject.myProjectSelectionList}
      </h3>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {project.priority}. {project.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {project.type} • {t.studentProject.supervisor}: {project.supervisor}
              </p>
            </div>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                project.status === "Accepted"
                  ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                  : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
              }`}
            >
              {project.status === "Pending" ? t.studentProject.pending : project.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
