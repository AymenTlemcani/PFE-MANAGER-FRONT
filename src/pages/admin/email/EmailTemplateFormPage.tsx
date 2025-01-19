import { useNavigate, useParams, useLocation } from "react-router-dom";
import { EmailTemplateForm } from "../../../components/admin/email/EmailTemplateForm";
import { EmailTemplate } from "../../../types/email";

export function EmailTemplateFormPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const template = state?.template as EmailTemplate | undefined;

  const handleClose = () => {
    navigate("/dashboard/email-management");
  };

  const handleSuccess = () => {
    navigate("/dashboard/email-management");
  };

  return (
    <div className="h-full">
      <div className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        <EmailTemplateForm
          key={template?.template_id || "new"}
          onClose={handleClose}
          onSuccess={handleSuccess}
          template={template}
        />
      </div>
    </div>
  );
}
