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
import type { User } from "../../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();

  if (!user) return null;

  const getRoleNavigation = () => {
    switch (user.role) {
      case "Administrator": // Changed back to "Administrator"
        return [
          {
            name: t.navigation.dashboard,
            icon: LayoutDashboard,
            path: "/dashboard",
          },
          {
            name: t.navigation.userManagement,
            icon: Users,
            path: "/dashboard/users", // Make sure this matches App.tsx route
          },
          {
            name: t.navigation.emailConfiguration,
            icon: Mail,
            path: "/dashboard/emails",
          },
          { name: t.navigation.settings, icon: Settings, path: "/settings" },
        ];
      case "Teacher":
        return [
          {
            name: t.navigation.dashboard,
            icon: LayoutDashboard,
            path: "/dashboard",
          },
          { name: t.navigation.myProjects, icon: BookOpen, path: "/projects" },
          { name: t.navigation.students, icon: Users, path: "/students" },
          ...(user.teacher.is_responsible
            ? [
                {
                  name: t.navigation.projectValidation,
                  icon: CheckSquare,
                  path: "/projects/validation",
                },
              ]
            : []),
        ];
      case "Student":
        return [
          {
            name: t.navigation.dashboard,
            icon: LayoutDashboard,
            path: "/dashboard",
          },
          { name: t.navigation.myProject, icon: BookOpen, path: "/project" },
          { name: t.navigation.tasks, icon: Clock, path: "/tasks" },
          { name: t.navigation.documents, icon: FileText, path: "/documents" },
        ];
      case "Company":
        return [
          {
            name: t.navigation.dashboard,
            icon: LayoutDashboard,
            path: "/dashboard",
          },
          { name: t.navigation.projects, icon: Briefcase, path: "/projects" },
          { name: t.navigation.proposals, icon: BookOpen, path: "/proposals" },
          { name: t.navigation.interns, icon: Users, path: "/interns" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getRoleNavigation();

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
            {menuItems.map((item) => {
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
