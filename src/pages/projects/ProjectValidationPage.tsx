import { useState } from "react";
import { CheckCircle, XCircle, PenSquare, Info } from "lucide-react"; // Add Info import
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
      },
      {
        id: 2,
        title: "Blockchain Supply Chain",
        submittedBy: "Dr. Sarah Johnson",
        option: "GL",
        type: "Industry",
        submissionDate: "2024-03-14",
        status: "Pending",
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Project Validation
        </h1>
        <Button onClick={loadTestData} variant="outline">
          Load Test Data
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Pending Projects
          </h2>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <div key={project.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-sm">Proposed by</span>
                      <div className="flex items-center gap-2">
                        <Avatar
                          src={project.submitterAvatar}
                          fallback={project.submittedBy[0]}
                          size="xs"
                        />
                        <span className="text-sm font-medium">
                          {project.submittedBy}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Option:</span>{" "}
                        {project.option}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Type:</span>{" "}
                        {project.type}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Technologies:</span>{" "}
                        {project.technologies}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Submitted:</span>{" "}
                        {project.submissionDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(project)}
                      className="flex items-center gap-1"
                      variant="success"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleEdit(project)}
                      className="flex items-center gap-1"
                    >
                      <PenSquare className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleReject(project)}
                      className="flex items-center gap-1"
                      variant="danger"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
