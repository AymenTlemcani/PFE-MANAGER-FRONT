import axios from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import { Project, ProjectProposal } from "../types/project";

const verifyAuth = () => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("user_id");

  console.log("🔒 Project API Auth Check:", {
    hasToken: !!token,
    tokenLength: token?.length,
    userId: userId,
    tokenPreview: token ? `${token.substring(0, 15)}...` : "none",
  });

  if (!token) {
    throw new Error("No authentication token found");
  }

  if (!userId) {
    throw new Error("No user ID found");
  }

  // Ensure userId is a valid number
  const userIdNum = parseInt(userId);
  if (isNaN(userIdNum)) {
    throw new Error("Invalid user ID format");
  }

  return { token, userId: userIdNum };
};

export const projectApi = {
  async submitProject(data: Partial<Project>) {
    const { userId } = verifyAuth();

    // Ensure required fields are present with proper types
    const requestData = {
      // Project fields
      title: data.title,
      summary: data.summary,
      technologies: data.technologies,
      material_needs: data.material_needs || null,
      option: data.option,
      type: data.type,
      status: "Proposed",
      submitted_by: userId,
      submission_date: new Date().toISOString().split("T")[0],
      last_updated_date: new Date().toISOString().split("T")[0],

      // Project proposal fields - in a separate object
      project_proposal: {
        co_supervisor_name: data.proposal?.co_supervisor_name || "",
        co_supervisor_surname: data.proposal?.co_supervisor_surname || "",
        proposal_status: "Pending",
        is_final_version: true,
        proposal_order: 1,
        proposer_type: "Teacher",
        submitted_by: userId,
        review_comments: "Initial submission",
      },
    };

    try {
      console.log("📤 Submitting final project data:", requestData);
      const response = await axios.post(
        API_ENDPOINTS.projects.create,
        requestData
      );
      return response.data;
    } catch (error: any) {
      console.error("❌ Project Submission Error:", {
        error,
        sqlError: error.response?.data?.sqlError,
        requestData,
        validationErrors: error.response?.data?.errors,
      });
      throw error;
    }
  },

  async submitProposal(data: Partial<ProjectProposal>) {
    verifyAuth();
    console.log("Submitting proposal with data:", data);
    try {
      const response = await axios.post(API_ENDPOINTS.projects.propose, {
        ...data,
        submitted_by: localStorage.getItem("user_id"),
        proposer_type: "Teacher",
        proposal_status: "Pending",
        is_final_version: true,
        proposal_order: 1,
      });
      console.log("Proposal submission response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Proposal submission failed:", {
        error,
        requestData: data,
        errorResponse: error.response?.data,
      });
      throw error;
    }
  },

  async getProposals() {
    verifyAuth();
    const response = await axios.get(API_ENDPOINTS.projects.proposed);
    return response.data;
  },

  async updateProposal(id: number, data: Partial<ProjectProposal>) {
    verifyAuth();
    const response = await axios.put(
      `${API_ENDPOINTS.projects.propose}/${id}`,
      data
    );
    return response.data;
  },
};
