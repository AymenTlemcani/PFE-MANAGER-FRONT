import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { LoginPage } from "./pages/auth/LoginPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { useAuthStore } from "./store/authStore";
import { UserManagementPage } from "./pages/admin/UserManagementPage";
import { EmailConfigurationPage } from "./pages/admin/EmailConfigurationPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { StudentProjectPage } from "./pages/projects/StudentProjectPage";
import { NotificationsProvider } from "./context/NotificationsContext";
import { TeacherPFEForm } from "./pages/projects/TeacherPFEForm";
import { StudentPFEForm } from "./pages/projects/StudentPFEForm";
import { ProjectProvider } from "./context/ProjectProvider";
import EmailPeriodConfigPage from "./pages/admin/EmailPeriodConfigPage";
import { useAuth } from "./context/AuthContext"; // Add this import

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  return user ? <>{children}</> : null;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <BrowserRouter>
      <ProjectProvider>
        <NotificationsProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="dashboard/users" element={<UserManagementPage />} />
              <Route
                path="dashboard/emails"
                element={<EmailConfigurationPage />}
              />
              <Route
                path="dashboard/emails/new"
                element={<EmailPeriodConfigPage />}
              />
              <Route
                path="dashboard/emails/:id"
                element={<EmailPeriodConfigPage />}
              />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route
                path="projects/new"
                element={
                  <ProtectedRoute>
                    {user?.role === "student" ? (
                      <StudentPFEForm />
                    ) : (
                      <TeacherPFEForm />
                    )}
                  </ProtectedRoute>
                }
              />
              <Route path="project" element={<StudentProjectPage />} />
            </Route>
          </Routes>
        </NotificationsProvider>
      </ProjectProvider>
    </BrowserRouter>
  );
}

export default App;
