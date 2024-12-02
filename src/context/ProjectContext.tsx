import { createContext, useContext } from "react";

interface Project {
  id: number;
  title: string;
  option: string;
  type: "student_proposal" | "company_internship" | "teacher_proposal";
  status: string;
  submittedDate: string;
  // Additional fields for student projects
  companyId?: string;
  supervisorName?: string;
  duration?: string;
  technologies?: string;
  location?: string;
  paid?: boolean;
  salary?: string;
  studentId?: string;
  studentName?: string;
  partnerName?: string;
  hardwareRequirements?: string;
  supervisorId?: string;
  coSupervisorId?: string;
  submittedBy: 'teacher' | 'student' | 'company';
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
