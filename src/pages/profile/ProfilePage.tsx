import { useState, useRef, useEffect } from "react";
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
  const options = [
    { value: "en", label: t.profile.english, icon: "🇬🇧" },
    { value: "fr", label: t.profile.french, icon: "🇫🇷" },
  ];

  return (
    <div className="flex items-center gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            value === option.value
              ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 ring-1 ring-blue-400/30"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
          aria-pressed={value === option.value}
        >
          <span className="text-lg">{option.icon}</span>
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

export function ProfilePage() {
  const { user } = useAuthStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
  });

  // Initialize form data based on user role
  useEffect(() => {
    if (user) {
      console.log("Initializing form data for role:", user.role);
      switch (user.role) {
        case "Administrator":
          setFormData({
            firstName: user.administrator.name,
            lastName: user.administrator.surname,
            email: user.email,
          });
          break;
        case "Teacher":
          setFormData({
            firstName: user.teacher.name,
            lastName: user.teacher.surname,
            email: user.email,
          });
          break;
        case "Student":
          setFormData({
            firstName: user.student.name,
            lastName: user.student.surname,
            email: user.email,
          });
          break;
        case "Company":
          setFormData({
            firstName: user.company.contact_name,
            lastName: user.company.contact_surname,
            email: user.email,
          });
          break;
      }
    }
  }, [user]);

  // Get user name for display
  const getUserInitials = () => {
    if (!user) return "";
    switch (user.role) {
      case "Administrator":
        return `${user.administrator.name[0]}${user.administrator.surname[0]}`;
      case "Teacher":
        return `${user.teacher.name[0]}${user.teacher.surname[0]}`;
      case "Student":
        return `${user.student.name[0]}${user.student.surname[0]}`;
      case "Company":
        return `${user.company.contact_name[0]}${user.company.contact_surname[0]}`;
      default:
        return "";
    }
  };

  const getUserFullName = () => {
    if (!user) return "";
    switch (user.role) {
      case "Administrator":
        return `${user.administrator.name} ${user.administrator.surname}`;
      case "Teacher":
        return `${user.teacher.name} ${user.teacher.surname}`;
      case "Student":
        return `${user.student.name} ${user.student.surname}`;
      case "Company":
        return `${user.company.contact_name} ${user.company.contact_surname}`;
      default:
        return "";
    }
  };

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

  // Render loading state while waiting for user data
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
          <p className="text-gray-600">Please wait while we fetch your data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="relative group">
                {profileImage ? (
                  <div className="relative">
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-700 shadow-lg"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1.5 bg-red-100 dark:bg-red-900 rounded-full text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white text-3xl font-bold shadow-lg">
                    {getUserInitials()}
                  </div>
                )}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-700 rounded-full border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors shadow-sm"
                >
                  <Camera className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    id="profile-image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {getUserFullName()}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {user.email}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active
                        ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300"
                    }`}
                  >
                    {user.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {user.role}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="whitespace-nowrap"
                >
                  {t.profile.editProfile}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t.profile.profileSettings}
                </h2>
              </div>
              <div className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t.profile.firstName}
                      </label>
                      <Input
                        disabled={!isEditing}
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                        {t.profile.lastName}
                      </label>
                      <Input
                        disabled={!isEditing}
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t.profile.email}
                    </label>
                    <Input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    {isEditing ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          {t.profile.cancel}
                        </Button>
                        <Button type="submit">{t.profile.saveChanges}</Button>
                      </>
                    ) : (
                      <Button type="button" onClick={() => setIsEditing(true)}>
                        {t.profile.editProfile}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Additional Information
                </h2>
              </div>
              <div className="p-4">
                <dl className="grid gap-4">
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Member Since
                    </dt>
                    <dd className="text-base font-medium text-gray-900 dark:text-white">
                      {new Date(user.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </dd>
                  </div>
                  {user.date_of_birth && (
                    <div className="col-span-2">
                      <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Date of Birth
                      </dt>
                      <dd className="text-base font-medium text-gray-900 dark:text-white">
                        {new Date(user.date_of_birth).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Language Settings - Moved to top of sidebar */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.profile.language}
                  </h2>
                </div>
              </div>
              <div className="p-4">
                <LanguageSelect value={language} onChange={setLanguage} t={t} />
              </div>
            </div>

            {/* Password Change */}
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.profile.changePassword}
                  </h2>
                </div>
              </div>
              <div className="p-4">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t.profile.currentPassword}
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t.profile.newPassword}
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      {t.profile.confirmPassword}
                    </label>
                    <Input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                    />
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {passwordError}
                    </p>
                  )}
                  <div className="flex justify-end">
                    <Button type="submit">{t.profile.updatePassword}</Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
