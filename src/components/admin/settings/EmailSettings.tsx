import { useState } from "react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";
import { Mail } from "lucide-react";

export function EmailSettings() {
  const [emailConfig, setEmailConfig] = useState({
    smtpServer: "",
    port: "",
    username: "",
    password: "",
    fromEmail: "",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement save functionality
  };

  return (
    <div className="h-full">
      <form className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-500" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Email Server Configuration
            </h2>
          </div>
        </div>

        <div className="px-8 py-8 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="SMTP Server"
              value={emailConfig.smtpServer}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              onChange={(e) =>
                setEmailConfig({ ...emailConfig, smtpServer: e.target.value })
              }
            />
            <Input
              label="Port"
              type="number"
              value={emailConfig.port}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              onChange={(e) =>
                setEmailConfig({ ...emailConfig, port: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Input
              label="Username"
              value={emailConfig.username}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              onChange={(e) =>
                setEmailConfig({ ...emailConfig, username: e.target.value })
              }
            />
            <Input
              label="Password"
              type="password"
              value={emailConfig.password}
              className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              onChange={(e) =>
                setEmailConfig({ ...emailConfig, password: e.target.value })
              }
            />
          </div>
          <Input
            label="From Email"
            type="email"
            value={emailConfig.fromEmail}
            className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
            onChange={(e) =>
              setEmailConfig({ ...emailConfig, fromEmail: e.target.value })
            }
          />
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
