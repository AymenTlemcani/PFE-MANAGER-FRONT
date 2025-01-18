export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface EmailCampaign {
  id: string;
  name: string;
  startDate: string;
  reminderDates: string[];
  closingDate: string;
  templates: {
    initial: EmailTemplate;
    reminder: EmailTemplate;
    closing: EmailTemplate;
  };
  targetAudience: "teachers" | "students" | "companies" | "all";
  status: "draft" | "active" | "completed";
}

export interface ReminderSchedule {
  id: string;
  campaignId: string;
  date: string;
  template: EmailTemplate;
  status: "pending" | "sent";
}

export interface CampaignLog {
  id: string;
  campaignId: string;
  type: "initial" | "reminder" | "closing";
  sentAt: string;
  recipientCount: number;
  status: "success" | "failure";
  error?: string;
}
