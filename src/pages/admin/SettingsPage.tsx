import { useState } from "react";
import { Tabs } from "../../components/ui/Tabs";
import { EmailSettings } from "../../components/admin/settings/EmailSettings";
import { PeriodSettings } from "../../components/admin/settings/PeriodSettings";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("email");

  const tabs = [
    { id: "email", label: "Email Configuration" },
    { id: "periods", label: "Period Settings" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === "email" && <EmailSettings />}
        {activeTab === "periods" && <PeriodSettings />}
      </div>
    </div>
  );
}
