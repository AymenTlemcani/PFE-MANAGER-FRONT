
import { useState } from 'react';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Dialog } from '../../components/ui/Dialog';

export function ProjectValidationPage() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingProjects = [
    {
      id: 1,
      title: "AI Healthcare System",
      submittedBy: "Dr. John Smith",
      option: "IA",
      type: "Research",
      submissionDate: "2024-03-15",
      status: "Pending"
    },
    {
      id: 2,
      title: "Blockchain Supply Chain",
      submittedBy: "Dr. Sarah Johnson",
      option: "GL",
      type: "Industry",
      submissionDate: "2024-03-14",
      status: "Pending"
    }
  ];

  const handleApprove = (project) => {
    // TODO: Implement project approval
    console.log('Approving project:', project.id);
  };

  const handleReject = (project) => {
    setSelectedProject(project);
    setIsRejectDialogOpen(true);
  };

  const confirmReject = () => {
    // TODO: Implement project rejection with reason
    console.log('Rejecting project:', selectedProject?.id, rejectionReason);
    setIsRejectDialogOpen(false);
    setRejectionReason('');
    setSelectedProject(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Project Validation</h1>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Projects
          </h2>

          <div className="divide-y divide-gray-200">
            {pendingProjects.map((project) => (
              <div key={project.id} className="py-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.title}
                    </h3>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        Submitted by: {project.submittedBy}
                      </p>
                      <p className="text-sm text-gray-500">
                        Option: {project.option} | Type: {project.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        Submitted: {project.submissionDate}
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
          <p className="text-sm text-gray-500">
            Please provide a reason for rejecting this project.
          </p>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-3"
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
    </div>
  );
}