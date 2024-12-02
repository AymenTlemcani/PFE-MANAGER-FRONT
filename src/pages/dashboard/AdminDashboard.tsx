import { Users, BookOpen, Calendar, Settings } from "lucide-react";

export function AdminDashboard() {
  const stats = [
    { label: "Total Students", value: "150", icon: Users },
    { label: "Active Projects", value: "45", icon: BookOpen },
    { label: "Upcoming Defenses", value: "12", icon: Calendar },
    { label: "Pending Approvals", value: "8", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
