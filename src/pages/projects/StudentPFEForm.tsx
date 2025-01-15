import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuthStore } from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";

interface FormErrors {
  [key: string]: string;
}

interface Company {
  id: string;
  companyName: string;
  industry: string;
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  masterOption: string;
}

export function StudentPFEForm() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { addProject } = useProjectContext();
  const { submitProject, submitProposal } = useProjectStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [availablePartners, setAvailablePartners] = useState<Student[]>([]);
  const [hasExistingProposal, setHasExistingProposal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: user?.id || "",
    studentName: `${user?.firstName} ${user?.lastName}` || "",
    partnerId: "",
    partnerName: "",
    companyId: "",
    supervisorName: "",
    option: "",
    title: "",
    summary: "",
    duration: "",
    technologies: "",
    location: "",
    paid: false,
    salary: "",
    hardwareRequirements: "",
    type: "", // Added type field
  });
  const [proposalCount, setProposalCount] = useState(0);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // TODO: Replace with actual API call
        const mockCompanies = [
          { id: "1", companyName: "Tech Corp", industry: "Software" },
          { id: "2", companyName: "Innovation Labs", industry: "Research" },
          { id: "3", companyName: "Data Systems", industry: "Data Analytics" },
        ];
        setCompanies(mockCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchAvailablePartners = async () => {
      try {
        // Mock API call - Replace with actual API
        const mockPartners = [
          { id: "1", firstName: "John", lastName: "Doe", masterOption: "GL" },
          { id: "2", firstName: "Jane", lastName: "Smith", masterOption: "IA" },
        ];
        setAvailablePartners(mockPartners.filter((p) => p.id !== user?.id));
      } catch (error) {
        console.error("Error fetching partners:", error);
      }
    };
    fetchAvailablePartners();
  }, [user?.id]);

  useEffect(() => {
    const fetchProposalCount = async () => {
      // Mock API call to get proposal count
      setProposalCount(2); // Example: student has already proposed 2 projects
    };
    fetchProposalCount();
  }, []);

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = "Project title is required";
    if (!formData.option) newErrors.option = "Option is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";
    if (!formData.duration.trim()) newErrors.duration = "Duration is required";
    if (!formData.technologies.trim())
      newErrors.technologies = "Technologies are required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.paid && !formData.salary.trim())
      newErrors.salary = "Salary is required for paid internships";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (proposalCount >= 3) {
      setErrors({ submit: "Maximum number of proposals (3) reached." });
      return;
    }
    if (!validateForm()) return;

    try {
      // First submit the project
      const project = await submitProject({
        title: formData.title,
        summary: formData.description,
        technologies: formData.technologies,
        material_needs: formData.hardwareRequirements,
        option: formData.option,
        type: formData.type,
      });

      // Then submit the proposal
      await submitProposal({
        project_id: project.project_id,
        partner_id: formData.partnerId || undefined,
        additional_details: {
          duration: formData.duration,
          paid: formData.paid,
          salary: formData.salary,
        },
      });

      navigate("/project");
    } catch (error) {
      setErrors({ submit: "Failed to submit PFE proposal. Please try again." });
    }
  };

  const fillTestData = () => {
    setFormData({
      ...formData, // keep existing student data
      title: "AI-Powered Healthcare Analytics Platform",
      option: "IA",
      type: "research", // Added type field
      summary:
        "An innovative healthcare analytics platform using machine learning to predict patient outcomes and optimize treatment plans. The system utilizes deep learning models for medical image analysis and predictive analytics.",
      duration: "6",
      technologies: "Python, TensorFlow, React, Node.js, PostgreSQL",
      location: "Tunis, Tunisia",
      paid: true,
      salary: "1000",
      hardwareRequirements:
        "GPU Server for model training, 32GB RAM minimum, SSD Storage",
      supervisorName: "Dr. Sarah Johnson",
      companyId: "1", // assuming this matches one of your mock companies
    });
  };

  if (proposalCount >= 3) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Maximum Proposals Reached
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            You have already submitted the maximum allowed number of project
            proposals (3).
          </p>
          <Button onClick={() => navigate("/project")}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg"
      >
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {hasExistingProposal
                ? "Update PFE Proposal"
                : "Submit New PFE Proposal"}
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
            onClick={() => navigate("/project")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Students Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Student Details
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <Input
                label="Student Name"
                value={formData.studentName}
                disabled
                className="text-lg p-3 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select Partner (Optional)
                </label>
                <select
                  name="partnerId"
                  value={formData.partnerId}
                  onChange={(e) => {
                    const partner = availablePartners.find(
                      (p) => p.id === e.target.value
                    );
                    setFormData({
                      ...formData,
                      partnerId: e.target.value,
                      partnerName: partner
                        ? `${partner.firstName} ${partner.lastName}`
                        : "",
                    });
                  }}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 [&>option]:dark:bg-gray-800"
                >
                  <option value="">Work Individually</option>
                  {availablePartners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.firstName} {partner.lastName} -{" "}
                      {partner.masterOption}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Company Details
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select Company
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={(e) =>
                    setFormData({ ...formData, companyId: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 [&>option]:dark:bg-gray-800"
                >
                  <option value="">Select a Company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.companyName} - {company.industry}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Supervisor Name at Company"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={(e) =>
                  setFormData({ ...formData, supervisorName: e.target.value })
                }
                className="text-lg p-3 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Project Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Project Title"
                name="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                error={errors.title}
                required
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
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
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 [&>option]:dark:bg-gray-800"
                    required
                  >
                    <option value="">Select Option</option>
                    <option value="GL">GL</option>
                    <option value="IA">IA</option>
                    <option value="RSD">RSD</option>
                    <option value="SIC">SIC</option>
                  </select>
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
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 [&>option]:dark:bg-gray-800"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="classic">Classic</option>
                    <option value="innovative">Innovative</option>
                    <option value="research">Research</option>
                  </select>
                </div>

                <Input
                  label="Duration (months)"
                  name="duration"
                  type="text"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: e.target.value })
                  }
                  error={errors.duration}
                  required
                  className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
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
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 min-h-[160px]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Internship Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Internship Details
            </h3>

            <div className="space-y-4">
              <Input
                label="Required Technologies"
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

              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                error={errors.location}
                required
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />

              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="paid"
                    checked={formData.paid}
                    onChange={(e) =>
                      setFormData({ ...formData, paid: e.target.checked })
                    }
                    className="h-4 w-4 text-blue-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label
                    htmlFor="paid"
                    className="ml-2 text-sm text-gray-700 dark:text-gray-200"
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
                    error={errors.salary}
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Hardware Requirements
            </h3>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
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
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 min-h-[120px]"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/project")}
            >
              Cancel
            </Button>
            <Button type="submit">
              {hasExistingProposal ? "Update Proposal" : "Submit Proposal"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

async function sendPartnerNotification(partnerId: string, projectId: string) {
  // TODO: Implement actual notification sending
  await fetch("/api/notifications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientId: partnerId,
      type: "PARTNERSHIP_REQUEST",
      projectId: projectId,
    }),
  });
}
