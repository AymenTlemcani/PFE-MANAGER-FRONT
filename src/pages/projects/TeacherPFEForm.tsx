import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import { useSnackbar } from "../../hooks/useSnackbar";
import { useTranslation } from "../../hooks/useTranslation"; // Change this import to use our custom hook

interface FormErrors {
  [key: string]: string;
}

interface SnackbarState {
  message: string;
  type: "success" | "error" | "info";
  isOpen: boolean;
}

export function TeacherPFEForm() {
  const { t } = useTranslation(); // Now using our custom hook
  const { showSnackbar } = useSnackbar();

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { submitProject, submitProposal } = useProjectStore();
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    type: "",
    option: "",
    technologies: "",
    material_needs: "",
    co_supervisor_name: "",
    co_supervisor_surname: "",
  });
  const [hasCoSupervisor, setHasCoSupervisor] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    let hasErrors = false;

    if (!formData.title.trim()) {
      newErrors.title = t.projectForm.validation.enterTitle;
      hasErrors = true;
    }
    if (!formData.option) {
      newErrors.option = t.projectForm.validation.selectOption;
      hasErrors = true;
    }
    if (!formData.type) {
      newErrors.type = t.projectForm.validation.selectType;
      hasErrors = true;
    }
    if (!formData.summary.trim()) {
      newErrors.summary = t.projectForm.validation.provideSummary;
      hasErrors = true;
    }

    if (hasErrors) {
      showSnackbar(t.projectForm.validation.fillRequiredFields, "error");
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    showSnackbar(t.projectForm.notifications.submitting, "info");

    try {
      console.log("🔒 User auth check:", { user });
      // Check for either id or user_id
      const userId = user?.id || user?.user_id;
      if (!userId) {
        console.error("❌ Authentication failed:", { user });
        throw new Error(t.projectForm.notifications.notAuthenticated);
      }

      // Store numeric user ID
      const userIdNum = parseInt(userId.toString());
      localStorage.setItem("user_id", userIdNum.toString());

      console.log("🏁 Starting project submission...");
      const projectData = {
        title: formData.title,
        summary: formData.summary,
        technologies: formData.technologies,
        material_needs: formData.material_needs,
        option: formData.option,
        type: formData.type,
        submitted_by: userIdNum,
        status: "Proposed",
        proposal: {
          co_supervisor_name: hasCoSupervisor
            ? formData.co_supervisor_name
            : null,
          co_supervisor_surname: hasCoSupervisor
            ? formData.co_supervisor_surname
            : null,
          submitted_by: userIdNum,
          proposer_type: "Teacher",
          proposal_status: "Pending",
          is_final_version: true,
          proposal_order: 1,
          review_comments: "Initial submission",
        },
      };

      const response = await submitProject(projectData);

      // Success message will automatically clear the info message
      showSnackbar(t.projectForm.notifications.submitSuccess, "success");
      console.log("✅ Project created:", response);
      navigate("/projects");
    } catch (error: any) {
      // Error message
      const errorMessage =
        error.response?.data?.message ||
        t.projectForm.notifications.submitError;
      showSnackbar(errorMessage, "error");
      console.error("❌ Submit failed:", error);

      // Show error messages in snackbar
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                showSnackbar(`${field}: ${message}`, "error");
              });
            }
          }
        );
      }

      setErrors({
        submit: errorMessage,
        ...(error.response?.data?.errors || {}),
      });
    }
  };

  const fillTestData = () => {
    setFormData({
      title: "Machine Learning for Network Security",
      summary:
        "Development of an advanced network security system using machine learning algorithms to detect and prevent cyber attacks in real-time.",
      type: "Innovative",
      option: "IA",
      technologies: "Python, TensorFlow, Scikit-learn, Network Security Tools",
      material_needs:
        "High-performance computing server, Network monitoring equipment",
      co_supervisor_name: "Sarah",
      co_supervisor_surname: "Johnson",
    });
  };

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        noValidate // Add this to prevent browser default validation
        className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.projectForm.submitNewProject}
            </h2>
            <button
              type="button"
              onClick={fillTestData}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded transition-colors"
            >
              {t.projectForm.fillTestData}
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Project Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.projectForm.projectDetails}
            </h3>

            {/* Remove duplicate error message */}
            <Input
              label={`${t.projectForm.projectTitle} *`}
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              required
              aria-required="true"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <div className="grid grid-cols-2 gap-8">
              {/* Option Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.projectForm.option} *
                </label>
                <select
                  name="option"
                  value={formData.option}
                  onChange={(e) =>
                    setFormData({ ...formData, option: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 [&>option]:dark:bg-gray-700"
                  required
                >
                  <option value="">{t.projectForm.selectOption}</option>
                  <option value="GL">GL</option>
                  <option value="IA">IA</option>
                  <option value="RSD">RSD</option>
                  <option value="SIC">SIC</option>
                </select>
                {errors.option && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.option}
                  </p>
                )}
              </div>

              {/* Project Type Select - similar dark mode updates */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  {t.projectForm.projectType} *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 [&>option]:dark:bg-gray-700"
                  required
                >
                  <option value="">{t.projectForm.selectType}</option>
                  <option value="Classical">{t.projectForm.classical}</option>
                  <option value="Innovative">{t.projectForm.innovative}</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {errors.type}
                  </p>
                )}
              </div>
            </div>

            {/* Summary Textarea */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.projectForm.projectSummary} *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                required
              />
              {errors.summary && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {errors.summary}
                </p>
              )}
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {t.projectForm.technicalRequirements}
            </h3>

            <Input
              label={t.projectForm.requiredTechnologies}
              name="technologies"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              error={errors.technologies}
              placeholder="e.g., Python, TensorFlow, React"
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                {t.projectForm.materialNeeds}
              </label>
              <textarea
                name="material_needs"
                value={formData.material_needs}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    material_needs: e.target.value,
                  })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
          </div>

          {/* Co-Supervisor Details with similar dark mode updates */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hasCoSupervisor"
                checked={hasCoSupervisor}
                onChange={(e) => setHasCoSupervisor(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label
                htmlFor="hasCoSupervisor"
                className="text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t.projectForm.addCoSupervisor}
              </label>
            </div>

            {hasCoSupervisor && (
              <>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6">
                  {t.projectForm.coSupervisorDetails}
                </h3>
                <div className="grid grid-cols-2 gap-8">
                  <Input
                    label={t.projectForm.coSupervisorName}
                    name="co_supervisor_name"
                    value={formData.co_supervisor_name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        co_supervisor_name: e.target.value,
                      })
                    }
                    error={errors.co_supervisor_name}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <Input
                    label={t.projectForm.coSupervisorSurname}
                    name="co_supervisor_surname"
                    value={formData.co_supervisor_surname}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        co_supervisor_surname: e.target.value,
                      })
                    }
                    error={errors.co_supervisor_surname}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Fixed footer section */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
              className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {t.projectForm.cancel}
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              {t.projectForm.submitProject}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
