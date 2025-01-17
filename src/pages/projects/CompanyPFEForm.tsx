import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuthStore } from "../../store/authStore";
import { X } from "lucide-react"; // Add this import

interface FormErrors {
  title?: string;
  type?: string;
  technologies?: string;
  duration?: string;
  description?: string;
  requirements?: string;
  submit?: string;
}

export function CompanyPFEForm() {
  const { id } = useParams();
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { addProject, projects } = useProjectContext();
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    title: "",
    type: "Internship", // Set default type to Internship
    technologies: "",
    duration: "",
    description: "",
    requirements: "",
    paid: false,
    salary: "",
    location: "",
  });

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.technologies)
      newErrors.technologies = "Required skills are required";
    if (!formData.duration) newErrors.duration = "Duration is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.location) newErrors.location = "Location is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const newProject = {
        id: id ? Number(id) : Date.now(),
        ...formData,
        companyId: user?.id,
        companyName: user?.companyName,
        status: "Pending Review",
        submittedDate: new Date().toISOString().split("T")[0],
      };

      addProject(newProject);
      navigate("/projects");
    } catch (error) {
      setErrors({ submit: "Failed to submit project" });
    }
  };

  const fillTestData = () => {
    setFormData({
      title: "AI-Powered Customer Service Platform",
      type: "Internship",
      technologies: "Python, TensorFlow, React, Node.js, MongoDB",
      duration: "6 months",
      description:
        "Development of an intelligent customer service platform using AI to automate responses and improve customer satisfaction. The system will use natural language processing and machine learning to handle customer inquiries.",
      requirements: "Strong background in machine learning and web development",
      paid: true,
      salary: "1200",
      location: "Algiers, Algeria",
    });
  };

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm"
      >
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
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Internship Details
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
                className="text-lg p-3"
              />

              <div className="grid grid-cols-2 gap-8">
                <Input
                  label="Required Skills"
                  name="technologies"
                  value={formData.technologies}
                  onChange={(e) =>
                    setFormData({ ...formData, technologies: e.target.value })
                  }
                  error={errors.technologies}
                  placeholder="e.g., React, Node.js, Python"
                  required
                  className="text-lg p-3"
                />
                <Input
                  label="Duration (months)"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  error={errors.duration}
                  required
                  min="1"
                  max="12"
                  className="text-lg p-3"
                />
              </div>

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                error={errors.location}
                required
                placeholder="e.g., Algiers, Algeria"
                className="text-lg p-3"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Internship Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={6}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent dark:bg-transparent px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  placeholder="Describe the internship position, responsibilities, and requirements"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="paid"
                    checked={formData.paid}
                    onChange={(e) =>
                      setFormData({ ...formData, paid: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="paid"
                    className="text-sm text-gray-700 dark:text-gray-200"
                  >
                    Paid Internship
                  </label>
                </div>

                {formData.paid && (
                  <Input
                    label="Monthly Salary (DZD)"
                    name="salary"
                    type="number"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({ ...formData, salary: e.target.value })
                    }
                    placeholder="Enter monthly salary"
                    className="text-lg p-3"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
              className="px-6 py-3 text-lg"
            >
              Cancel
            </Button>
            <Button type="submit" className="px-6 py-3 text-lg">
              {id ? "Update Internship" : "Submit Internship"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
