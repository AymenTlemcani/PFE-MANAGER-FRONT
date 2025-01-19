export interface EmailTemplate {
  template_id: number;
  name: string;
  subject: string;
  content: string;
  description?: string;
  placeholders?: string[];
  type: "System" | "Notification" | "Reminder";
  language: "French" | "English";
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EmailCampaign {
  campaign_id: number;
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
  status: "Draft" | "Active" | "Completed" | "Cancelled";
  reminder_schedules?: ReminderSchedule[];
  email_logs?: CampaignLog[];
  created_at?: string;
  updated_at?: string;
}

export interface ReminderSchedule {
  schedule_id: number;
  campaign_id: number;
  template_id: number;
  days_before_deadline: number;
  send_time: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
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
