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
  LucideIcon,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "../../hooks/useTranslation";
import { Translation } from "../../i18n/types";

interface NavigationItem {
  name: string;
  icon: LucideIcon;
  path: string;
}

type UserRole = "Administrator" | "Teacher" | "Student" | "Company";

// Update getRoleNavigation to use Record type with UserRole
const getRoleNavigation = (
  t: Translation
): Record<UserRole, NavigationItem[]> => ({
  Administrator: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    {
      name: t.navigation.userManagement,
      icon: Users,
      path: "/dashboard/users",
    },
    {
      name: t.navigation.emailManagement,
      icon: Mail,
      path: "/dashboard/email-management",
    },
    {
      name: t.navigation.emailConfiguration,
      icon: Mail,
      path: "/dashboard/emails",
    },
    { name: t.navigation.settings, icon: Settings, path: "/settings" },
  ],
  Teacher: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.myProjects, icon: BookOpen, path: "/projects" },
    { name: t.navigation.students, icon: Users, path: "/students" },
  ],
  Student: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.myProject, icon: BookOpen, path: "/project" }, // Update this path
    { name: t.navigation.tasks, icon: Clock, path: "/tasks" },
    { name: t.navigation.documents, icon: FileText, path: "/documents" },
  ],
  Company: [
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
  const navigation: NavigationItem[] = [...(roleNavigation[user.role] || [])];

  // Fix: Check isResponsible from the nested teacher object
  if (user.role === "Teacher" && user.teacher?.is_responsible) {
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
    if (path === "/projects") {
      return (
        location.pathname === path || location.pathname === "/projects/new"
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
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

        <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                    active
                      ? "bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-100 shadow-sm"
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
        </div>
      </aside>
    </>
  );
}
