import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ArrowLeft } from "lucide-react";
import type { EmailPeriod, EmailTemplate } from "../../types/email";

function EmailPeriodConfigPage() {
  const navigate = useNavigate();
  const { id } = useParams();
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard/emails")} // Fix path here
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {id ? "Edit Email Period" : "New Email Period"}
          </h1>
          <Button variant="outline" size="sm" onClick={handleFillTestData}>
            Fill Test Data
          </Button>
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Period Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Target Audience
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                value={formData.targetAudience}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAudience: e.target.value as any,
                  })
                }
              >
                <option value="teachers">Teachers</option>
                <option value="students">Students</option>
                <option value="companies">Companies</option>
                <option value="all">All Users</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Input
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reminder Dates
              </label>
              <div className="flex gap-2 flex-wrap">
                {formData.reminderDates.map((date, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => {
                        const newDates = [...formData.reminderDates];
                        newDates[index] = e.target.value;
                        setFormData({ ...formData, reminderDates: newDates });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
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
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      reminderDates: [...formData.reminderDates, ""],
                    });
                  }}
                >
                  Add Reminder
                </Button>
              </div>
            </div>
            <Input
              type="date"
              label="Closing Date"
              value={formData.closingDate}
              onChange={(e) =>
                setFormData({ ...formData, closingDate: e.target.value })
              }
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Email Templates
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
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
      <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4 capitalize">
        {type} Email
      </h4>
      <div className="space-y-4">
        <Input
          label="Subject"
          value={template.subject}
          onChange={(e) => onChange({ ...template, subject: e.target.value })}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Template Body
          </label>
          <textarea
            className="w-full h-40 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-sm text-gray-900 dark:text-gray-100"
            value={template.body}
            onChange={(e) => onChange({ ...template, body: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Available Variables
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
