import { Button } from "../../components/ui/Button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Plus, ListChecks, FileText } from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { useProjectContext } from "../../context/ProjectContext";
import { Project, ProjectProposal } from "../../types/project";
import { projectApi } from "../../api/projectApi";
import { Tabs } from "../../components/ui/Tabs";

export function StudentProjectPage() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validatedProjects, setValidatedProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<ProjectProposal[]>([]);
  const navigate = useNavigate();
  const { projects, loading: projectsLoading } = useProjectContext();
  const [activeTab, setActiveTab] = useState<
    "available" | "selection" | "proposals"
  >("available");

  useEffect(() => {
    fetchProjectsAndProposals();
  }, [projects]);

  const fetchProjectsAndProposals = async () => {
    try {
      setIsLoading(true);
      // Filter validated projects from context
      const validated = projects.filter((p) => p.status === "Validated");
      setValidatedProjects(validated);

      // Fetch user's proposals
      const proposalResponse = await projectApi.getProposals();
      setProposals(proposalResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || projectsLoading) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.studentProject.pfeProjects}
        </h1>
        {!hasReachedProposalLimit && (
          <Button
            onClick={() => navigate("/projects/new")}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t.studentProject.proposeNewProject}
          </Button>
        )}
      </div>

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
            <div className="mt-6 grid grid-cols-1 gap-4">
              {validatedProjects.map((project) => (
                <div
                  key={project.project_id}
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
                            {t.studentProject.option}:
                          </span>{" "}
                          {project.option}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.summary}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/projects/${project.project_id}`)
                      }
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
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
              Browse available projects and add them to your selection list. You
              can select up to 10 projects to prioritize.
            </p>
          </div>
        </Tabs.Content>

        <Tabs.Content value="proposals">
          {proposals.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.proposal_id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {proposal.project_id}
                      </h3>
                      <ProposalStatus status={proposal.proposal_status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                No Project Proposals
              </h3>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                You haven't submitted any project proposals yet. You can submit
                up to 3 proposals.
              </p>
            </div>
          )}
        </Tabs.Content>
      </Tabs>
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
