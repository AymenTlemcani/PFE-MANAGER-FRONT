import { useState, useEffect } from "react";
import { X, Loader, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { emailApi } from "../../../api/emailApi";
import { useSnackbar } from "../../../hooks/useSnackbar";
import type { EmailCampaign, EmailTemplate } from "../../../types/email";

interface EmailCampaignFormProps {
  campaignId?: number;
  onSuccess: () => void;
}

interface ReminderSchedule {
  days_before_deadline: number;
  send_time: string;
}

export function EmailCampaignForm({
  campaignId,
  onSuccess,
}: EmailCampaignFormProps) {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [formData, setFormData] = useState<Partial<EmailCampaign>>({
    name: "",
    type: "Notification",
    target_audience: "Students",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
    status: "Draft",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reminders, setReminders] = useState<ReminderSchedule[]>([
    { days_before_deadline: 1, send_time: "09:00" },
  ]);

  useEffect(() => {
    fetchTemplates();
    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const fetchTemplates = async () => {
    try {
      setIsLoadingTemplates(true);
      const data = await emailApi.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      showSnackbar("Failed to fetch email templates", "error");
    } finally {
      setIsLoadingTemplates(false);
    }
  };

  const fetchCampaign = async () => {
    try {
      const campaign = await emailApi.getCampaign(campaignId);
      setFormData(campaign);
    } catch (error) {
      console.error("Error fetching campaign:", error);
      showSnackbar("Failed to fetch campaign details", "error");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Campaign name is required";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) > new Date(formData.end_date)
    ) {
      newErrors.end_date = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (campaignId) {
        await emailApi.updateCampaign(campaignId, formData);
        showSnackbar("Campaign updated successfully", "success");
      } else {
        await emailApi.createCampaign(formData);
        showSnackbar("Campaign created successfully", "success");
      }
      onSuccess();
    } catch (error: any) {
      console.error("Campaign submission failed:", error);
      showSnackbar(error.message || "Failed to save campaign", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReminder = () => {
    setReminders([
      ...reminders,
      { days_before_deadline: 1, send_time: "09:00" },
    ]);
  };

  const handleRemoveReminder = (index: number) => {
    setReminders(reminders.filter((_, i) => i !== index));
  };

  const handleReminderChange = (
    index: number,
    field: keyof ReminderSchedule,
    value: string | number
  ) => {
    const updatedReminders = [...reminders];
    updatedReminders[index] = {
      ...updatedReminders[index],
      [field]: value,
    };
    setReminders(updatedReminders);
  };

  if (isLoadingTemplates) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header with close button */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {campaignId ? "Edit Email Campaign" : "New Email Campaign"}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => onSuccess()}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="px-8 py-6 space-y-6">
        <Input
          label="Campaign Name"
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Campaign Type
            </label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type: e.target.value as EmailCampaign["type"],
                })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              <option value="Notification">Notification</option>
              <option value="Reminder">Reminder</option>
              <option value="System">System</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Target Audience
            </label>
            <select
              value={formData.target_audience}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  target_audience: e.target
                    .value as EmailCampaign["target_audience"],
                })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              <option value="Students">Students</option>
              <option value="Teachers">Teachers</option>
              <option value="Companies">Companies</option>
              <option value="Administrators">Administrators</option>
              <option value="All">All</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            name="start_date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            error={errors.start_date}
            required
          />

          <Input
            type="date"
            label="End Date"
            name="end_date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            error={errors.end_date}
            required
          />
        </div>

        {/* Template Selection */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Template
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                navigate("/dashboard/email-management/templates/new")
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </div>
          <select
            value={formData.template_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                template_id: parseInt(e.target.value),
              })
            }
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
          >
            <option value="">Select a template</option>
            {templates.map((template) => (
              <option key={template.template_id} value={template.template_id}>
                {template.name} ({template.language})
              </option>
            ))}
          </select>

          {/* Reminder Schedules */}
          <div className="space-y-4 mt-8">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Reminder Schedule
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddReminder}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Reminder
              </Button>
            </div>

            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Days Before
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={reminder.days_before_deadline}
                        onChange={(e) =>
                          handleReminderChange(
                            index,
                            "days_before_deadline",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Send Time
                      </label>
                      <input
                        type="time"
                        value={reminder.send_time}
                        onChange={(e) =>
                          handleReminderChange(
                            index,
                            "send_time",
                            e.target.value
                          )
                        }
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveReminder(index)}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => onSuccess()}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader className="h-4 w-4 mr-2 animate-spin" />
              {campaignId ? "Updating..." : "Creating..."}
            </>
          ) : campaignId ? (
            "Update Campaign"
          ) : (
            "Create Campaign"
          )}
        </Button>
      </div>
    </form>
  );
}
