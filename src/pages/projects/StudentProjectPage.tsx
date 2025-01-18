import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Plus,
  ListChecks,
  FileText,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useProjectContext } from "../../context/ProjectContext";
import { Project, ProjectProposal } from "../../types/project";
import { projectApi } from "../../api/projectApi";
import { Tabs } from "../../components/ui/Tabs";
import { useAuthStore } from "../../store/authStore";
import { useSnackbar } from "../../hooks/useSnackbar";

export function StudentProjectPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validatedProjects, setValidatedProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const navigate = useNavigate();
  const {
    projects,
    loading: projectsLoading,
    refreshProjects,
  } = useProjectContext();
  const [activeTab, setActiveTab] = useState<
    "available" | "selection" | "proposals"
  >("available");
  const { user } = useAuthStore();
  const { showSnackbar } = useSnackbar();
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<number, boolean>
  >({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const toggleDescription = (projectId: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const truncateDescription = (text: string, maxLength: number = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "... more";
  };

  const isTextTruncated = (text: string, maxLength: number = 200) => {
    return text && text.length > maxLength;
  };

  useEffect(() => {
    if (!projectsLoading && user) {
      fetchProjectsAndProposals();
    }
  }, [projects, projectsLoading, user]);

  const fetchProjectsAndProposals = async () => {
    let studentProposals = [];
    let availableProjects = [];

    try {
      setIsLoading(true);
      console.log("🔄 Starting to fetch projects and proposals...");

      // Fetch user's proposals first
      const proposalResponse = await projectApi.getProposals();
      console.log("📥 Raw proposals fetched:", {
        response: proposalResponse,
        count: proposalResponse?.proposals?.length || 0,
      });

      // Get the proposals array from the response object
      const proposalsArray = proposalResponse?.proposals || [];

      // Debug log each proposal
      proposalsArray.forEach((proposal, index) => {
        console.log(`Proposal ${index + 1}:`, {
          id: proposal.proposal_id,
          projectId: proposal.project_id,
          submittedBy: proposal.submitted_by,
          status: proposal.proposal_status,
          currentUserId: user?.user_id,
        });
      });

      // Filter proposals for current student
      studentProposals = proposalsArray.filter((proposal) => {
        const isCurrentUser = proposal.submitted_by === user?.user_id;
        const isStudent = proposal.proposer_type === "Student";

        console.log("Filtering proposal:", {
          proposalId: proposal.proposal_id,
          isCurrentUser,
          isStudent,
          submittedBy: proposal.submitted_by,
          userId: user?.user_id,
          proposerType: proposal.proposer_type,
        });

        return isCurrentUser && isStudent;
      });

      // Set proposals state first
      setProposals(studentProposals);

      // Log filtered results
      console.log("🎯 Student proposals filtered:", {
        totalCount: proposalsArray.length,
        studentCount: studentProposals.length,
        userId: user?.user_id,
        filtered: studentProposals,
      });

      // Get the project IDs from the student's proposals
      const proposedProjectIds = studentProposals.map((p) => p.project_id);
      console.log("🔍 Projects already proposed:", {
        count: proposedProjectIds.length,
        ids: proposedProjectIds,
      });

      // Get available projects
      availableProjects = projects.filter((project) => {
        const hasApprovedProposal =
          project.proposal?.proposal_status === "Approved";
        const isFromTeacherOrCompany = ["Teacher", "Company"].includes(
          project.submitter?.role || ""
        );
        const notAlreadyProposed = !proposedProjectIds.includes(
          project.project_id
        );

        return (
          hasApprovedProposal && isFromTeacherOrCompany && notAlreadyProposed
        );
      });

      // Set validated projects state
      setValidatedProjects(availableProjects);

      console.log("✨ Available projects filtered:", {
        totalProjects: projects.length,
        approvedCount: projects.filter(
          (p) => p.proposal?.proposal_status === "Approved"
        ).length,
        availableCount: availableProjects.length,
        projects: availableProjects,
      });
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      setError("Failed to load projects");
    } finally {
      // Log final state after updates
      console.log("✅ Fetch complete:", {
        proposals: studentProposals.length || 0,
        validatedProjects: availableProjects.length || 0,
        timestamp: new Date().toISOString(),
      });
      setIsLoading(false);
    }
  };

  const handleNewProjectClick = () => {
    if (proposals.length >= 3) {
      showSnackbar("Maximum number of project proposals (3) reached", "error");
      return;
    }
    navigate("/projects/new");
  };

  const validateProposalLimit = async () => {
    try {
      const proposalResponse = await projectApi.getProposals();
      console.log("🔍 Checking student proposals:", proposalResponse);

      // Filter proposals for current student
      const studentProposals = proposalResponse.filter(
        (proposal) =>
          proposal.submitted_by === user?.user_id &&
          proposal.proposer_type === "Student" &&
          proposal.proposal_status !== "Rejected" // Only count non-rejected proposals
      );

      console.log("📊 Found student proposals:", {
        total: studentProposals.length,
        proposals: studentProposals,
      });

      if (studentProposals.length >= 3) {
        showSnackbar(
          "Maximum number of project proposals (3) reached",
          "error"
        );
        navigate("/projects");
        return;
      }

      setProposalCount(studentProposals.length);
    } catch (error) {
      console.error("❌ Error checking proposal limit:", error);
      showSnackbar("Failed to validate proposal limit", "error");
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    try {
      setIsRefreshing(true);
      showSnackbar("Refreshing projects and proposals...", "info");

      // Refresh both projects and proposals
      const [projectsResponse, proposalsResponse] = await Promise.all([
        refreshProjects(),
        projectApi.getProposals(),
      ]);

      // After projects are refreshed, fetch everything again
      await fetchProjectsAndProposals();

      showSnackbar("Projects and proposals refreshed successfully", "success");
    } catch (error) {
      console.error("Failed to refresh data:", error);
      setError("Failed to refresh data");
      showSnackbar("Failed to refresh data", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  if (projectsLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">{t.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const hasReachedProposalLimit = proposals.length >= 3;

  const renderProposalContent = (proposal: ProjectProposal) => {
    // Find the project by ID
    const projectDetails = projects.find(
      (p) => p.project_id === proposal.project_id
    );

    console.log("Rendering proposal:", {
      proposal,
      projectDetails,
      allProjects: projects,
    });

    // If project details aren't found, try to use details from the proposal itself
    const displayData = {
      title:
        projectDetails?.title || proposal.project?.title || "Unknown Project",
      summary: projectDetails?.summary || proposal.project?.summary || "",
      option: projectDetails?.option || proposal.project?.option || "",
      type: projectDetails?.type || proposal.project?.type || "",
      technologies:
        projectDetails?.technologies || proposal.project?.technologies || "",
    };

    return (
      <div
        key={proposal.proposal_id}
        className="group bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer relative"
        onClick={() => toggleDescription(proposal.proposal_id)}
      >
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {displayData.title}
                </h3>
                <ProposalStatus status={proposal.proposal_status} />
              </div>
              {isTextTruncated(displayData.summary) && (
                <div className="text-gray-400">
                  {expandedDescriptions[proposal.proposal_id] ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {expandedDescriptions[proposal.proposal_id]
                ? displayData.summary
                : truncateDescription(displayData.summary)}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Option
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {displayData.option}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Type
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {displayData.type}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Technologies
                </p>
                <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                  {displayData.technologies || "Not specified"}
                </p>
              </div>
            </div>

            {proposal.review_comments && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-100 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Feedback:</span>{" "}
                  {proposal.review_comments}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="absolute inset-0 rounded-lg ring-1 ring-black/5 group-hover:ring-black/10 dark:ring-white/5 dark:group-hover:ring-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>
    );
  };

  const renderAvailableProject = (project: Project) => (
    <div
      key={project.project_id}
      className="group bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer relative"
      onClick={() => toggleDescription(project.project_id)}
    >
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-wrap flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {project.title}
              </h3>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full">
                {project.type}
              </span>
            </div>
            {isTextTruncated(project.summary) && (
              <div className="text-gray-400">
                {expandedDescriptions[project.project_id] ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {expandedDescriptions[project.project_id]
              ? project.summary
              : truncateDescription(project.summary)}
          </p>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Option
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {project.option}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Type
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {project.type}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-gray-500">
                Technologies
              </p>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {project.technologies || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 rounded-lg ring-1 ring-black/5 group-hover:ring-black/10 dark:ring-white/5 dark:group-hover:ring-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.studentProject.pfeProjects}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Button>
          {!hasReachedProposalLimit && (
            <Button
              onClick={handleNewProjectClick}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t.studentProject.proposeNewProject}
            </Button>
          )}
        </div>
      </div>

      <div className="relative">
        {isRefreshing && (
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 z-10 backdrop-blur-sm rounded-lg" />
        )}

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <Tabs.List>
            <Tabs.Trigger value="available">
              Available Projects ({validatedProjects.length})
            </Tabs.Trigger>
            <Tabs.Trigger value="selection">My Selection (0)</Tabs.Trigger>
            <Tabs.Trigger value="proposals">
              My Proposals ({proposals.length}/3)
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="available">
            {validatedProjects.length > 0 ? (
              <div className="mt-6 space-y-4">
                {validatedProjects.map(renderAvailableProject)}
              </div>
            ) : (
              <div className="mt-6 text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  No Projects Available for Selection
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  There are currently no validated projects available for
                  selection. Please check back later or submit your own project
                  proposal.
                </p>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="selection">
            <div className="mt-6 text-center py-12">
              <ListChecks className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No Projects Selected
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                Browse available projects and add them to your selection list.
                You can select up to 10 projects to prioritize.
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="proposals">
            {proposals.length > 0 ? (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {proposals.map((proposal) => {
                  console.log("Mapping proposal:", proposal);
                  return renderProposalContent(proposal);
                })}
              </div>
            ) : (
              <div className="mt-6 text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  No Project Proposals
                </h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  You haven't submitted any project proposals yet. You can
                  submit up to 3 proposals.
                </p>
              </div>
            )}
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
}

function ProposalStatus({
  status,
}: {
  status: ProjectProposal["proposal_status"];
}) {
  const getStatusStyles = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200";
      case "Approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      case "Rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
      case "Edited":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusStyles()}`}
    >
      {status}
    </span>
  );
}
