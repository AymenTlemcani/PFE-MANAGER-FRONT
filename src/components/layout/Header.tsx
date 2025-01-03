import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import {
  ChevronDown,
  LogOut,
  User,
  Globe,
  Sun,
  Moon,
  GraduationCap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useThemeStore } from "../../store/themeStore"; // Fixed incorrect path

const languages = [
  { code: "en", label: "English", icon: "GB" },
  { code: "fr", label: "Français", icon: "FR" },
] as const;

interface HeaderProps {
  onMenuChange?: (isOpen: boolean) => void;
}

export function Header({ onMenuChange }: HeaderProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Single effect to handle all click-away behavior
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
        onMenuChange?.(false);
      }
    }

    // Only add listener if menu is open
    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileMenu, onMenuChange]);

  const handleLogout = () => {
    useAuthStore.getState().setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setShowProfileMenu(false);
    navigate("/login");
  };

  // Keep parent component in sync with menu state
  const toggleProfileMenu = () => {
    const newState = !showProfileMenu;
    setShowProfileMenu(newState);
    onMenuChange?.(newState);
  };

  // Handle notification menu changes
  const handleNotificationMenuChange = (isOpen: boolean) => {
    onMenuChange?.(isOpen);
  };

  const getUserDisplayInfo = (user: User) => {
    switch (user.role) {
      case "Administrator":
        return {
          initials: `${user.administrator.name[0]}${user.administrator.surname[0]}`,
          name: `${user.administrator.name} ${user.administrator.surname}`,
        };
      case "Teacher":
        return {
          initials: `${user.teacher.name[0]}${user.teacher.surname[0]}`,
          name: `${user.teacher.name} ${user.teacher.surname}`,
        };
      case "Student":
        return {
          initials: `${user.student.name[0]}${user.student.surname[0]}`,
          name: `${user.student.name} ${user.student.surname}`,
        };
      case "Company":
        return {
          initials: `${user.company.contact_name[0]}${user.company.contact_surname[0]}`,
          name: user.company.company_name,
        };
      default:
        return { initials: "U", name: user.email };
    }
  };

  if (!user) return null;

  const { initials, name } = getUserDisplayInfo(user);

  return (
    <div className="flex items-center justify-between flex-1 h-16 px-4 lg:px-8">
      <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
        PFE PLATFORM
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        <NotificationDropdown onMenuChange={handleNotificationMenuChange} />
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={toggleProfileMenu}
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100">
              {initials}
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">
                {name}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <div className="py-1">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-2">
                    <Globe className="h-4 w-4" />
                    Language
                  </div>
                  <div className="flex gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={`px-2 py-1 text-xs rounded-md transition-colors ${
                          language === lang.code
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
