import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuthStore } from "../../store/authStore";
import { useSnackbar } from "../../hooks/useSnackbar"; // Add this import
import { projectApi } from "../../api/projectApi"; // Add this import
import { X } from "lucide-react"; // Add this import

interface FormErrors {
  title?: string;
  technologies?: string;
  duration?: string;
  description?: string;
  location?: string;
  salary?: string;
  startDate?: string;
  submit?: string;
}

export function CompanyPFEForm() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { addProject, projects } = useProjectContext();
  const { showSnackbar } = useSnackbar(); // Add this hook
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    title: "",
    type: "Internship",
    technologies: "",
    summary: "", // Changed from description to match backend
    location: "",
    option: "GL", // Required by backend
    company_name: user?.companyName || "",
    internship_location: "",
    internship_salary: "",
    internship_start_date: "",
    internship_duration_months: "",
  });

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.summary) newErrors.summary = "Description is required";
    if (!formData.technologies)
      newErrors.technologies = "Technologies are required";
    if (!formData.internship_location)
      newErrors.location = "Location is required";
    if (!formData.internship_duration_months)
      newErrors.duration = "Duration is required";
    if (!formData.internship_start_date)
      newErrors.startDate = "Start date is required";

    // Validate duration is between 4 and 12 months
    const duration = parseInt(formData.internship_duration_months);
    if (isNaN(duration) || duration < 4 || duration > 12) {
      newErrors.duration = "Duration must be between 4 and 12 months";
    }

    // Validate start date is in the future
    const startDate = new Date(formData.internship_start_date);
    if (startDate <= new Date()) {
      newErrors.startDate = "Start date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🔄 Starting form submission...");

    if (!validateForm()) {
      return;
    }

    try {
      if (!user?.company?.company_id || !user?.company?.company_name) {
        throw new Error("Company information not found");
      }

      console.log("📝 Preparing project data...");
      const projectData = {
        title: formData.title,
        summary: formData.summary,
        technologies: formData.technologies,
        type: "Internship",
        option: formData.option,
        submitted_by: user?.user_id,
        status: "Proposed",
        company_id: user.company.company_id, // Use company_id instead of company_name
        company_name: user.company.company_name, // Add company name
        internship_location: formData.internship_location,
        internship_duration_months: parseInt(
          formData.internship_duration_months
        ),
        internship_start_date: formData.internship_start_date,
        internship_salary: formData.internship_salary
          ? parseFloat(formData.internship_salary)
          : null,
        proposal: {
          proposer_type: "Company",
          submitted_by: user?.user_id,
          proposal_status: "Pending",
          is_final_version: true,
          proposal_order: 1,
        },
      };

      console.log("📤 Submitting project with data:", projectData);

      const response = await projectApi.submitProject(projectData);
      console.log("✅ Project submitted successfully:", response);

      showSnackbar("Internship offer submitted successfully", "success");
      navigate("/projects");
    } catch (error: any) {
      console.error("❌ Submit failed:", {
        error,
        message: error.message,
        response: error.response?.data,
        formData,
      });

      // Handle validation errors
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(
          ([field, messages]: [string, any]) => {
            if (Array.isArray(messages)) {
              messages.forEach((message) => {
                showSnackbar(`${field}: ${message}`, "error");
              });
            }
          }
        );
      }

      setErrors({
        submit:
          error.response?.data?.message || "Failed to submit internship offer",
        ...(error.response?.data?.errors || {}),
      });
    }
  };

  const fillTestData = () => {
    setFormData({
      title: "Full Stack Developer Intern",
      type: "Internship",
      technologies: "React, Node.js, TypeScript, PostgreSQL",
      summary:
        "Join our development team as a Full Stack Developer Intern. You will work on building modern web applications using React and Node.js, participate in the full development lifecycle, and learn industry best practices for software development.",
      option: "GL",
      company_name: user?.companyName || "",
      internship_location: "Algiers, Algeria",
      internship_salary: "45000",
      internship_start_date: new Date(Date.now() + 7776000000)
        .toISOString()
        .split("T")[0], // 90 days in future
      internship_duration_months: "6",
    });
  };

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {id ? "Edit Internship Offer" : "Submit New Internship Offer"}
            </h2>
            <button
              type="button"
              onClick={fillTestData}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Fill Test Data
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Basic Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Basic Details
            </h3>
            <div className="space-y-4">
              <Input
                label="Internship Title"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={errors.title}
                required
                placeholder="e.g., Full Stack Developer Intern"
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Department
                  </label>
                  <select
                    value={formData.option}
                    onChange={(e) =>
                      setFormData({ ...formData, option: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 [&>option]:dark:bg-gray-800"
                    required
                  >
                    <option value="GL">GL</option>
                    <option value="IA">IA</option>
                    <option value="RSD">RSD</option>
                    <option value="SIC">SIC</option>
                  </select>
                </div>

                <Input
                  type="text"
                  label="Required Skills"
                  name="technologies"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  error={errors.technologies}
                  placeholder="e.g., React, Node.js, Python"
                  required
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Description
                </label>
                <textarea
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData({ ...formData, summary: e.target.value })
                  }
                  rows={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 min-h-[160px] focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the internship position, responsibilities, and requirements"
                  required
                />
                {errors.summary && (
                  <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {errors.summary}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Internship Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Internship Details
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-8">
                <Input
                  type="date"
                  label="Start Date"
                  name="internship_start_date"
                  value={formData.internship_start_date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      internship_start_date: e.target.value,
                    })
                  }
                  error={errors.startDate}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />

                <Input
                  type="number"
                  label="Duration (months)"
                  name="internship_duration_months"
                  value={formData.internship_duration_months}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      internship_duration_months: e.target.value,
                    })
                  }
                  error={errors.duration}
                  required
                  min="4"
                  max="12"
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <Input
                  label="Location"
                  name="internship_location"
                  value={formData.internship_location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      internship_location: e.target.value,
                    })
                  }
                  error={errors.location}
                  required
                  placeholder="e.g., Algiers, Algeria"
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />

                <Input
                  type="number"
                  label="Monthly Salary (DZD)"
                  name="internship_salary"
                  value={formData.internship_salary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      internship_salary: e.target.value,
                    })
                  }
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {id ? "Update Internship" : "Submit Internship"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
