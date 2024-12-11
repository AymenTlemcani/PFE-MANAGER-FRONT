import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  Mail,
  GraduationCap,
  Clock,
  Briefcase,
  FileText,
  CheckSquare,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "../../hooks/useTranslation";
import { Translation } from "../../i18n/types";

const getRoleNavigation = (t: Translation) => ({
  admin: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    {
      name: t.navigation.userManagement,
      icon: Users,
      path: "/dashboard/users",
    },
    {
      name: t.navigation.emailConfiguration,
      icon: Mail,
      path: "/dashboard/emails",
    },
    { name: t.navigation.settings, icon: Settings, path: "/settings" },
  ],
  teacher: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.myProjects, icon: BookOpen, path: "/projects" },
    { name: t.navigation.myStudents, icon: Users, path: "/students" },
  ],
  student: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.myProject, icon: BookOpen, path: "/project" }, // Update this path
    { name: t.navigation.tasks, icon: Clock, path: "/tasks" },
    { name: t.navigation.documents, icon: FileText, path: "/documents" },
  ],
  company: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.projects, icon: Briefcase, path: "/projects" },
    { name: t.navigation.proposals, icon: BookOpen, path: "/proposals" },
    { name: t.navigation.interns, icon: Users, path: "/interns" },
  ],
});

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const { t } = useTranslation();

  if (!user) return null;

  const roleNavigation = getRoleNavigation(t);
  const navigation = [...(roleNavigation[user.role] || [])];

  // Add validation section for responsible teachers
  if (user.role === "teacher" && (user as Teacher).isResponsible) {
    navigation.push({
      name: t.navigation.projectValidation,
      icon: CheckSquare,
      path: "/projects/validation",
    });
  }

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    // Special case for /projects path to avoid matching with /projects/validation
    if (path === "/projects") {
      return (
        location.pathname === path || location.pathname === "/projects/new"
      );
    }
    // For other paths, use startsWith
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              PFE Platform
            </span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActiveRoute(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-100 shadow-sm"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
