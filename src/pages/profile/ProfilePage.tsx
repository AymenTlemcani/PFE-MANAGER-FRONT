import { useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { useTranslation } from "../../hooks/useTranslation";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Lock, Camera, X, Globe, Check } from "lucide-react";
import { Translation } from "../../i18n/types";
import { UserDetails } from "../../components/UserDetails";

interface LanguageSelectProps {
  value: "en" | "fr";
  onChange: (value: "en" | "fr") => void;
  t: Translation;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  value,
  onChange,
  t,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "en", label: t.profile.english, icon: "🇬🇧" },
    { value: "fr", label: t.profile.french, icon: "🇫🇷" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span>{options.find((opt) => opt.value === value)?.label}</span>
          <span>{options.find((opt) => opt.value === value)?.icon}</span>
        </div>
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          <ul
            role="listbox"
            aria-label="Language selection"
            className="py-1 max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={value === option.value}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  value === option.value
                    ? "bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400"
                    : "text-gray-900 dark:text-gray-100"
                }`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center space-x-2">
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </div>
                {value === option.value && <Check className="h-4 w-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export function ProfilePage() {
  const { user } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    useAuthStore.getState().setUser({ ...user!, ...formData });
    setIsEditing(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError(t.profile.passwordsNotMatch);
      return;
    }

    console.log("Password updated");
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setImageError(t.profile.imageSizeError);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setImageError(t.profile.imageTypeError);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        {/* Common user details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Account Details</h3>
          <p>Email: {user.email}</p>
          <p>Language: {user.language_preference}</p>
          <p>Last Login: {user.last_login || "Never"}</p>
        </div>

        {/* Role-specific details */}
        <UserDetails user={user} />
      </div>
    </div>
  );
}
