import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useProjectContext } from "../../context/ProjectContext";

interface FormErrors {
  [key: string]: string;
}

export function PFESubmissionForm() {
  const navigate = useNavigate();
  const { addProject } = useProjectContext();
  const [formData, setFormData] = useState({
    supervisorName: "",
    coSupervisorName: "",
    option: "",
    type: "",
    title: "",
    summary: "",
    technologies: "",
    hardwareRequirements: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }

    if (!formData.option) {
      newErrors.option = "Option is required";
    }

    if (!formData.type) {
      newErrors.type = "Type is required";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    } else if (formData.summary.length < 50) {
      newErrors.summary = "Summary must be at least 50 characters";
    }

    if (!formData.technologies.trim()) {
      newErrors.technologies = "At least one technology is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const newProject = {
        id: Date.now(),
        ...formData,
        status: "Pending Approval",
        submittedDate: new Date().toISOString().split("T")[0],
      };

      addProject(newProject);
      navigate("/projects");
    } catch (error) {
      console.error("Error submitting PFE:", error);
      setErrors({ submit: "Failed to submit PFE. Please try again." });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fillTestData = () => {
    setFormData({
      supervisorName: "Dr. John Smith",
      coSupervisorName: "Dr. Jane Doe",
      option: "IA",
      type: "innovative",
      title: "AI-Powered Healthcare Diagnostics System",
      summary:
        "An innovative healthcare diagnostics system leveraging artificial intelligence and machine learning algorithms to assist medical professionals in early disease detection and treatment planning. The system will analyze medical imaging data and patient records to provide accurate diagnostic suggestions.",
      technologies: "Python, TensorFlow, React, Node.js, MongoDB",
      hardwareRequirements: "GPU Server, Medical Imaging Equipment",
    });
  };

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white h-full border border-gray-200 shadow-sm"
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              Submit New PFE Project
            </h2>
            <button
              type="button"
              onClick={fillTestData}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Fill Test Data
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Supervisors Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Supervision Details
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <Input
                label="Supervisor Name"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={(e) =>
                  setFormData({ ...formData, supervisorName: e.target.value })
                }
                error={errors.supervisorName}
                required
                className="text-lg p-3"
              />
              <Input
                label="Co-Supervisor Name"
                name="coSupervisorName"
                value={formData.coSupervisorName}
                onChange={(e) =>
                  setFormData({ ...formData, coSupervisorName: e.target.value })
                }
                className="text-lg p-3"
              />
            </div>
          </div>

          {/* Project Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Project Details
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Option
                </label>
                <select
                  name="option"
                  value={formData.option}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.option ? "border-red-500" : "border-gray-300"
                  } px-4 py-3 bg-white text-gray-900 text-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  required
                >
                  <option value="" disabled>
                    Select Option
                  </option>
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
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full rounded-md border ${
                    errors.type ? "border-red-500" : "border-gray-300"
                  } px-4 py-3 bg-white text-gray-900 text-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                  required
                >
                  <option value="" disabled>
                    Select Type
                  </option>
                  <option value="classic">Classic</option>
                  <option value="innovative">Innovative</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-red-600">{errors.type}</p>
                )}
              </div>
            </div>

            <Input
              label="Project Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              error={errors.title}
              required
              className="text-lg p-3"
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={(e) =>
                  setFormData({ ...formData, summary: e.target.value })
                }
                rows={6}
                className={`mt-1 block w-full rounded-md border ${
                  errors.summary ? "border-red-500" : "border-gray-300"
                } px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                required
              />
              {errors.summary && (
                <p className="text-sm text-red-600">{errors.summary}</p>
              )}
            </div>
          </div>

          {/* Technical Requirements Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Technical Requirements
            </h3>
            <Input
              label="Technologies"
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

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Hardware Requirements
              </label>
              <textarea
                name="hardwareRequirements"
                value={formData.hardwareRequirements}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hardwareRequirements: e.target.value,
                  })
                }
                rows={4}
                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="List any specific hardware requirements"
              />
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600 text-center">{errors.submit}</p>
          )}
        </div>

        <div className="sticky bottom-0 bg-white px-8 py-6 border-t border-gray-200">
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
              Submit PFE
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
