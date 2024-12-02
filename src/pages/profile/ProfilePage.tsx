import { useState, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Lock, Camera, X, Globe, Check } from "lucide-react";

const translations = {
  en: {
    profileSettings: "Profile Settings",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    editProfile: "Edit Profile",
    changePassword: "Change Password",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm New Password",
    updatePassword: "Update Password",
    passwordsNotMatch: "New passwords do not match",
    imageSizeError: "Image must be less than 5MB",
    imageTypeError: "File must be an image",
    language: "Language",
    english: "English",
    french: "French",
  },
  fr: {
    profileSettings: "Paramètres du Profil",
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    cancel: "Annuler",
    saveChanges: "Enregistrer",
    editProfile: "Modifier le Profil",
    changePassword: "Changer le Mot de Passe",
    currentPassword: "Mot de Passe Actuel",
    newPassword: "Nouveau Mot de Passe",
    confirmPassword: "Confirmer le Mot de Passe",
    updatePassword: "Mettre à jour",
    passwordsNotMatch: "Les mots de passe ne correspondent pas",
    imageSizeError: "L'image doit être inférieure à 5 Mo",
    imageTypeError: "Le fichier doit être une image",
    language: "Langue",
    english: "Anglais",
    french: "Français",
  },
};

const LanguageSelect = ({ value, onChange, translations }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "en", label: translations.english, icon: "🇬🇧" },
    { value: "fr", label: translations.french, icon: "🇫🇷" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex items-center justify-between px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <Globe className="h-4 w-4 text-gray-500" />
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
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  value === option.value ? "bg-blue-50 text-blue-600" : ""
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
  const t = translations[language];
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
      setPasswordError(t.passwordsNotMatch);
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
        setImageError(t.imageSizeError);
        return;
      }

      if (!file.type.startsWith("image/")) {
        setImageError(t.imageTypeError);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t.profileSettings}
          </h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative group">
              {profileImage ? (
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-xl font-semibold">
                  {user?.firstName[0]}
                  {user?.lastName[0]}
                </div>
              )}
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-200 cursor-pointer hover:bg-gray-50"
              >
                <Camera className="h-4 w-4 text-gray-500" />
              </label>
              <input
                id="profile-image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-500">{user?.role}</p>
              {imageError && (
                <p className="text-sm text-red-600 mt-1">{imageError}</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.firstName}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.lastName}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
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
                    {t.cancel}
                  </Button>
                  <Button type="submit">{t.saveChanges}</Button>
                </>
              ) : (
                <Button type="button" onClick={() => setIsEditing(true)}>
                  {t.editProfile}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900">
              {t.changePassword}
            </h2>
          </div>
        </div>
        <div className="p-6">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.currentPassword}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.newPassword}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t.confirmPassword}
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
              <p className="text-sm text-red-600">{passwordError}</p>
            )}
            <div className="flex justify-end">
              <Button type="submit">{t.updatePassword}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
