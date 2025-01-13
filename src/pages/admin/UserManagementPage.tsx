import React, { useEffect } from "react";
import { UserManagement } from "../../components/admin/UserManagement";
import { UserFormPage } from "./UserFormPage";
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";

interface UserManagementPageProps {
  showForm?: boolean;
}

export function UserManagementPage({ showForm }: UserManagementPageProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const isFormVisible =
    showForm ||
    location.pathname.includes("/new") ||
    location.pathname.includes("/edit");

  useEffect(() => {
    if (!user) {
      return;
    }

    if (user.role !== "Administrator") {
      navigate("/dashboard");
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user.role !== "Administrator") {
    return null; // Component will unmount and redirect via useEffect
  }

  if (isFormVisible) {
    return <UserFormPage />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <UserManagement />
    </div>
  );
}

export default UserManagementPage;
