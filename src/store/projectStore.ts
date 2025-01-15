import { create } from "zustand";
import { projectApi } from "../api/projectApi";
import { Project, ProjectProposal } from "../types/project";

interface ProjectStore {
  projects: Project[];
  proposals: ProjectProposal[];
  isLoading: boolean;
  error: string | null;
  submitProject: (data: Partial<Project>) => Promise<void>;
  submitProposal: (data: Partial<ProjectProposal>) => Promise<void>;
  fetchProposals: () => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  proposals: [],
  isLoading: false,
  error: null,

  submitProject: async (data) => {
    set({ isLoading: true, error: null });
    try {
      console.log("📤 Submitting project:", data);
      const response = await projectApi.submitProject(data);
      console.log("📥 Project submitted successfully:", response);
      set((state) => ({
        projects: [...state.projects, response],
        isLoading: false,
      }));
      return response; // Important: Return the full response
    } catch (error: any) {
      console.error("❌ Project submission failed:", error);
      console.error("❌ Validation errors:", error.response?.data?.errors);
      set({ error: "Failed to submit project", isLoading: false });
      throw error;
    }
  },

  submitProposal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      console.log("📤 Submitting proposal:", data);
      const proposal = await projectApi.submitProposal(data);
      console.log("📥 Proposal submitted successfully:", proposal);
      set((state) => ({
        proposals: [...state.proposals, proposal],
        isLoading: false,
      }));
      return proposal;
    } catch (error) {
      console.error("❌ Proposal submission failed:", error);
      set({ error: "Failed to submit proposal", isLoading: false });
      throw error;
    }
  },

  fetchProposals: async () => {
    set({ isLoading: true, error: null });
    try {
      const proposals = await projectApi.getProposals();
      set({ proposals, isLoading: false });
    } catch (error) {
      set({ error: "Failed to fetch proposals", isLoading: false });
      throw error;
    }
  },
}));
