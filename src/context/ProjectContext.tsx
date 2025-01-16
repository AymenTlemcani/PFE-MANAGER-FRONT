import React, { createContext, useContext, useEffect, useState } from "react";
import { Project } from "../types/project";
import { projectApi } from "../api/projectApi";
import { useAuthStore } from "../store/authStore";

interface ProjectContextType {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
}

// Export the context
export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);

// Export the provider component
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await projectApi.getProjects();
      console.log("📊 Fetched projects:", response);

      // Filter projects for teachers to show only their submitted projects
      const filteredProjects =
        user?.role === "Teacher"
          ? response.filter((project) => project.submitted_by === user.user_id)
          : response;

      setProjects(filteredProjects);
    } catch (err: any) {
      setError(err.message || "Failed to fetch projects");
      console.error("❌ Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProjects = async () => {
    return fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.user_id]); // Refetch when user changes

  const value = {
    projects,
    loading,
    error,
    refreshProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

// Export the hook
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};
