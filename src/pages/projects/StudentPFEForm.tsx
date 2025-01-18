import { X, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuthStore } from "../../store/authStore";
import { useProjectStore } from "../../store/projectStore";
import { projectApi } from "../../api/projectApi";
import { useSnackbar } from "../../hooks/useSnackbar";

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

interface StudentUser extends User {
  student?: {
    student_id: number;
    name: string;
    surname: string;
    master_option: string;
    overall_average: number;
    admission_year: number;
  };
}

export function StudentPFEForm() {
  const user = useAuthStore((state) => state.user) as StudentUser;
  const navigate = useNavigate();
  const { addProject } = useProjectContext();
  const { submitProject, submitProposal } = useProjectStore();
  const { showSnackbar } = useSnackbar();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [availablePartners, setAvailablePartners] = useState<Student[]>([]);
  const [hasExistingProposal, setHasExistingProposal] = useState(false);
  const [formData, setFormData] = useState({
    studentId: user?.id || user?.user_id || "",
    studentName: user?.student
      ? `${user.student.name} ${user.student.surname}`.trim()
      : "Loading...",
    partnerId: "",
    partnerName: "",
    companyId: "",
    supervisorName: "",
    option: user?.student?.master_option || "",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [projectType, setProjectType] = useState<"project" | "internship">(
    "project"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user?.student) {
      setFormData((current) => ({
        ...current,
        studentId: user.id || user.user_id || "",
        studentName: `${user.student.name} ${user.student.surname}`.trim(),
        option: user.student.master_option || current.option,
      }));
    }
  }, [user]);

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

  useEffect(() => {
    validateProposalLimit();
  }, []);

  const validateProposalLimit = async () => {
    try {
      // Check both project submissions and proposals
      const projects = await projectApi.getProjects();
      const studentProjects = projects.filter(
        (p) => p.submitted_by === user?.user_id && p.status !== "Rejected"
      );

      console.log("🔍 Validating proposal limit:", {
        projects: studentProjects.length,
        userId: user?.user_id,
      });

      if (studentProjects.length >= 3) {
        showSnackbar(
          "Maximum number of project proposals (3) reached",
          "error"
        );
        navigate("/project");
        return false;
      }

      return true;
    } catch (error) {
      console.error("❌ Error checking proposal limit:", error);
      showSnackbar("Failed to validate proposal limit", "error");
      return false;
    }
  };

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
    if (!validateForm()) return;

    // Check proposal limit before submitting
    const canSubmit = await validateProposalLimit();
    if (!canSubmit) return;

    setIsSubmitting(true);
    showSnackbar("Submitting project proposal...", "info");

    try {
      // Double check proposal limit with latest proposals
      const proposalsResponse = await projectApi.getProposals();
      const proposalsArray = proposalsResponse.proposals || [];
      const studentProposals = proposalsArray.filter(
        (p) => p.submitted_by === user?.user_id && p.proposer_type === "Student"
      );

      if (studentProposals.length >= 3) {
        showSnackbar(
          "Maximum number of project proposals (3) reached",
          "error"
        );
        navigate("/project");
        return;
      }

      const userId = user?.id || user?.user_id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      const userIdNum = parseInt(userId.toString());

      // Prepare project data
      const projectData = {
        title: formData.title,
        summary: formData.summary,
        technologies: formData.technologies,
        material_needs: formData.hardwareRequirements || null,
        option: formData.option,
        type: formData.type,
        submitted_by: userIdNum,
        status: "Proposed",
        proposal: {
          proposer_type: "Student",
          submitted_by: userIdNum,
          proposal_status: "Pending",
          is_final_version: true,
          proposal_order: studentProposals.length + 1,
          partner_id: formData.partnerId || undefined,
          internship_details: {
            duration: parseInt(formData.duration),
            location: formData.location,
            salary: formData.paid ? parseInt(formData.salary) : undefined,
          },
        },
      };

      console.log("📤 Submitting project:", projectData);

      const response = await submitProject(projectData);
      console.log("✅ Project submitted successfully:", response);

      showSnackbar("Project proposal submitted successfully", "success");

      // Refresh both projects and proposals before navigation
      try {
        await Promise.all([
          refreshProjects(),
          projectApi.getProposals(), // Update proposal cache
        ]);
      } catch (refreshError) {
        console.error("Failed to refresh data:", refreshError);
      }

      // Navigate after successful submission
      navigate("/project");
    } catch (error: any) {
      console.error("❌ Submit failed:", error);
      showSnackbar(error.message || "Failed to submit project", "error");

      // Handle the specific validation error
      if (error.message === "Maximum number of project proposals (3) reached") {
        showSnackbar(error.message, "error");
        navigate("/project");
        return;
      }

      // Handle validation errors
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.entries(errors).forEach(([field, messages]: [string, any]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => {
              showSnackbar(`${field}: ${message}`, "error");
            });
          }
        });
      } else {
        showSnackbar(error.message || "Failed to submit project", "error");
      }

      setErrors({
        submit: error.response?.data?.message || "Failed to submit project",
        ...(error.response?.data?.errors || {}),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillTestData = () => {
    setFormData({
      ...formData,
      title: "AI-Powered Healthcare Analytics Platform",
      option: "IA",
      type: "Innovative", // Changed from "research" to "Innovative"
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
      companyId: "1",
    });
  };

  // Filter students based on search query
  const filteredPartners = availablePartners.filter((partner) => {
    const fullName = `${partner.firstName} ${partner.lastName}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) && partner.id !== user?.id
    );
  });

  // Update project type when internship/research is selected
  useEffect(() => {
    if (projectType === "internship") {
      setFormData((prev) => ({
        ...prev,
        type: "Internship",
      }));
    }
  }, [projectType]);

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
        className="bg-white dark:bg-gray-800 h-full border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg flex flex-col"
      >
        {/* Header */}
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
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded"
            >
              Fill Test Data
            </button>
          </div>
          <button
            type="button"
            onClick={() => navigate("/project")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="px-8 py-8 space-y-8 flex-1 overflow-y-auto">
          {/* Project Type Selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Project Type
            </h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setProjectType("project")}
                className={`flex-1 py-4 px-6 rounded-lg border-2 ${
                  projectType === "project"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Research Project
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Academic research or development project
                </p>
              </button>
              <button
                type="button"
                onClick={() => setProjectType("internship")}
                className={`flex-1 py-4 px-6 rounded-lg border-2 ${
                  projectType === "internship"
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <h4 className="font-medium text-gray-900 dark:text-white">
                  Internship
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Company-based internship project
                </p>
              </button>
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

                {projectType === "project" && (
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
                      <option value="Classical">Classical</option>
                      <option value="Innovative">Innovative</option>
                      <option value="StartUp">StartUp</option>
                      <option value="Patent">Patent</option>
                    </select>
                  </div>
                )}
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

          {/* Conditional sections based on project type */}
          {projectType === "internship" ? (
            <>
              {/* Company Details Section */}
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
                      setFormData({
                        ...formData,
                        supervisorName: e.target.value,
                      })
                    }
                    className="text-lg p-3 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>

              {/* Internship Details Section */}
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

                    {/* Rest of the form */}
                    <Input
                      label="Salary"
                      name="salary"
                      value={formData.salary}
                      onChange={(e) =>
                        setFormData({ ...formData, salary: e.target.value })
                      }
                      error={errors.salary}
                      required={formData.paid}
                      className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Research Project Details Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Research Project Details
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

                  <Input
                    label="Hardware Requirements"
                    name="hardwareRequirements"
                    value={formData.hardwareRequirements}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hardwareRequirements: e.target.value,
                      })
                    }
                    className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                  />
                </div>
              </div>
            </>
          )}

          {/* Partner Selection */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Partner Selection
            </h3>

            <div className="space-y-4">
              <Input
                label="Search Partner"
                name="searchPartner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />

              <div className="space-y-2">
                {filteredPartners.length > 0 ? (
                  <ul className="space-y-2">
                    {filteredPartners.map((partner) => (
                      <li
                        key={partner.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-gray-900 dark:text-white">
                            {partner.firstName} {partner.lastName}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">
                            {partner.masterOption}
                          </div>
                        </div>
                        <Button
                          onClick={() =>
                            setFormData({
                              ...formData,
                              partnerId: partner.id,
                              partnerName: `${partner.firstName} ${partner.lastName}`,
                            })
                          }
                        >
                          Select
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No partners found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/project")}
              className="text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
            >
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
