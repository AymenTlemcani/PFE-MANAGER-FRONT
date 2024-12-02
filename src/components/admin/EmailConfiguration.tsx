import { useState } from "react";
import { Mail, Bell, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

interface EmailPeriod {
  id: string;
  name: string;
  sendDate: string;
  reminderDate: string;
  closingDate: string;
  template: string;
}

export function EmailConfiguration() {
  const [periods, setPeriods] = useState<EmailPeriod[]>([
    {
      id: "1",
      name: "Project Proposals",
      sendDate: "2024-03-01",
      reminderDate: "2024-03-15",
      closingDate: "2024-03-30",
      template:
        "Dear {name},\n\nPlease submit your project proposal by {closingDate}...",
    },
    {
      id: "2",
      name: "Defense Scheduling",
      sendDate: "2024-06-01",
      reminderDate: "2024-06-15",
      closingDate: "2024-06-30",
      template: "Dear {name},\n\nThe defense scheduling period is now open...",
    },
  ]);

  const [editingPeriod, setEditingPeriod] = useState<EmailPeriod | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Email Configuration
        </h2>
        <Button
          onClick={() => {
            setEditingPeriod({
              id: String(Date.now()),
              name: "",
              sendDate: "",
              reminderDate: "",
              closingDate: "",
              template: "",
            });
          }}
          className="flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          Add Email Period
        </Button>
      </div>

      <div className="grid gap-6">
        {periods.map((period) => (
          <EmailPeriodCard
            key={period.id}
            period={period}
            onEdit={() => setEditingPeriod(period)}
          />
        ))}
      </div>

      {editingPeriod && (
        <EmailPeriodModal
          period={editingPeriod}
          onClose={() => setEditingPeriod(null)}
          onSave={(updatedPeriod) => {
            setPeriods((prev) =>
              prev.map((p) => (p.id === updatedPeriod.id ? updatedPeriod : p))
            );
            setEditingPeriod(null);
          }}
        />
      )}
    </div>
  );
}

function EmailPeriodCard({
  period,
  onEdit,
}: {
  period: EmailPeriod;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{period.name}</h3>
        <Button variant="outline" size="sm" onClick={onEdit}>
          Edit
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">Send Date</p>
            <p className="text-sm text-gray-500">{period.sendDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">Reminder Date</p>
            <p className="text-sm text-gray-500">{period.reminderDate}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">Closing Date</p>
            <p className="text-sm text-gray-500">{period.closingDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailPeriodModal({
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
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {period.id ? "Edit Email Period" : "New Email Period"}
        </h3>

        <div className="space-y-4">
          <Input
            label="Period Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              label="Send Date"
              value={formData.sendDate}
              onChange={(e) =>
                setFormData({ ...formData, sendDate: e.target.value })
              }
            />
            <Input
              type="date"
              label="Reminder Date"
              value={formData.reminderDate}
              onChange={(e) =>
                setFormData({ ...formData, reminderDate: e.target.value })
              }
            />
            <Input
              type="date"
              label="Closing Date"
              value={formData.closingDate}
              onChange={(e) =>
                setFormData({ ...formData, closingDate: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Template
            </label>
            <textarea
              className="w-full h-32 rounded-md border border-gray-300 px-3 py-2"
              value={formData.template}
              onChange={(e) =>
                setFormData({ ...formData, template: e.target.value })
              }
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave(formData)}>Save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
