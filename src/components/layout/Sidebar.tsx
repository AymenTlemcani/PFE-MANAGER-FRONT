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
  Search,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTranslation } from "../../hooks/useTranslation";

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
    { name: t.navigation.userSearch, icon: Search, path: "/dashboard/search" },
    { name: t.navigation.settings, icon: Settings, path: "/settings" },
  ],
  teacher: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.myProjects, icon: BookOpen, path: "/projects" },
    { name: t.navigation.students, icon: Users, path: "/students" },
    { name: t.navigation.reviews, icon: Clock, path: "/reviews" },
  ],
  student: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.myProject, icon: BookOpen, path: "/project" },
    { name: t.navigation.tasks, icon: Clock, path: "/tasks" },
    { name: t.navigation.documents, icon: BookOpen, path: "/documents" },
  ],
  company: [
    { name: t.navigation.dashboard, icon: LayoutDashboard, path: "/dashboard" },
    { name: t.navigation.projects, icon: Briefcase, path: "/projects" },
    { name: t.navigation.proposals, icon: BookOpen, path: "/proposals" },
    { name: t.navigation.interns, icon: Users, path: "/interns" },
  ],
});

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const { t } = useTranslation();

  if (!user) return null;

  const roleNavigation = getRoleNavigation(t);
  const navigation = roleNavigation[user.role] || [];

  const isActiveRoute = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-6 py-4 hover:bg-gray-50"
          onClick={() => window.location.reload()}
        >
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">PFE Platform</span>
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
                  ? "bg-blue-50 text-blue-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon
                className={`h-5 w-5 ${
                  active ? "text-blue-600" : "text-gray-400"
                }`}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
