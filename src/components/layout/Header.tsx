import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { ChevronDown, LogOut, User, Globe } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";

const languages = [
  { code: "en", label: "English", icon: "GB" },
  { code: "fr", label: "Français", icon: "FR" },
] as const;

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    useAuthStore.getState().setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setShowProfileMenu(false);
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex items-center justify-between flex-1">
      <div className="text-lg font-semibold text-gray-900">
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
      </div>
      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600">
              {user.firstName[0]}
              {user.lastName[0]}
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                {user.firstName} {user.lastName}
              </span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
              <div className="py-1">
                <div className="px-3 py-2 border-b border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
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
                            ? "bg-blue-100 text-blue-700"
                            : "hover:bg-gray-100"
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
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="mr-3 h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
