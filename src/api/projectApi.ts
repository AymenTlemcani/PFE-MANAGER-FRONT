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
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    console.log("🏁 Starting project submission process");

    try {
      // Only check submission count for students
      if (user.role === "Student") {
        const existingProjects = await this.getProjects();
        // Use user.user_id instead of userId from token
        const studentProjects = existingProjects.filter(
          (p) => p.submitted_by === user.user_id && p.status !== "Rejected"
        );

        console.log("📊 Current project count:", {
          total: studentProjects.length,
          projects: studentProjects,
          userId: user.user_id, // Log the actual user ID being used
        });

        if (studentProjects.length >= 3) {
          throw new Error("Maximum number of project proposals (3) reached");
        }
      }

      // Format request data using correct user ID
      const requestData = {
        title: data.title,
        summary: data.summary,
        technologies: data.technologies,
        material_needs: data.material_needs,
        option: data.option,
        type: data.type,
        submitted_by: user.user_id, // Use user.user_id instead of token userId
        status: "Proposed",
        // Company fields - send both id and name
        company_id: data.company_id,
        company_name: data.company_name,
        // Internship fields
        internship_location: data.internship_location,
        internship_duration_months: data.internship_duration_months,
        internship_start_date: data.internship_start_date,
        internship_salary: data.internship_salary,
        // Include proposal data
        proposal: {
          ...data.proposal,
          submitted_by: user.user_id, // Use user.user_id here too
          proposer_type: user.role,
          proposal_status: "Pending",
        },
      };

      console.log("📝 Formatted request data:", requestData);

      const response = await axios.post(
        API_ENDPOINTS.projects.create,
        requestData
      );

      console.log("✅ Project creation successful:", {
        project: response.data,
        status: response.status,
      });

      return response.data;
    } catch (error: any) {
      // Handle both frontend and backend validations
      if (error.response?.data?.errors?.submissions) {
        throw new Error("Maximum number of project proposals (3) reached");
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

  async getProjectsByStatus(status?: string) {
    const { userId } = verifyAuth();
    try {
      console.log("📤 Fetching projects by status:", status || "all");

      // If no status is provided, fetch all projects
      const url = status
        ? API_ENDPOINTS.projects.listByStatus(status)
        : API_ENDPOINTS.projects.list;

      const response = await axios.get(url);

      // Handle both response formats
      const projects = response.data.projects || response.data;

      console.log("✅ Projects fetched successfully:", {
        status: status || "all",
        count: projects.length,
        timestamp: new Date().toISOString(),
      });

      return projects;
    } catch (error) {
      console.error("❌ Error fetching projects by status:", error);
      throw error;
    }
  },

  async getProposalsByStatus(status?: string) {
    const { userId } = verifyAuth();
    try {
      console.log("📤 Fetching proposals by status:", status || "all");

      const url = status
        ? `${API_ENDPOINTS.projects.proposals}?status=${status}`
        : API_ENDPOINTS.projects.proposals;

      const response = await axios.get(url);

      console.log("✅ Proposals fetched successfully:", {
        status: status || "all",
        count: response.data.proposals?.length || 0,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching proposals by status:", error);
      throw error;
    }
  },

  async approveProject(proposalId: number, comments: string) {
    verifyAuth();
    try {
      console.log("📤 Approving project proposal:", { proposalId, comments });
      const response = await axios.put(
        API_ENDPOINTS.projects.validateProposal(proposalId),
        {
          proposal_status: "Approved",
          comments: comments,
        }
      );

      console.log("✅ Project approval successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error approving project:", error);
      throw error;
    }
  },

  async rejectProject(proposalId: number, comments: string) {
    verifyAuth();
    try {
      console.log("📤 Rejecting project proposal:", { proposalId, comments });
      const response = await axios.put(
        API_ENDPOINTS.projects.validateProposal(proposalId),
        {
          proposal_status: "Rejected",
          comments: comments,
        }
      );

      console.log("✅ Project rejection successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error rejecting project:", error);
      throw error;
    }
  },

  async getPendingProjects() {
    verifyAuth();
    try {
      const response = await axios.get(API_ENDPOINTS.projects.proposals);
      return response.data.filter(
        (proposal) => proposal.proposal_status === "Pending"
      );
    } catch (error) {
      console.error("Error fetching pending projects:", error);
      throw error;
    }
  },
};
