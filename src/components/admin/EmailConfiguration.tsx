import { useState } from "react";
import { Mail, Bell, Calendar, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { EmailPeriod, EmailTemplate } from "../../types/email";
import { useTranslation } from "../../hooks/useTranslation";

export function EmailConfiguration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [periods, setPeriods] = useState<EmailPeriod[]>(() => {
    // Load periods from localStorage
    const savedPeriods = localStorage.getItem("emailPeriods");
    return savedPeriods
      ? JSON.parse(savedPeriods)
      : [
          {
            id: "1",
            name: "Teacher Project Proposals",
            startDate: "2024-03-01",
            reminderDates: ["2024-03-15", "2024-03-25"],
            closingDate: "2024-03-30",
            targetAudience: "teachers",
            status: "pending",
            templates: {
              initial: {
                id: "t1",
                name: "Initial Call for Projects",
                subject: "Call for PFE Project Proposals",
                body: "Dear {teacherName},\n\nPlease submit your project proposals...",
                variables: ["teacherName"],
              },
              reminder: {
                id: "t2",
                name: "Reminder",
                subject: "Reminder: PFE Project Proposals",
                body: "Dear {teacherName},\n\nThis is a reminder to submit...",
                variables: ["teacherName"],
              },
              closing: {
                id: "t3",
                name: "Closing Notice",
                subject: "Project Proposal Period Closing",
                body: "Dear {teacherName},\n\nThe project proposal period will close...",
                variables: ["teacherName"],
              },
            },
          },
        ];
  });

  const handleFillTestData = () => {
    const testPeriods: EmailPeriod[] = [
      {
        id: "1",
        name: "Teacher Project Proposals",
        startDate: "2024-03-01",
        reminderDates: ["2024-03-15", "2024-03-25"],
        closingDate: "2024-03-30",
        targetAudience: "teachers",
        status: "active",
        // status: "pending",
        templates: {
          initial: {
            id: "t1",
            name: "Initial Call",
            subject: "Call for PFE Project Proposals 2024",
            body: "Dear {teacherName},\n\nThe PFE project proposal period is now open. Please submit your project proposals through the platform by {deadline}.\n\nBest regards,\nPFE Administration",
            variables: ["teacherName", "deadline"],
          },
          reminder: {
            id: "t2",
            name: "Reminder",
            subject: "Reminder: PFE Proposals Due Soon",
            body: "Dear {teacherName},\n\nThis is a reminder that the project proposal period will close on {deadline}. Don't forget to submit your proposals.\n\nBest regards,\nPFE Administration",
            variables: ["teacherName", "deadline"],
          },
          closing: {
            id: "t3",
            name: "Closing",
            subject: "PFE Proposal Period Closing Today",
            body: "Dear {teacherName},\n\nThe project proposal period will close today at {time}. Please ensure all your proposals are submitted.\n\nBest regards,\nPFE Administration",
            variables: ["teacherName", "time"],
          },
        },
      },
    ];

    setPeriods(testPeriods);
    localStorage.setItem("emailPeriods", JSON.stringify(testPeriods));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t.emailConfig.title}
          </h2>
          <Button variant="outline" size="sm" onClick={handleFillTestData}>
            {t.emailConfig.fillTestData}
          </Button>
        </div>
        <Button
          onClick={() => navigate("/dashboard/emails/new")}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t.emailConfig.newPeriod}
        </Button>
      </div>

      <div className="grid gap-6">
        {periods.map((period) => (
          <div
            key={period.id}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {period.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t.emailConfig.target}: {period.targetAudience}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={period.status === "active" ? "success" : "secondary"}
                >
                  {period.status === "active" 
                    ? t.emailConfig.statusActive 
                    : t.emailConfig.statusPending}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/emails/${period.id}`)}
                >
                  {t.emailConfig.configure}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <DateDisplay
                icon={Mail}
                label={t.emailConfig.startDate}
                date={period.startDate}
              />
              <DateDisplay
                icon={Bell}
                label={t.emailConfig.reminders}
                date={`${period.reminderDates.length} ${t.emailConfig.scheduled}`}
              />
              <DateDisplay
                icon={Calendar}
                label={t.emailConfig.closingDate}
                date={period.closingDate}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.emailConfig.emailTemplates}
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <TemplatePreview
                  template={period.templates.initial}
                  type={t.emailConfig.initialTemplate}
                />
                <TemplatePreview
                  template={period.templates.reminder}
                  type={t.emailConfig.reminderTemplate}
                />
                <TemplatePreview
                  template={period.templates.closing}
                  type={t.emailConfig.closingTemplate}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper components
function DateDisplay({
  icon: Icon,
  label,
  date,
}: {
  icon: any;
  label: string;
  date: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    </div>
  );
}

function TemplatePreview({
  template,
  type,
}: {
  template: EmailTemplate;
  type: string;
}) {
  return (
    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {type}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {template.subject}
      </p>
    </div>
  );
}
