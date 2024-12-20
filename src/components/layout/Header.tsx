import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { ChevronDown, LogOut, User, Globe, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useThemeStore } from "../../store/themeStore";

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
        onMenuChange?.(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onMenuChange]);

  useEffect(() => {
    onMenuChange?.(showProfileMenu);
  }, [showProfileMenu, onMenuChange]);

  const handleLogout = () => {
    useAuthStore.getState().setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setShowProfileMenu(false);
    navigate("/login");
  };

  const handleShowProfileMenu = (show: boolean) => {
    setShowProfileMenu(show);
    setIsAnyMenuOpen(show);
  };

  const handleNotificationMenuChange = (isOpen: boolean) => {
    setIsAnyMenuOpen(isOpen);
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-between flex-1 h-16 px-4 lg:px-8">
      <div className="text-lg font-semibold text-gray-900 dark:text-white truncate">
        {/* {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard */}
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
        <NotificationDropdown onMenuChange={onMenuChange} />
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => handleShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-100">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">
                {user.firstName} {user.lastName}
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
