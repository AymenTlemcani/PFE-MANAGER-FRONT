import { useState } from "react";
import { Tabs } from "../../components/ui/Tabs";
import { Mail, FileText } from "lucide-react"; // Changed Template to FileText
import { useTranslation } from "../../hooks/useTranslation";

export function EmailManagementPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "templates">(
    "campaigns"
  );
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.emailManagement.title}
        </h1>
      </div>

      <div className="relative">
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        >
          <Tabs.List>
            <Tabs.Trigger value="campaigns">
              <Mail className="h-4 w-4 mr-2" />
              {t.emailManagement.campaigns}
            </Tabs.Trigger>
            <Tabs.Trigger value="templates">
              <FileText className="h-4 w-4 mr-2" /> {/* Changed to FileText */}
              {t.emailManagement.templates}
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="campaigns">
            <div className="mt-6">
              <h2>Email Campaigns Content</h2>
              {/* Add campaigns content here */}
            </div>
          </Tabs.Content>

          <Tabs.Content value="templates">
            <div className="mt-6">
              <h2>Email Templates Content</h2>
              {/* Add templates content here */}
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
}
