import { useState, useEffect } from "react";
import {
  CheckCircle,
  XCircle,
  PenSquare,
  ChevronDown,
  ChevronUp,
  FileText,
  RefreshCw,
  Filter,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar";
import { useProjectContext } from "../../context/ProjectContext"; // Add this import
import { useSnackbar } from "../../hooks/useSnackbar";
import { Project } from "../../types/project";
import { projectApi } from "../../api/projectApi";

export function ProjectValidationPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const navigate = useNavigate();
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<number, boolean>
  >({});
  const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const { projects, loading: projectsLoading } = useProjectContext();
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("Pending");

  // Available status options
  const statusOptions = [
    { value: "all", label: "All Proposals" },
    { value: "Pending", label: "Pending" },
    { value: "Edited", label: "Edited" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
  ];

  useEffect(() => {
    fetchPendingProjects();
  }, [selectedStatus]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    try {
      setIsRefreshing(true);
      await fetchPendingProjects();
      showSnackbar("Projects refreshed successfully", "success");
    } catch (error) {
      showSnackbar("Failed to refresh projects", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchPendingProjects = async () => {
    try {
      setIsLoading(true);
      const status = selectedStatus === "all" ? undefined : selectedStatus;
      const response = await projectApi.getProposalsByStatus(status);

      // Map proposals to include project details
      const projectsWithProposals = response.proposals.map((proposal) => ({
        ...proposal.project,
        proposal: proposal,
        submitter: proposal.submitter,
        submitter_details: proposal.submitter_details,
      }));

      setPendingProjects(projectsWithProposals);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
      showSnackbar("Failed to fetch proposals", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (project) => {
    try {
      const proposalId = project.proposal?.proposal_id;
      if (!proposalId) {
        throw new Error("No proposal found for this project");
      }

      await projectApi.updateProposal(proposalId, {
        proposal_status: "Approved",
        comments: "Project approved",
      });
      showSnackbar("Project approved successfully", "success");
      fetchPendingProjects();
    } catch (error: any) {
      console.error("Failed to approve project:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to approve project",
        "error"
      );
    }
  };

  const handleReject = (project) => {
    const proposalId = project.proposal?.proposal_id;
    if (!proposalId) {
      showSnackbar("No proposal found for this project", "error");
      return;
    }
    setSelectedProject({ ...project, proposal_id: proposalId });
    setIsRejectDialogOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedProject?.proposal_id || !rejectionReason.trim()) return;

    try {
      await projectApi.updateProposal(selectedProject.proposal_id, {
        proposal_status: "Rejected",
        comments: rejectionReason,
      });
      showSnackbar("Project rejected successfully", "success");
      setIsRejectDialogOpen(false);
      setRejectionReason("");
      setSelectedProject(null);
      fetchPendingProjects();
    } catch (error: any) {
      console.error("Failed to reject project:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to reject project",
        "error"
      );
    }
  };

  const handleEdit = (project) => {
    navigate(`/projects/${project.id}/edit`);
  };

  const showProjectDetails = (project) => {
    setSelectedProjectDetails(project);
    setIsDetailsDialogOpen(true);
  };

  const toggleDescription = (projectId: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const truncateDescription = (text: string, maxLength: number = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;

    const words = text.split(" ");
    let truncated = "";
    for (const word of words) {
      if ((truncated + word).length > maxLength - 10) {
        return truncated + "... more";
      }
      truncated += (truncated ? " " : "") + word;
    }
    return truncated + "... more";
  };

  // Add this helper function
  const isTextTruncated = (text: string, maxLength: number = 200) => {
    return text && text.length > maxLength;
  };

  const getSubmitterName = (project) => {
    if (!project.submitter) return "Unknown";

    switch (project.submitter.role) {
      case "Student":
        return project.submitter?.student?.name
          ? `${project.submitter.student.name} ${project.submitter.student.surname}`
          : "Student";
      case "Teacher":
        return project.submitter?.teacher?.name
          ? `${project.submitter.teacher.name} ${project.submitter.teacher.surname}`
          : project.submitter.email.split("@")[0];
      case "Company":
        return project.company_name || project.submitter.email.split("@")[0];
      default:
        return project.submitter.email.split("@")[0] || "Unknown";
    }
  };

  const getSubmitterDetails = (project) => {
    const base = {
      name: getSubmitterName(project),
      role: project.submitter?.role || "Unknown",
      avatar: project.submitter?.profile_picture_url,
    };

    switch (project.submitter?.role) {
      case "Student":
        return {
          ...base,
          details: project.submitter?.student?.master_option || project.option,
        };
      case "Teacher":
        return {
          ...base,
          details: project.submitter?.teacher?.grade || "Teacher",
        };
      case "Company":
        return {
          ...base,
          details: project.internship_location || "Company",
        };
      default:
        return base;
    }
  };

  const renderProjectSubmitter = (project) => {
    const submitter = getSubmitterDetails(project);

    return (
      <div className="flex items-center gap-2">
        <Avatar
          src={submitter.avatar}
          fallback={submitter.name[0] || "?"}
          size="sm"
        />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {submitter.name}
            <span className="ml-2 text-xs text-gray-500">
              ({submitter.role})
            </span>
          </p>
          <p className="text-xs text-gray-500">
            {submitter.details} •{" "}
            {new Date(project.submission_date).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  const getSubmitterInitial = (project) => {
    const name = getSubmitterName(project);
    return name?.[0] || "?";
  };

  const getEmptyStateMessage = (status: string) => {
    switch (status) {
      case "Pending":
        return {
          icon: <FileText className="mx-auto h-12 w-12 text-gray-400" />,
          title: "No Pending Projects",
          description:
            "There are currently no projects waiting for validation.",
        };
      case "Approved":
        return {
          icon: <CheckCircle className="mx-auto h-12 w-12 text-gray-400" />,
          title: "No Approved Projects",
          description: "No projects have been approved yet.",
        };
      case "Rejected":
        return {
          icon: <XCircle className="mx-auto h-12 w-12 text-gray-400" />,
          title: "No Rejected Projects",
          description: "No projects have been rejected.",
        };
      default:
        return {
          icon: <FileText className="mx-auto h-12 w-12 text-gray-400" />,
          title: "No Projects Found",
          description: "There are no projects matching the selected status.",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Project Validation
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Review and validate submitted project proposals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pending Projects
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {pendingProjects.length} pending
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : pendingProjects.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {getEmptyStateMessage(selectedStatus).icon}
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {getEmptyStateMessage(selectedStatus).title}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {getEmptyStateMessage(selectedStatus).description}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingProjects.map((project) => (
            <div
              key={project.project_id}
              className="group bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer relative"
              onClick={() => toggleDescription(project.project_id)}
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full">
                        {project.type}
                      </span>
                    </div>

                    <div className="group">
                      <div className="relative">
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {expandedDescriptions[project.project_id]
                            ? project.summary
                            : truncateDescription(project.summary)}
                        </p>
                        {isTextTruncated(project.summary) && (
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {expandedDescriptions[project.project_id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {renderProjectSubmitter(project)}
                      <div className="sm:ml-auto">
                        <p className="text-xs font-medium uppercase text-gray-500">
                          Technologies
                        </p>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {project.technologies || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex sm:flex-col gap-2 min-w-0 sm:min-w-[120px]"
                    onClick={(e) => e.stopPropagation()} // Prevent card expansion when clicking buttons
                  >
                    <Button
                      onClick={() => handleApprove(project)}
                      variant="outline"
                      className="flex-1 sm:w-[120px] flex items-center justify-center sm:justify-start px-2 bg-green-50 hover:bg-green-100 text-green-600 border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-900/50"
                      size="sm"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="hidden sm:inline ml-2 flex-1">
                        Approve
                      </span>
                    </Button>
                    <Button
                      onClick={() => handleEdit(project)}
                      variant="outline"
                      className="flex-1 sm:w-[120px] flex items-center justify-center sm:justify-start px-2"
                      size="sm"
                    >
                      <PenSquare className="h-5 w-5" />
                      <span className="hidden sm:inline ml-2 flex-1">Edit</span>
                    </Button>
                    <Button
                      onClick={() => handleReject(project)}
                      variant="outline"
                      className="flex-1 sm:w-[120px] flex items-center justify-center sm:justify-start px-2 bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 dark:border-red-900/50"
                      size="sm"
                    >
                      <XCircle className="h-5 w-5" />
                      <span className="hidden sm:inline ml-2 flex-1">
                        Reject
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-lg ring-1 ring-black/5 group-hover:ring-black/10 dark:ring-white/5 dark:group-hover:ring-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))}
        </div>
      )}

      <Dialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        title="Reject Project"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Please provide a reason for rejecting this project.
          </p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={4}
            placeholder="Enter rejection reason..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={confirmReject}
              disabled={!rejectionReason.trim()}
            >
              Reject Project
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        title="Project Details"
      >
        {selectedProjectDetails && (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {selectedProjectDetails.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {selectedProjectDetails.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Submitter</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedProjectDetails.submittedBy}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Submission Date</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedProjectDetails.submissionDate}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Option</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedProjectDetails.option}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedProjectDetails.type}
                </p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {selectedProjectDetails.technologies
                  ?.split(",")
                  .map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-md text-sm"
                    >
                      {tech.trim()}
                    </span>
                  ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsDetailsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
