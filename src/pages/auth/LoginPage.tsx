import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Globe } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useLanguageStore } from "../../store/languageStore";
import { useTranslation } from "../../hooks/useTranslation";
import { login } from "../../services/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      setUser(user);
      localStorage.setItem("authToken", "mock-token");
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
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
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
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
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.login.passwordPlaceholder}
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t.login.signingIn : t.login.signIn}
          </Button>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
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
              onClick={() => handleDemoLogin("teacher@pfe.com")}
            >
              {t.login.teacherDemo}
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
              onClick={() => handleDemoLogin("company@pfe.com")}
            >
              {t.login.companyDemo}
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500">
            {t.login.demoPassword}
          </p>
        </div>
      </div>
    </div>
  );
}
