import { EmailConfiguration } from "../../components/admin/EmailConfiguration";

export function EmailConfigurationPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Email Configuration</h1>
      <EmailConfiguration />
    </div>
  );
}

// Add default export
export default EmailConfigurationPage;
