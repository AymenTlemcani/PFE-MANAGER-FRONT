import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, FileText, Users, Plus } from "lucide-react";

export function StudentProjectPage() {
  const [project, setProject] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch actual project data
    setProject({
      title: "AI-based Image Recognition System",
      supervisor: "Dr. Sarah Wilson",
      coSupervisor: "Dr. John Smith",
      partner: "Alice Johnson",
      startDate: "2024-01-15",
      status: "In Progress",
      option: "IA",
      type: "innovative",
      description:
        "Development of an AI system for real-time image recognition using deep learning techniques.",
      technologies: "Python, TensorFlow, OpenCV",
      hardwareRequirements: "GPU Server for training",
      nextReview: "2024-04-15",
      progressReports: [
        { id: 1, date: "2024-02-15", status: "Submitted" },
        { id: 2, date: "2024-03-15", status: "Due" },
      ],
    });
  }, []);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My PFE Project
        </h1>
        <div className="flex gap-4">
          <Button
            onClick={() => navigate("/projects/new")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Submit PFE Project
          </Button>
          <Button
            onClick={() => navigate("/projects/report")}
            variant="outline"
          >
            Submit Progress Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Project Details
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
                    Supervisor
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {project.supervisor}
                  </p>
                </div>
                {project.coSupervisor && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Co-Supervisor
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {project.coSupervisor}
                    </p>
                  </div>
                )}
                {project.partner && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Partner
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
              Technical Details
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Technologies
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {project.technologies}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Hardware Requirements
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
              Project Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Next Review</span>
                </div>
                <span className="text-sm font-medium">
                  {project.nextReview}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Progress Reports
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
              Progress Reports
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
