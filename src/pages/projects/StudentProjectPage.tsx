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
  ArrowUp,
  ArrowDown,
  Check,
  Trash2, // Add this import
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
  selectedIndex?: number; // Add this field to track selection order
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
  const [maxSelections] = useState(10); // Changed from 3 to 10
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudentProjectStatus();
  }, []);

  const fetchStudentProjectStatus = async () => {
    try {
      setIsLoading(true);
      // Check for existing accepted project first
      const savedProject = localStorage.getItem("acceptedProject");
      if (savedProject) {
        setProject(JSON.parse(savedProject));
        setProjectWishList([]);
        setAvailableProjects([]);
        setIsLoading(false);
        return;
      }

      // Load proposals from localStorage
      const storedProposals = JSON.parse(
        localStorage.getItem("studentProposals") || "[]"
      );

      // Start with empty wish list
      const mockProjectWishList = [];

      const mockAvailableProjects: AvailableProject[] = [
        {
          id: "1",
          title: "Machine Learning for IoT",
          type: "Research",
          supervisor: "Dr. Alice Brown",
          description: "Implementing ML algorithms for IoT devices",
          technologies: "Python, TensorFlow, IoT",
          status: "Available",
        },
        {
          id: "2",
          title: "Cloud-Native Architecture",
          type: "Classic",
          supervisor: "Dr. Bob White",
          description: "Designing modern cloud applications",
          technologies: "Kubernetes, Docker, Microservices",
          status: "Available",
        },
        {
          id: "3",
          title: "Blockchain Supply Chain",
          type: "Innovative",
          supervisor: "Dr. John Smith",
          description: "Supply chain management using blockchain technology",
          technologies: "Ethereum, Solidity, Web3.js",
          status: "Available",
        },
        {
          id: "4",
          title: "AR Mobile App",
          type: "Classic",
          supervisor: "Dr. Emily Chen",
          description: "Developing an augmented reality mobile application",
          technologies: "Unity, ARKit, C#",
          status: "Available",
        },
        {
          id: "5",
          title: "Smart City Platform",
          type: "Research",
          supervisor: "Dr. Mark Wilson",
          description: "IoT platform for smart city management",
          technologies: "Node.js, MQTT, MongoDB",
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

  // Add function to clear proposals (for testing)
  const clearProposals = () => {
    localStorage.removeItem("studentProposals");
    setProjectProposals([]);
    setProposedProjects(0);
  };

  const handleProjectAcceptance = (projectId: string) => {
    const selectedProject = availableProjects.find((p) => p.id === projectId);
    if (selectedProject) {
      const acceptedProject = {
        ...selectedProject,
        status: "Accepted",
        progressReports: [],
        nextReview: "2024-04-01",
        // Add these fields for the project details view
        coSupervisor: null,
        partner: null,
        hardwareRequirements: "None specified",
      };

      // Save to localStorage for persistence
      localStorage.setItem("acceptedProject", JSON.stringify(acceptedProject));
      setProject(acceptedProject);
    }
  };

  const resetAcceptedProject = () => {
    localStorage.removeItem("acceptedProject");
    setProject(null);
    // Restore available projects state
    fetchStudentProjectStatus();
  };

  const handleProjectSelection = (projectId: string) => {
    setHasUnsavedChanges(true);
    setAvailableProjects((prevProjects) => {
      const currentSelected = prevProjects.filter(
        (p) => p.selectedIndex !== undefined
      ).length;
      const projectIndex = prevProjects.findIndex((p) => p.id === projectId);

      if (projectIndex === -1) return prevProjects;

      const updatedProjects = [...prevProjects];
      const project = updatedProjects[projectIndex];

      if (project.selectedIndex !== undefined) {
        // Remove from selection and wish list
        const removedIndex = project.selectedIndex;
        updatedProjects[projectIndex] = {
          ...project,
          selectedIndex: undefined,
        };

        // Reorder remaining selections
        updatedProjects.forEach((p) => {
          if (p.selectedIndex !== undefined && p.selectedIndex > removedIndex) {
            p.selectedIndex--;
          }
        });

        // Update wish list
        setProjectWishList((prev) => prev.filter((p) => p.id !== projectId));
      } else if (currentSelected < maxSelections) {
        // Add to selection and wish list
        updatedProjects[projectIndex] = {
          ...project,
          selectedIndex: currentSelected,
          status: "Selected",
        };

        // Add to wish list
        setProjectWishList((prev) => [
          ...prev,
          {
            id: project.id,
            title: project.title,
            type: project.type,
            supervisor: project.supervisor,
            status: "Pending",
            priority: currentSelected + 1,
          },
        ]);
      }

      return updatedProjects;
    });
  };

  // Fix reordering logic
  const handleReorderWishList = (id: string, direction: "up" | "down") => {
    setHasUnsavedChanges(true);
    setProjectWishList((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (
        (direction === "up" && index === 0) ||
        (direction === "down" && index === prev.length - 1)
      ) {
        return prev;
      }

      const newIndex = direction === "up" ? index - 1 : index + 1;
      const newList = [...prev];
      const [moved] = newList.splice(index, 1);
      newList.splice(newIndex, 0, moved);

      // Update priorities
      const updatedList = newList.map((item, idx) => ({
        ...item,
        priority: idx + 1,
      }));

      // Update available projects to reflect new order
      setAvailableProjects((prevProjects) => {
        const newProjects = [...prevProjects];
        updatedList.forEach((wish, idx) => {
          const projectIndex = newProjects.findIndex((p) => p.id === wish.id);
          if (projectIndex !== -1) {
            newProjects[projectIndex] = {
              ...newProjects[projectIndex],
              selectedIndex: idx,
            };
          }
        });
        return newProjects;
      });

      return updatedList;
    });
  };

  const handleSaveSelections = () => {
    // Update available projects to reflect final order
    setAvailableProjects((prevProjects) => {
      const newProjects = [...prevProjects];
      projectWishList.forEach((wish, idx) => {
        const projectIndex = newProjects.findIndex((p) => p.id === wish.id);
        if (projectIndex !== -1) {
          newProjects[projectIndex] = {
            ...newProjects[projectIndex],
            selectedIndex: idx,
          };
        }
      });
      return newProjects;
    });

    setHasUnsavedChanges(false);
    // You could also save to localStorage or API here
  };

  const handleDeleteFromList = (projectId: string) => {
    setHasUnsavedChanges(true);

    // Remove from wish list
    setProjectWishList((prev) => {
      const newList = prev.filter((p) => p.id !== projectId);
      // Update priorities for remaining items
      return newList.map((item, idx) => ({
        ...item,
        priority: idx + 1,
      }));
    });

    // Update available projects
    setAvailableProjects((prev) => {
      const newProjects = [...prev];
      const projectIndex = newProjects.findIndex((p) => p.id === projectId);
      if (projectIndex !== -1) {
        newProjects[projectIndex] = {
          ...newProjects[projectIndex],
          selectedIndex: undefined,
          status: "Available",
        };
      }
      // Update selectedIndex for remaining selected projects
      newProjects.forEach((p) => {
        if (p.selectedIndex !== undefined) {
          const wishListItem = projectWishList.find((w) => w.id === p.id);
          if (wishListItem) {
            p.selectedIndex = wishListItem.priority - 1;
          }
        }
      });
      return newProjects;
    });
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
              onClick={resetAcceptedProject}
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Reset Project (Testing)
            </Button>
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
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.studentProject.pfeProjects}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {projectProposals.length < 3 && (
            <Button
              onClick={() => navigate("/projects/new")}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">
                {t.studentProject.proposeNewProject}
              </span>
              <span className="sm:hidden">
                Propose ({projectProposals.length}/3)
              </span>
            </Button>
          )}
          <Button
            onClick={() => setShowSelectionList(!showSelectionList)}
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <ListFilter className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {t.studentProject.selectionList}
            </span>
            <span>({projectWishList.length})</span>
          </Button>
          <Button
            onClick={() => setShowProposalsList(!showProposalsList)}
            variant="outline"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">
              {t.studentProject.myProposals}
            </span>
            <span>({projectProposals.length})</span>
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.studentProject.myProjectSelectionList}
            </h3>
            {hasUnsavedChanges && (
              <Button
                onClick={handleSaveSelections}
                className="flex items-center gap-2"
                variant="default"
              >
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            )}
          </div>
          <ProjectWishList
            projects={projectWishList}
            onReorder={handleReorderWishList}
            onDelete={handleDeleteFromList}
          />
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
                <div className="flex items-center gap-2">
                  {project.selectedIndex !== undefined && (
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100 text-sm font-medium">
                      {project.selectedIndex + 1}
                    </span>
                  )}
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                </div>
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
              <div className="flex flex-wrap gap-2 items-center">
                {project.selectedIndex !== undefined ? (
                  <span className="px-2 py-1 text-xs sm:text-sm rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                    <span className="hidden sm:inline">Added</span> (
                    {project.selectedIndex + 1})
                  </span>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => handleProjectSelection(project.id)}
                    disabled={
                      availableProjects.filter(
                        (p) => p.selectedIndex !== undefined
                      ).length >= maxSelections
                    }
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">
                      Add to Selection List
                    </span>
                    <span className="sm:hidden">Add</span>
                  </Button>
                )}
                {/* Demo acceptance button - only for selected projects */}
                {project.selectedIndex !== undefined && (
                  <Button
                    onClick={() => handleProjectAcceptance(project.id)}
                    size="sm"
                    className="text-xs bg-green-600/80 hover:bg-green-700/80 px-2 py-1"
                  >
                    <span className="hidden sm:inline">Accept</span>
                    <span className="sm:hidden">OK</span>
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

function ProjectWishList({
  projects,
  onReorder,
  onDelete,
}: {
  projects: ProjectWishListItem[];
  onReorder: (id: string, direction: "up" | "down") => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="mt-6 space-y-4">
      <div className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-md">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => onReorder(project.id, "up")}
                  disabled={project.priority === 1}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onReorder(project.id, "down")}
                  disabled={project.priority === projects.length}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-50"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {project.priority}. {project.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {project.type} • {t.studentProject.supervisor}:{" "}
                  {project.supervisor}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  project.status === "Accepted"
                    ? "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200"
                    : "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {project.status === "Pending"
                  ? t.studentProject.pending
                  : project.status}
              </span>
              <button
                onClick={() => onDelete(project.id)}
                className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded"
                title="Remove from list"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
