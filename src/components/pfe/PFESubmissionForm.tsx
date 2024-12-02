import { X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function PFESubmissionForm() {
  const navigate = useNavigate();
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
      // TODO: Implement API call
      console.log(formData);
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

  return (
    <div className="container mx-auto max-w-3xl py-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Submit New PFE Project</h2>
          <button
            type="button"
            onClick={() => navigate("/projects")}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Supervisor Name"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={(e) =>
                setFormData({ ...formData, supervisorName: e.target.value })
              }
              error={errors.supervisorName}
              required
            />
            <Input
              label="Co-Supervisor Name"
              name="coSupervisorName"
              value={formData.coSupervisorName}
              onChange={(e) =>
                setFormData({ ...formData, coSupervisorName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Option
              </label>
              <select
                name="option"
                value={formData.option}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.option ? "border-red-500" : "border-gray-300"
                } px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full rounded-md border ${
                  errors.type ? "border-red-500" : "border-gray-300"
                } px-3 py-2 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
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
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Summary
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={(e) =>
                setFormData({ ...formData, summary: e.target.value })
              }
              rows={4}
              className={`mt-1 block w-full rounded-md border ${
                errors.summary ? "border-red-500" : "border-gray-300"
              } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
              required
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
            )}
          </div>

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
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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
              rows={2}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="List any specific hardware requirements"
            />
          </div>

          {errors.submit && (
            <p className="text-sm text-red-600 text-center mt-4">
              {errors.submit}
            </p>
          )}
        </div>

        <div className="bg-white px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/projects")}
            >
              Cancel
            </Button>
            <Button type="submit">Submit PFE</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
