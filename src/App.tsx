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
import { ProjectValidationPage } from "./pages/projects/ProjectValidationPage";
import { useThemeStore } from "./store/themeStore";
import { CompanyPFEForm } from "./pages/projects/CompanyPFEForm"; // Add this import
import { SettingsPage } from "./pages/admin/SettingsPage"; // Add this import at the top
import { StudentsPage } from "./pages/teachers/StudentsPage"; // Update this import path

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
  const isDark = useThemeStore((state) => state.isDark);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

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
              <Route path="settings" element={<SettingsPage />} />{" "}
              {/* Add this line */}
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
              <Route path="projects">
                <Route index element={<ProjectsPage />} />
                <Route
                  path="new"
                  element={
                    <ProtectedRoute>
                      {user?.role === "student" ? (
                        <StudentPFEForm />
                      ) : user?.role === "company" ? (
                        <CompanyPFEForm />
                      ) : (
                        <TeacherPFEForm />
                      )}
                    </ProtectedRoute>
                  }
                />
                <Route path="company">
                  <Route
                    path="new"
                    element={
                      <ProtectedRoute>
                        <CompanyPFEForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <ProtectedRoute>
                        <CompanyPFEForm />
                      </ProtectedRoute>
                    }
                  />
                </Route>
                <Route path="validation" element={<ProjectValidationPage />} />
              </Route>
              <Route
                path="students"
                element={
                  <ProtectedRoute>
                    {user?.role === "teacher" ? (
                      <StudentsPage />
                    ) : (
                      <Navigate to="/dashboard" replace />
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
