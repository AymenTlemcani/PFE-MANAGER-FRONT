import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  PenSquare,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react"; // Add Info import
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../../components/ui/Avatar"; // Add this import
import { Tooltip } from "../../components/ui/Tooltip"; // Add this import

export function ProjectValidationPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate(); // Add navigate hook
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<number, boolean>
  >({});

  const handleApprove = (project) => {
    // TODO: Implement project approval
    console.log("Approving project:", project.id);
  };

  const handleReject = (project) => {
    setSelectedProject(project);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = () => {
    console.log("Rejecting project:", selectedProject?.id, rejectionReason);
    setIsRejectDialogOpen(false);
    setRejectionReason("");
    setSelectedProject(null);
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
    const words = text.split(" ");
    if (text.length <= maxLength) return text;

    let truncated = "";
    for (const word of words) {
      if ((truncated + word).length > maxLength - 10) {
        // Leave room for "... more"
        return truncated + "... more";
      }
      truncated += (truncated ? " " : "") + word;
    }
    return truncated + "... more";
  };

  const loadTestData = () => {
    setProjects([
      {
        id: 1,
        title: "AI Healthcare System",
        submittedBy: "Dr. John Smith",
        option: "IA",
        type: "Research",
        submissionDate: "2024-03-15",
        status: "Pending",
        technologies: "Python, TensorFlow, Computer Vision, Deep Learning",
        description:
          "An innovative healthcare system using AI to detect early signs of diseases from medical imaging. The project aims to improve diagnostic accuracy and reduce detection time using state-of-the-art deep learning models. This comprehensive solution integrates multiple AI technologies including computer vision, natural language processing, and predictive analytics to create a robust diagnostic support system. The system will be trained on a large dataset of medical images, including X-rays, MRIs, and CT scans, to identify patterns and anomalies that might be missed by human observation. Key features include: automated image analysis for early disease detection, real-time diagnostic suggestions, integration with existing hospital management systems, and a user-friendly interface for healthcare professionals. The project also includes a research component focusing on improving model accuracy and reducing false positives through advanced machine learning techniques.",
      },
      {
        id: 2,
        title: "Blockchain Supply Chain",
        submittedBy: "Dr. Sarah Johnson",
        option: "GL",
        type: "Industry",
        submissionDate: "2024-03-14",
        status: "Pending",
        technologies: "Solidity, Ethereum, Web3.js, React",
        description:
          "A blockchain-based supply chain management system to ensure transparency and traceability of products. Features smart contracts for automated compliance and real-time tracking capabilities.",
      },
      {
        id: 3,
        title: "Smart City IoT Platform",
        submittedBy: "Prof. Michael Chang",
        option: "ESB",
        type: "Research",
        submissionDate: "2024-03-13",
        status: "Pending",
        technologies: "IoT, MQTT, Node.js, Time-series DB",
        description:
          "Development of an IoT platform for smart city management, including sensors for environmental monitoring, traffic management, and urban infrastructure maintenance.",
      },
    ]);
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
        <Button onClick={loadTestData} variant="outline">
          Load Test Data
        </Button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pending Projects
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
          {projects.length} pending
        </span>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => toggleDescription(project.id)}
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
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {expandedDescriptions[project.id]
                          ? project.description
                          : truncateDescription(project.description)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={project.submitterAvatar}
                        fallback={project.submittedBy[0]}
                        size="sm"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {project.submittedBy}
                        </p>
                        <p className="text-xs text-gray-500">
                          {project.option} Department • {project.submissionDate}
                        </p>
                      </div>
                    </div>
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
                    <span className="hidden sm:inline ml-2 flex-1">Reject</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

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
