import { createContext, useContext } from "react";

interface Project {
  id: number;
  title: string;
  option: string;
  type: string;
  status: string;
  submittedDate: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
}
