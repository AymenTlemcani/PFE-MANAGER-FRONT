import React, { useEffect } from "react";
import { UserManagement } from "../../components/admin/UserManagement";
import { useAuthStore } from "../../store/authStore";

export function UserManagementPage() {
  const user = useAuthStore((state) => state.user);

  console.log("UserManagementPage - Component mounted, user:", user);

  useEffect(() => {
    // Add logging for debugging
    console.log("UserManagementPage - Effect running, current user:", user);
    console.log("Current user role:", user?.role); // Add this line
  }, [user]);

  if (!user) {
    console.log("UserManagementPage - No user found");
    return <div>Loading...</div>;
  }

  if (user.role !== "Administrator") {
    // Changed back to "Administrator"
    console.log("UserManagementPage - Access denied:", user.role);
    return <div>Access denied</div>;
  }

  console.log("UserManagementPage - Rendering component");
  return (
    <div className="container mx-auto px-4 py-6">
      <UserManagement />
    </div>
  );
}

export default UserManagementPage;
