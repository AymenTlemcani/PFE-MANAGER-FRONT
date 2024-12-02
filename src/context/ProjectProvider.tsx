import { ReactNode, useState } from "react";
import { ProjectContext } from "./ProjectContext";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "AI-based Image Recognition",
    option: "IA",
    type: "Innovative",
    status: "In Progress",
    submittedDate: "2024-03-15",
    submittedBy: "teacher",
  },
  {
    id: 2,
    title: "Blockchain Supply Chain",
    option: "GL",
    type: "Classic",
    status: "Pending Approval",
    submittedDate: "2024-03-18",
    submittedBy: "company",
  },
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState(MOCK_PROJECTS);

  const addProject = (newProject: any) => {
    setProjects((prev) => [...prev, newProject]);
  };

  const value = {
    projects,
    addProject,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}
