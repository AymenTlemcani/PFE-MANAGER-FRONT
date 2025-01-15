import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";

interface FormErrors {
  [key: string]: string;
}

export function TeacherPFEForm() {
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

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.option) newErrors.option = "Option is required";
    if (!formData.type) newErrors.type = "Project type is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.technologies.trim())
      newErrors.technologies = "Technologies are required";
    if (!formData.co_supervisor_name.trim())
      newErrors.co_supervisor_name = "Co-supervisor name is required";
    if (!formData.co_supervisor_surname.trim())
      newErrors.co_supervisor_surname = "Co-supervisor surname is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("🔒 User auth check:", { user });
      // Check for either id or user_id
      const userId = user?.id || user?.user_id;
      if (!userId) {
        console.error("❌ Authentication failed:", { user });
        throw new Error("User not authenticated");
      }

      // Store numeric user ID
      const userIdNum = parseInt(userId.toString());
      localStorage.setItem("user_id", userIdNum.toString());

      console.log("🏁 Starting project submission...");
      const projectData = {
        title: formData.title,
        summary: formData.summary,
        technologies: formData.technologies,
        material_needs: formData.material_needs || null,
        option: formData.option,
        type: formData.type,
        submitted_by: userIdNum,
        status: "Proposed",
        proposal: {
          co_supervisor_name: formData.co_supervisor_name,
          co_supervisor_surname: formData.co_supervisor_surname,
          submitted_by: userIdNum,
          proposer_type: "Teacher",
          proposal_status: "Pending",
          is_final_version: true,
          proposal_order: 1,
          review_comments: "Initial submission",
        },
      };

      console.log("📦 Project data prepared:", projectData);
      const response = await submitProject(projectData);
      console.log("✅ Project created:", response);
      navigate("/projects");
    } catch (error: any) {
      console.error("❌ Submit failed:", error);
      console.error("❌ Error details:", {
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
        data: error.response?.data,
        sqlError: error.response?.data?.sqlError,
      });
      setErrors({
        submit: error.response?.data?.message || "Failed to submit project",
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
        className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg"
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Submit New PFE Project
            </h2>
            <button
              type="button"
              onClick={fillTestData}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
            >
              Fill Test Data
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Project Basic Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Details
            </h3>
            <Input
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              required
            />

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Option
                </label>
                <select
                  name="option"
                  value={formData.option}
                  onChange={(e) =>
                    setFormData({ ...formData, option: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3"
                  required
                >
                  <option value="">Select Option</option>
                  <option value="GL">GL</option>
                  <option value="IA">IA</option>
                  <option value="RSD">RSD</option>
                  <option value="SIC">SIC</option>
                </select>
                {errors.option && (
                  <p className="text-sm text-red-600">{errors.option}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Project Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Classical">Classical</option>
                  <option value="Innovative">Innovative</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Project Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={6}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3"
                required
              />
              {errors.summary && (
                <p className="text-sm text-red-600">{errors.summary}</p>
              )}
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Technical Requirements
            </h3>
            <Input
              label="Required Technologies"
              name="technologies"
              value={formData.technologies}
              onChange={(e) =>
                setFormData({ ...formData, technologies: e.target.value })
              }
              error={errors.technologies}
              placeholder="e.g., Python, TensorFlow, React"
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Material Needs
              </label>
              <textarea
                name="material_needs"
                value={formData.material_needs}
                onChange={(e) =>
                  setFormData({ ...formData, material_needs: e.target.value })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3"
              />
            </div>
          </div>

          {/* Co-Supervisor Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Co-Supervisor Details
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <Input
                label="Co-Supervisor Name"
                name="co_supervisor_name"
                value={formData.co_supervisor_name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    co_supervisor_name: e.target.value,
                  })
                }
                error={errors.co_supervisor_name}
                required
              />
              <Input
                label="Co-Supervisor Surname"
                name="co_supervisor_surname"
                value={formData.co_supervisor_surname}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    co_supervisor_surname: e.target.value,
                  })
                }
                error={errors.co_supervisor_surname}
                required
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Project</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
