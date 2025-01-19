import { useNavigate, useParams } from "react-router-dom";
import { EmailCampaignForm } from "../../../components/admin/email/EmailCampaignForm";

export function EmailCampaignFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/dashboard/email-management");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <EmailCampaignForm
          campaignId={id ? parseInt(id) : undefined}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
}
