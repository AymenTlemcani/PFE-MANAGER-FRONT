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

    console.log("🏁 Starting project submission process");

    const requestData = {
      // Common project fields
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
      // Co-supervisor fields directly in the request
      co_supervisor_name: data.co_supervisor_name || null,
      co_supervisor_surname: data.co_supervisor_surname || null,
    };

    console.log("📝 Formatted request data:", requestData);

    try {
      console.log("📤 Sending project creation request...");
      const response = await axios.post(
        API_ENDPOINTS.projects.create,
        requestData
      );

      console.log("✅ Project creation successful!", {
        projectId: response.data.project_id,
        status: response.status,
        responseData: response.data,
        timestamp: new Date().toISOString(),
      });

      console.log("📊 Database record created:", {
        project: {
          id: response.data.project_id,
          title: response.data.title,
          type: response.data.type,
          status: response.data.status,
        },
        proposal: {
          id: response.data.project_proposal?.proposal_id,
          status: response.data.project_proposal?.proposal_status,
          proposerType: response.data.project_proposal?.proposer_type,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Project Submission Error:", {
        error,
        sqlError: error.response?.data?.sqlError,
        requestData,
        validationErrors: error.response?.data?.errors,
        timestamp: new Date().toISOString(),
      });

      // Log specific validation failures if any
      if (error.response?.data?.errors) {
        console.error("🚫 Validation Failures:", {
          fields: Object.keys(error.response.data.errors),
          details: error.response.data.errors,
        });
      }

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

  async getProjects() {
    const { userId } = verifyAuth();

    try {
      console.log("📤 Fetching projects...");
      const response = await axios.get(API_ENDPOINTS.projects.list);

      console.log("✅ Projects fetched successfully:", {
        count: response.data.length,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Error fetching projects:", error);
      throw error;
    }
  },
};
