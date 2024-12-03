export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

export interface EmailPeriod {
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
  status: "pending" | "active" | "completed";
}
