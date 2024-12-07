import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  Mail,
  Building,
  Upload,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/Button";

export function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: "150", icon: Users },
    { label: "Active Projects", value: "45", icon: BookOpen },
    { label: "Pending Proposals", value: "23", icon: Clock },
    { label: "Companies", value: "15", icon: Building },
    { label: "Teachers", value: "32", icon: Users },
    { label: "Scheduled Defenses", value: "18", icon: Calendar },
    { label: "Email Campaigns", value: "5", icon: Mail },
    { label: "Pending Approvals", value: "8", icon: Settings },
  ];

  const quickActions = [
    { label: "Import Users", icon: Upload, action: () => {} },
    { label: "Schedule Emails", icon: Mail, action: () => {} },
    { label: "Manage Deadlines", icon: Clock, action: () => {} },
    { label: "Plan Defenses", icon: Calendar, action: () => {} },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {/* <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1> */}
        <div className="flex gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                onClick={action.action}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Process Timeline</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Project Proposals</span>
              <span className="text-green-600 dark:text-green-400">Active</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Teacher Assignments</span>
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Student Selections</span>
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Defense Planning</span>
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Email Campaigns</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Project Proposal Reminder</span>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Teacher Assignment Notice</span>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Defense Schedule Notice</span>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded">
              <span className="dark:text-gray-200">Deadline Reminders</span>
              <Button size="sm" variant="outline">
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
