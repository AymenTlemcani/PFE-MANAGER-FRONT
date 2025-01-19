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
import { ProjectProvider } from "./context/ProjectContext"; // Update this import
import EmailPeriodConfigPage from "./pages/admin/EmailPeriodConfigPage";
import { ProjectValidationPage } from "./pages/projects/ProjectValidationPage";
import { useThemeStore } from "./store/themeStore";
import { CompanyPFEForm } from "./pages/projects/CompanyPFEForm";
import { SettingsPage } from "./pages/admin/SettingsPage";
import { StudentsPage } from "./pages/teachers/StudentsPage";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { UserFormPage } from "./pages/admin/UserFormPage";
import { AllUsersPage } from "./pages/admin/AllUsersPage";
import { SnackbarManager } from "./components/ui/SnackbarManager";
import { useSnackbarStore } from "./hooks/useSnackbar";
import { EmailManagementPage } from "./pages/admin/EmailManagementPage";
import { EmailTemplateFormPage } from "./pages/admin/email/EmailTemplateFormPage";
import { EmailCampaignFormPage } from "./pages/admin/email/EmailCampaignFormPage";

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

// Add this new component for admin route protection
function AdminRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AdminRoute - User role:", user?.role);
    if (!user) {
      console.log("AdminRoute - No user found");
      navigate("/login");
      return;
    }
    if (user.role !== "Administrator") {
      // Changed back to "Administrator"
      console.log("AdminRoute - Access denied, redirecting:", user.role);
      navigate("/dashboard");
      return;
    }
    console.log("AdminRoute - Access granted for Administrator");
  }, [user, navigate]);

  return user?.role === "Administrator" ? <>{children}</> : null; // Changed here too
}

function App() {
  const user = useAuthStore((state) => state.user);
  const isDark = useThemeStore((state) => state.isDark);
  const { messages, removeMessage } = useSnackbarStore();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <AuthProvider>
      <BrowserRouter
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ProjectProvider>
          {" "}
          {/* Changed from ProjectProvider to match the export */}
          <NotificationsProvider>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
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
                <Route path="dashboard/users">
                  <Route
                    index
                    element={
                      <AdminRoute>
                        <UserManagementPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="all"
                    element={
                      <AdminRoute>
                        <AllUsersPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="new"
                    element={
                      <AdminRoute>
                        <UserManagementPage showForm={true} />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="edit/:id"
                    element={
                      <AdminRoute>
                        <UserManagementPage showForm={true} />
                      </AdminRoute>
                    }
                  />
                </Route>
                <Route path="settings" element={<SettingsPage />} />
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
                        {user?.role === "Student" ? (
                          <StudentPFEForm />
                        ) : user?.role === "Company" ? (
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
                  <Route
                    path="validation"
                    element={<ProjectValidationPage />}
                  />
                </Route>
                <Route
                  path="students"
                  element={
                    <ProtectedRoute>
                      {user?.role === "Teacher" ? (
                        <StudentsPage />
                      ) : (
                        <Navigate to="/dashboard" replace />
                      )}
                    </ProtectedRoute>
                  }
                />
                <Route path="project" element={<StudentProjectPage />} />
                <Route path="/admin/users/new" element={<UserFormPage />} />
                <Route
                  path="/admin/users/edit/:id"
                  element={<UserFormPage />}
                />
                <Route
                  path="/admin/users/all"
                  element={
                    <AdminRoute>
                      <AllUsersPage />
                    </AdminRoute>
                  }
                />
                <Route path="dashboard/email-management">
                  <Route
                    index
                    element={
                      <AdminRoute>
                        <EmailManagementPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="templates/new"
                    element={
                      <AdminRoute>
                        <EmailTemplateFormPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="templates/edit/:id"
                    element={
                      <AdminRoute>
                        <EmailTemplateFormPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="campaigns/new"
                    element={
                      <AdminRoute>
                        <EmailCampaignFormPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="campaigns/edit/:id"
                    element={
                      <AdminRoute>
                        <EmailCampaignFormPage />
                      </AdminRoute>
                    }
                  />
                </Route>
              </Route>
            </Routes>
            <SnackbarManager
              snackbars={messages.map((msg) => ({
                id: msg.id.toString(),
                message: msg.message,
                type: msg.type,
              }))}
              onClose={removeMessage}
            />
          </NotificationsProvider>
        </ProjectProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
