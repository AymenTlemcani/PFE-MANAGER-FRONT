import { ReactNode, useState } from "react";
import { ProjectContext } from "./ProjectContext";

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "AI-based Image Recognition",
      option: "IA",
      type: "Innovative",
      status: "In Progress",
      submittedDate: "2024-03-15",
    },
    {
      id: 2,
      title: "Blockchain Supply Chain",
      option: "GL",
      type: "Classic",
      status: "Pending Approval",
      submittedDate: "2024-03-18",
    },
  ]);

  const addProject = (newProject) => {
    setProjects((prev) => [...prev, newProject]);
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
