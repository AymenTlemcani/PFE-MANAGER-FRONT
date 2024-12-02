import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { useAuthStore } from "./store/authStore";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { EmailConfigurationPage } from "./pages/admin/EmailConfigurationPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { PFESubmissionForm } from "./pages/projects/PFESubmissionForm";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard/users" element={<UserManagementPage />} />
          <Route
            path="/dashboard/emails"
            element={<EmailConfigurationPage />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<PFESubmissionForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
