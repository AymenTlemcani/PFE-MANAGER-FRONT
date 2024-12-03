import { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { EmailPeriod, EmailTemplate } from "../../types/email";

export function EmailPeriodModal({
  period,
  onClose,
  onSave,
}: {
  period: EmailPeriod;
  onClose: () => void;
  onSave: (period: EmailPeriod) => void;
}) {
  const [formData, setFormData] = useState(period);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Configure Email Period
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Period Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-2"
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

          <div className="grid grid-cols-3 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
            {/* Add dynamic reminder dates */}
            <Input
              type="date"
              label="Closing Date"
              value={formData.closingDate}
              onChange={(e) =>
                setFormData({ ...formData, closingDate: e.target.value })
              }
            />
          </div>

          {/* Template sections */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">
              Email Templates
            </h4>
            <div className="grid gap-6">
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

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>Save Configuration</Button>
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
    <div className="border rounded-md p-4">
      <h5 className="text-sm font-medium text-gray-900 mb-4 capitalize">
        {type} Email
      </h5>
      <div className="space-y-4">
        <Input
          label="Subject"
          value={template.subject}
          onChange={(e) => onChange({ ...template, subject: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Body
          </label>
          <textarea
            className="w-full h-32 rounded-md border border-gray-300 px-3 py-2"
            value={template.body}
            onChange={(e) => onChange({ ...template, body: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Available Variables
          </label>
          <div className="flex gap-2 flex-wrap">
            {template.variables.map((variable) => (
              <span
                key={variable}
                className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600"
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
