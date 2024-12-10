import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ArrowLeft, X } from "lucide-react";
import type { EmailPeriod, EmailTemplate } from "../../types/email";
import { useTranslation } from "../../hooks/useTranslation";

function EmailPeriodConfigPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EmailPeriod>(() => {
    if (id) {
      const savedPeriods = localStorage.getItem("emailPeriods");
      if (savedPeriods) {
        const periods = JSON.parse(savedPeriods);
        const existingPeriod = periods.find((p: EmailPeriod) => p.id === id);
        if (existingPeriod) {
          return existingPeriod;
        }
      }
    }

    // Default new period data
    return {
      id: String(Date.now()),
      name: "",
      startDate: "",
      reminderDates: [],
      closingDate: "",
      targetAudience: "all",
      status: "pending",
      templates: {
        initial: {
          id: `t${Date.now()}-1`,
          name: "Initial Email",
          subject: "",
          body: "",
          variables: ["name", "date"],
        },
        reminder: {
          id: `t${Date.now()}-2`,
          name: "Reminder Email",
          subject: "",
          body: "",
          variables: ["name", "date"],
        },
        closing: {
          id: `t${Date.now()}-3`,
          name: "Closing Email",
          subject: "",
          body: "",
          variables: ["name", "date"],
        },
      },
    };
  });

  const handleSave = async () => {
    // Save to localStorage for now
    const existingPeriods = JSON.parse(
      localStorage.getItem("emailPeriods") || "[]"
    );
    const updatedPeriods = id
      ? existingPeriods.map((p: EmailPeriod) => (p.id === id ? formData : p))
      : [...existingPeriods, formData];

    localStorage.setItem("emailPeriods", JSON.stringify(updatedPeriods));
    navigate("/dashboard/emails");
  };

  const handleFillTestData = () => {
    setFormData({
      ...formData,
      name: "Project Proposals Deadline",
      startDate: "2024-03-01",
      reminderDates: ["2024-03-15", "2024-03-25"],
      closingDate: "2024-03-30",
      targetAudience: "teachers",
      status: "pending",
      templates: {
        initial: {
          id: formData.templates.initial.id,
          name: "Initial Notice",
          subject: "PFE Project Proposals Period Started",
          body: "Dear {teacherName},\n\nThe PFE project proposal period for {academicYear} has started. Please submit your project proposals through the platform by {deadline}.\n\nBest regards,\nPFE Administration",
          variables: ["teacherName", "academicYear", "deadline"],
        },
        reminder: {
          id: formData.templates.reminder.id,
          name: "Reminder",
          subject: "Reminder: PFE Proposals Due Soon",
          body: "Dear {teacherName},\n\nThis is a reminder that the project proposal period will close on {deadline}. You have {daysLeft} days left to submit your proposals.\n\nBest regards,\nPFE Administration",
          variables: ["teacherName", "deadline", "daysLeft"],
        },
        closing: {
          id: formData.templates.closing.id,
          name: "Final Notice",
          subject: "Final Call: PFE Project Proposals",
          body: "Dear {teacherName},\n\nThe project proposal period will close today at {time}. Please ensure all your proposals are submitted before the deadline.\n\nBest regards,\nPFE Administration",
          variables: ["teacherName", "time"],
        },
      },
    });
  };

  return (
    <div className="h-full">
      <form className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {id ? t.emailConfig.editPeriod : t.emailConfig.newPeriod}
            </h2>
            <button
              type="button"
              onClick={handleFillTestData}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {t.emailConfig.fillTestData}
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/emails")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label={t.emailConfig.periodName}
                value={formData.name}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.emailConfig.targetAudience}
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 [&>option]:dark:bg-gray-800"
                  value={formData.targetAudience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetAudience: e.target.value as any,
                    })
                  }
                >
                  <option value="teachers">{t.emailConfig.teachers}</option>
                  <option value="students">{t.emailConfig.students}</option>
                  <option value="companies">{t.emailConfig.companies}</option>
                  <option value="all">{t.emailConfig.allUsers}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <Input
                type="date"
                label={t.emailConfig.startDate}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 [&::-webkit-calendar-picker-indicator]:dark:invert"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t.emailConfig.reminders}
                </label>
                <div className="flex gap-3 flex-wrap -mt-2">
                  {" "}
                  {/* Increased negative margin */}
                  {formData.reminderDates.map((date, index) => (
                    <div key={index} className="flex items-center gap-1 -mt-1">
                      {" "}
                      {/* Added negative margin to individual items */}
                      <Input
                        type="date"
                        value={date}
                        className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 [&::-webkit-calendar-picker-indicator]:dark:invert w-[200px]"
                        // Match the height of other date inputs
                        inputClassName="h-10 py-2" // Adjusted padding
                        onChange={(e) => {
                          const newDates = [...formData.reminderDates];
                          newDates[index] = e.target.value;
                          setFormData({ ...formData, reminderDates: newDates });
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 text-gray-500 -ml-1"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData({
                            ...formData,
                            reminderDates: formData.reminderDates.filter(
                              (_, i) => i !== index
                            ),
                          });
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button" // Add this to prevent form submission
                    variant="outline"
                    size="sm"
                    className="dark:border-gray-600 dark:text-gray-300 hover:dark:text-gray-100 h-10"
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default button behavior
                      setFormData({
                        ...formData,
                        reminderDates: [...formData.reminderDates, ""],
                      });
                    }}
                    disabled={formData.reminderDates.length >= 5}
                  >
                    {formData.reminderDates.length >= 5
                      ? t.emailConfig.maxReminders
                      : t.emailConfig.addReminder}
                  </Button>
                </div>
              </div>
              <Input
                type="date"
                label={t.emailConfig.closingDate}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 [&::-webkit-calendar-picker-indicator]:dark:invert"
                value={formData.closingDate}
                onChange={(e) =>
                  setFormData({ ...formData, closingDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {t.emailConfig.emailTemplates}
              </h3>
              <div className="grid gap-8">
                {Object.entries(formData.templates).map(([key, template]) => (
                  <TemplateEditor
                    key={key}
                    type={key as keyof typeof formData.templates}
                    template={template}
                    onChange={(updated) => {
                      setFormData({
                        ...formData,
                        templates: {
                          ...formData.templates,
                          [key]: updated,
                        },
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/emails")}
            >
              {t.emailConfig.cancel}
            </Button>
            <Button onClick={handleSave}>{t.emailConfig.saveChanges}</Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function TemplateEditor({
  type,
  template,
  onChange,
}: {
  type: string;
  template: EmailTemplate;
  onChange: (template: EmailTemplate) => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 capitalize">
        {type} Email
      </h4>
      <div className="space-y-4">
        <Input
          label={t.emailConfig.subject}
          value={template.subject}
          className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
          onChange={(e) => onChange({ ...template, subject: e.target.value })}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.emailConfig.templateBody}
          </label>
          <textarea
            className="w-full h-40 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
            value={template.body}
            onChange={(e) => onChange({ ...template, body: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {t.emailConfig.availableVariables}
          </label>
          <div className="flex gap-2 flex-wrap">
            {template.variables.map((variable) => (
              <span
                key={variable}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300"
              >
                {`{${variable}}`}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailPeriodConfigPage;
