import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Search,
  Filter,
  Loader,
  PlayCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Info,
  Users,
  Calendar,
  Mail,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Dialog } from "../../../components/ui/Dialog";
import { emailApi } from "../../../api/emailApi";
import { EmailCampaign } from "../../../types/email";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "../../../hooks/useSnackbar";

export function EmailCampaignSection() {
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] =
    useState<EmailCampaign | null>(null);
  const [isActivateDialogOpen, setIsActivateDialogOpen] = useState(false);

  const fetchCampaigns = async () => {
    try {
      setIsLoading(true);
      const data = await emailApi.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      showSnackbar("Failed to fetch campaigns", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchCampaigns();
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || campaign.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleActivate = async (campaign: EmailCampaign) => {
    try {
      await emailApi.activateCampaign(campaign.campaign_id);
      showSnackbar("Campaign activated successfully", "success");
      fetchCampaigns();
    } catch (error: any) {
      showSnackbar(
        error.response?.data?.message || "Failed to activate campaign",
        "error"
      );
    }
    setIsActivateDialogOpen(false);
    setSelectedCampaign(null);
  };

  const getUpcomingReminder = (campaign: EmailCampaign) => {
    if (!campaign.reminder_schedules?.length) return null;
    return campaign.reminder_schedules.reduce((nearest, current) => {
      if (!nearest) return current;
      return new Date(current.date) < new Date(nearest.date)
        ? current
        : nearest;
    }, null);
  };

  const statusOptions = ["all", "Draft", "Active", "Completed", "Cancelled"];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    try {
      // Extract time from full datetime string or use as is if it's just time
      const time = timeString.includes("T")
        ? timeString.split("T")[1].substring(0, 5)
        : timeString.substring(0, 5);

      return new Date(`2000-01-01T${time}`).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return timeString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Email Campaigns
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and monitor your email campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button
            onClick={() =>
              navigate("/dashboard/email-management/campaigns/new")
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? status === "all"
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    : getStatusBadgeStyle(status)
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.campaign_id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Campaign Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {campaign.name}
                </h3>
                <Badge className={getStatusBadgeStyle(campaign.status)}>
                  {campaign.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {campaign.type} • {campaign.target_audience}
              </p>
            </div>

            {/* Campaign Details */}
            <div className="p-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Calendar className="h-4 w-4 mr-2" />
                <span>
                  {formatDate(campaign.start_date)} -{" "}
                  {formatDate(campaign.end_date)}
                </span>
              </div>

              {/* Reminder Schedule */}
              {campaign.reminder_schedules?.length > 0 && (
                <div className="pt-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Reminder Schedule
                  </h4>
                  <div className="space-y-2">
                    {campaign.reminder_schedules.map((reminder, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-300"
                      >
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <div className="flex items-center gap-1">
                          <span className="font-medium">
                            {reminder.days_before_deadline}
                          </span>
                          <span className="text-gray-500">
                            {reminder.days_before_deadline === 1
                              ? "day"
                              : "days"}{" "}
                            before
                          </span>
                          <span className="text-gray-400 mx-1">•</span>
                          <span className="text-gray-500">
                            {formatTime(reminder.send_time)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campaign Actions */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/dashboard/email-management/campaigns/${campaign.campaign_id}`
                    )
                  }
                >
                  Details
                </Button>
                {campaign.status === "Draft" && (
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setIsActivateDialogOpen(true);
                    }}
                  >
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activate Campaign Dialog */}
      <Dialog
        isOpen={isActivateDialogOpen}
        onClose={() => setIsActivateDialogOpen(false)}
        className="max-w-md w-full"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <PlayCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Activate Campaign
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to activate this campaign?
              </p>
            </div>
          </div>

          {selectedCampaign && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Campaign Name
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedCampaign.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Target Audience
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedCampaign.target_audience}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <p className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              This will immediately start sending emails to the target audience.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsActivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedCampaign && handleActivate(selectedCampaign)
              }
            >
              Activate Campaign
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
