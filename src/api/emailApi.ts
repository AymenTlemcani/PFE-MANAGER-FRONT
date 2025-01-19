import axios from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import type {
  EmailTemplate,
  EmailCampaign,
  ReminderSchedule,
  CampaignLog,
} from "../types/email";

interface EmailTemplateCreate {
  name: string;
  subject: string;
  content: string;
  description?: string;
  placeholders?: string[];
  type: "System" | "Notification" | "Reminder";
  language: "French" | "English";
  is_active?: boolean;
}

interface EmailCampaignCreate {
  name: string;
  type: "Notification" | "Reminder" | "System";
  target_audience:
    | "Students"
    | "Teachers"
    | "Companies"
    | "Administrators"
    | "All";
  start_date: string;
  end_date: string;
  template_id: number;
  reminders?: {
    days_before_deadline: number;
    send_time: string;
  }[];
}

export const emailApi = {
  // Template Management
  async getTemplates() {
    console.log("📤 Requesting email templates...");
    try {
      const response = await axios.get<EmailTemplate[]>(
        API_ENDPOINTS.emails.templates
      );
      console.log("📥 Received templates response:", {
        count: response.data.length,
        templates: response.data,
        status: response.status,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch templates:", {
        error,
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async createTemplate(data: EmailTemplateCreate) {
    console.log("📤 Creating new template:", {
      ...data,
      content: data.content.substring(0, 100) + "...", // Truncate for logging
    });

    try {
      const response = await axios.post<EmailTemplate>(
        API_ENDPOINTS.emails.templates,
        data
      );

      console.log("✅ Template created successfully:", {
        id: response.data.template_id,
        name: response.data.name,
        type: response.data.type,
      });

      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to create template:", {
        error: error.message,
        validationErrors: error.response?.data?.errors,
        requestData: data,
      });

      // Enhance error with validation details
      if (error.response?.data?.errors) {
        error.validationErrors = error.response.data.errors;
      }

      throw error;
    }
  },

  async updateTemplate(id: number, data: Partial<EmailTemplateCreate>) {
    console.log(`📤 Updating template with ID ${id}:`, data);
    try {
      const response = await axios.put<EmailTemplate>(
        `${API_ENDPOINTS.emails.templates}/${id}`,
        data
      );
      console.log("✅ Template updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update template with ID ${id}:`, {
        error,
        data,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async deleteTemplate(id: number) {
    console.log(`📤 Deleting template with ID ${id}...`);
    try {
      await axios.delete(`${API_ENDPOINTS.emails.templates}/${id}`);
      console.log(`✅ Template with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`❌ Failed to delete template with ID ${id}:`, {
        error,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async getTemplateById(id: number) {
    console.log(`📤 Requesting template with ID ${id}...`);
    try {
      const response = await axios.get<EmailTemplate>(
        `${API_ENDPOINTS.emails.templates}/${id}`
      );
      console.log("📥 Received template response:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch template with ID ${id}:`, {
        error,
        response: error.response?.data,
      });
      throw error;
    }
  },

  // Campaign Management
  async getCampaigns() {
    console.log("📤 Requesting email campaigns...");
    try {
      const response = await axios.get<EmailCampaign[]>(
        API_ENDPOINTS.emails.campaigns
      );
      console.log("📥 Received campaigns response:", {
        count: response.data.length,
        campaigns: response.data,
        status: response.status,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch campaigns:", {
        error,
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async createCampaign(data: EmailCampaignCreate): Promise<EmailCampaign> {
    console.log("📤 Creating new campaign:", {
      ...data,
      reminders: data.reminders?.length,
    });

    try {
      const formattedData = {
        ...data,
        // Format reminders to match backend expectations
        reminders: data.reminders?.map((r) => ({
          ...r,
          send_time: r.send_time + ":00", // Add seconds to time
        })),
      };

      const response = await axios.post<EmailCampaign>(
        API_ENDPOINTS.emails.campaigns,
        formattedData
      );

      console.log("✅ Campaign created successfully:", {
        id: response.data.campaign_id,
        name: response.data.name,
        reminders: response.data.reminder_schedules?.length,
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to create campaign:", {
        error,
        data,
        message: error.response?.data?.message,
      });
      throw error;
    }
  },

  async updateCampaign(id: number, data: Partial<EmailCampaignCreate>) {
    console.log(`📤 Updating campaign with ID ${id}:`, data);
    try {
      const response = await axios.put<EmailCampaign>(
        `${API_ENDPOINTS.emails.campaigns}/${id}`,
        data
      );
      console.log("✅ Campaign updated successfully:", response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to update campaign with ID ${id}:`, {
        error,
        data,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async deleteCampaign(id: number) {
    console.log(`📤 Deleting campaign with ID ${id}...`);
    try {
      await axios.delete(`${API_ENDPOINTS.emails.campaigns}/${id}`);
      console.log(`✅ Campaign with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error(`❌ Failed to delete campaign with ID ${id}:`, {
        error,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async activateCampaign(id: number) {
    console.log(`📤 Activating campaign with ID ${id}...`);
    try {
      const response = await axios.post(
        API_ENDPOINTS.emails.activateCampaign(id)
      );
      console.log(`✅ Campaign with ID ${id} activated successfully.`);
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to activate campaign with ID ${id}:`, {
        error,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async getCampaignLogs(id: number) {
    console.log(`📤 Requesting logs for campaign with ID ${id}...`);
    try {
      const response = await axios.get<{
        data: CampaignLog[];
        pagination: {
          current_page: number;
          total: number;
          per_page: number;
        };
      }>(API_ENDPOINTS.emails.campaignLogs(id));
      console.log("📥 Received campaign logs response:", {
        logs: response.data.data,
        pagination: response.data.pagination,
      });
      return response.data;
    } catch (error) {
      console.error(`❌ Failed to fetch logs for campaign with ID ${id}:`, {
        error,
        response: error.response?.data,
      });
      throw error;
    }
  },

  async getCampaignReminders(campaignId: number) {
    console.log(
      `📤 Requesting reminders for campaign with ID ${campaignId}...`
    );
    try {
      const response = await axios.get<ReminderSchedule[]>(
        API_ENDPOINTS.emails.campaignReminders(campaignId)
      );
      console.log("📥 Received campaign reminders response:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        `❌ Failed to fetch reminders for campaign with ID ${campaignId}:`,
        {
          error,
          response: error.response?.data,
        }
      );
      throw error;
    }
  },
};
