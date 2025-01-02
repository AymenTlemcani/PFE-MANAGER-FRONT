import { useAuthStore } from "../../store/authStore";
import { useEffect } from "react";

export function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    console.log("📊 Dashboard mounted, user:", user);
  }, [user]);

  if (!user) {
    console.log("⚠️ Dashboard: No user found");
    return (
      <div className="p-4">
        <p className="text-red-500">Loading user data...</p>
      </div>
    );
  }

  console.log("🎯 Rendering dashboard for:", user);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to your Dashboard
        </h1>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h2 className="font-semibold text-blue-700 dark:text-blue-300">
              User Information
            </h2>
            <pre className="mt-2 text-sm text-gray-600 dark:text-gray-300 overflow-auto">
              {JSON.stringify(
                {
                  id: user.id,
                  role: user.role,
                  email: user.email,
                  name: `${user.firstName || "N/A"} ${user.lastName || "N/A"}`,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
