import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { EmailTemplateForm } from "../../../components/admin/email/EmailTemplateForm";

export function EmailTemplateFormPage() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/dashboard/email-management");
  };

  const handleSuccess = () => {
    navigate("/dashboard/email-management");
  };

  return (
    <div className="h-full">
      <div className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <EmailTemplateForm onClose={handleClose} onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
