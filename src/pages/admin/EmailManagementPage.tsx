import { useState } from "react";
import { Tabs } from "../../components/ui/Tabs";
import { Mail, FileText } from "lucide-react"; // Changed Template to FileText
import { useTranslation } from "../../hooks/useTranslation";
import { EmailTemplatesSection } from "../../components/admin/email/EmailTemplatesSection";
import { EmailCampaignSection } from "../../components/admin/email/EmailCampaignSection";

export function EmailManagementPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "templates">(
    "campaigns"
  );
  const { t } = useTranslation();

  const handleAddTemplate = () => {
    // Will implement this later when creating the add template form
    console.log("Add template clicked");
  };

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
              <EmailCampaignSection />
            </div>
          </Tabs.Content>

          <Tabs.Content value="templates">
            <div className="mt-6">
              <EmailTemplatesSection onAddTemplate={handleAddTemplate} />
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </div>
  );
}
