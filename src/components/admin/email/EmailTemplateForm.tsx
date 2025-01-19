import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { emailApi } from "../../../api/emailApi";
import { useSnackbar } from "../../../hooks/useSnackbar";
import type { EmailTemplate } from "../../../types/email";

interface EmailTemplateFormProps {
  onClose: () => void;
  onSuccess: () => void;
  template?: EmailTemplate; // For editing existing template
}

export function EmailTemplateForm({
  onClose,
  onSuccess,
  template,
}: EmailTemplateFormProps) {
  const { showSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => ({
    name: template?.name || "",
    subject: template?.subject || "",
    content: template?.content || "",
    description: template?.description || "",
    type: template?.type || "Notification",
    language: template?.language || "French",
    is_active: template?.is_active ?? true,
    placeholders: template?.placeholders || [],
  }));

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Template name is required";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject line is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Email content is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const formattedData = {
        ...formData,
        placeholders: Array.isArray(formData.placeholders)
          ? formData.placeholders
          : formData.content
              .match(/\{([^}]+)\}/g)
              ?.map((p) => p.replace(/[{}]/g, "")) || [],
      };

      console.log("📤 Submitting template data:", {
        ...formattedData,
        id: template?.template_id,
        isUpdate: !!template,
      });

      let response;
      if (template?.template_id) {
        response = await emailApi.updateTemplate(
          template.template_id,
          formattedData
        );
        console.log("✅ Template updated:", response);
        showSnackbar("Template updated successfully", "success");
      } else {
        response = await emailApi.createTemplate(formattedData);
        console.log("✅ Template created:", response);
        showSnackbar("Template created successfully", "success");
      }

      onSuccess();
    } catch (error: any) {
      console.error("❌ Template submission failed:", error);

      const errorMessage = error.validationErrors
        ? Object.values(error.validationErrors).flat().join(", ")
        : error.message || "Failed to save template";

      showSnackbar(errorMessage, "error");

      if (error.validationErrors) {
        setErrors(error.validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const testTemplates = [
    {
      name: "Welcome Email",
      subject: "Welcome to PFE Manager Platform",
      content: `Dear {name},

Welcome to the PFE Manager platform! We're excited to have you join us.

Your account has been successfully created. Here are your login details:
Email: {email}
Password: {password}

Please change your password upon your first login for security purposes.

Best regards,
PFE Manager Team`,
      description: "Sent to new users when their account is created",
      type: "System",
      language: "English",
      is_active: true,
      placeholders: ["name", "email", "password"],
    },
    {
      name: "Project Submission Deadline Reminder",
      subject: "Reminder: PFE Project Submission Deadline Approaching",
      content: `Dear {name},

This is a reminder that the deadline for submitting your PFE project is approaching. The submission deadline is {deadline}.

Please ensure that you have:
- Completed your project documentation
- Reviewed all requirements
- Prepared necessary attachments

If you have any questions, please don't hesitate to contact your supervisor.

Best regards,
PFE Manager Team`,
      description: "Automated reminder for project submission deadlines",
      type: "Reminder",
      language: "English",
      is_active: true,
      placeholders: ["name", "deadline"],
    },
    {
      name: "Validation de Projet",
      subject: "Votre projet PFE a été validé",
      content: `Cher/Chère {name},

Nous avons le plaisir de vous informer que votre projet PFE intitulé "{project_title}" a été validé.

Détails du projet :
- Titre : {project_title}
- Superviseur : {supervisor_name}
- Date de validation : {validation_date}

Vous pouvez maintenant procéder aux prochaines étapes de votre projet.

Cordialement,
L'équipe PFE Manager`,
      description: "Notification envoyée lors de la validation d'un projet",
      type: "Notification",
      language: "French",
      is_active: true,
      placeholders: [
        "name",
        "project_title",
        "supervisor_name",
        "validation_date",
      ],
    },
  ];

  const fillTestData = () => {
    const randomTemplate =
      testTemplates[Math.floor(Math.random() * testTemplates.length)];
    setFormData({ ...randomTemplate });
  };

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {template ? "Edit Email Template" : "New Email Template"}
          </h2>
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
          >
            Fill Test Data
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="px-8 py-6 space-y-8">
        <div className="space-y-4">
          <Input
            label="Template Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            required
          />

          <Input
            label="Subject Line"
            name="subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            error={errors.subject}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Template Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as EmailTemplate["type"],
                  })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              >
                <option value="System">System</option>
                <option value="Notification">Notification</option>
                <option value="Reminder">Reminder</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    language: e.target.value as EmailTemplate["language"],
                  })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              >
                <option value="French">French</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={10}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
              required
            />
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.content}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="is_active"
              className="text-sm text-gray-700 dark:text-gray-200"
            >
              Template is active
            </label>
          </div>
        </div>
      </form>

      {/* Fixed Footer */}
      <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                {template ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{template ? "Update Template" : "Create Template"}</>
            )}
          </Button>
        </div>
      </div>
    </>
  );
}
