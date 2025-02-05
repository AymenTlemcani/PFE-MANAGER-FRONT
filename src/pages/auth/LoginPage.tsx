import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Globe, Sun, Moon, Eye, EyeOff } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { useThemeStore } from "../../store/themeStore";
import { useTranslation } from "../../hooks/useTranslation";
import { login } from "../../api/services/auth";
import { useAuth } from "../../hooks/useAuth"; // Keep only this import

export function LoginPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const [isResponsibleTeacher, setIsResponsibleTeacher] = useState(false);
  const { isDark, toggleTheme } = useThemeStore();
  const { isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      setUser(user);

      if (user.must_change_password) {
        // You might want to redirect to a password change page
        navigate("/change-password");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    // Set password based on role
    const passwords = {
      "admin@pfe.com": "admin123",
      "student@pfe.com": "student123",
      "company@pfe.com": "company123",
      "teacher@pfe.com": "teacher123",
      "responsible@pfe.com": "teacher123",
    };
    setPassword(passwords[demoEmail as keyof typeof passwords]);
  };

  const handleTeacherClick = () => {
    setIsResponsibleTeacher(!isResponsibleTeacher);
    handleDemoLogin(
      isResponsibleTeacher ? "responsible@pfe.com" : "teacher@pfe.com"
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-indigo-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 bg-gradient-size animate-gradient-shift py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100/80 via-indigo-100/80 to-white/80 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 bg-gradient-size animate-gradient-shift" />
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-[0.02] pointer-events-none" />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center gap-2"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === "en" ? "fr" : "en")}
          className="flex items-center gap-2"
        >
          <Globe className="h-4 w-4" />
          {language === "en" ? "Français" : "English"}
        </Button>
      </div>
      <div className="max-w-md w-full space-y-8 relative">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-500" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
              {t.login.title}
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label={t.login.emailLabel}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.login.emailPlaceholder}
                disabled={loading}
              />
              <Input
                label={t.login.passwordLabel}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.login.passwordPlaceholder}
                disabled={loading}
                icon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                }
              />
            </div>
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t.login.signingIn : t.login.signIn}
            </Button>
          </form>

          <div className="space-y-4 mt-8">
            {" "}
            {/* Reduced from mt-12 to mt-8 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/90 dark:bg-gray-800/90 text-gray-500 dark:text-gray-400">
                  {/* Changed bg-gray-50 to bg-white/90 and dark:bg-gray-900 to dark:bg-gray-800/90 to match container */}
                  {t.login.demoAccounts}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("admin@pfe.com")}
              >
                {t.login.adminDemo}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("company@pfe.com")}
              >
                {t.login.companyDemo}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("student@pfe.com")}
              >
                {t.login.studentDemo}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleTeacherClick}
                className={`relative hover:text-inherit ${
                  isResponsibleTeacher
                    ? "border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50"
                    : ""
                }`}
              >
                {isResponsibleTeacher
                  ? t.login.responsibleTeacherDemo
                  : t.login.teacherDemo}
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400 text-xs flex items-center justify-center">
                  ↺
                </span>
              </Button>
            </div>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              {/* Update demo password text */}
              Demo passwords: admin123, student123, company123, teacher123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
