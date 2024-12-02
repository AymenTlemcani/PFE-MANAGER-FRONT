import { UserManagement } from "../../components/admin/UserManagement";

export function UserManagementPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
      <UserManagement />
    </div>
  );
}
