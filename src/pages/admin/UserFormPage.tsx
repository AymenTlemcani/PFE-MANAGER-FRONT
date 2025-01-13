import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button } from "../../components/ui";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import { X } from "lucide-react";

interface UserFormData {
  // Common fields
  email: string;
  password?: string;
  role: "Student" | "Teacher" | "Administrator" | "Company";
  is_active: boolean;
  date_of_birth?: string;
  profile_picture_url?: string;

  // Role-specific fields
  // Student
  name?: string;
  surname?: string;
  master_option?: "GL" | "IA" | "RSD" | "SIC";
  overall_average?: number;
  admission_year?: number;

  // Teacher
  recruitment_date?: string;
  grade?: "MAA" | "MAB" | "MCA" | "MCB" | "PR";
  is_responsible?: boolean;
  research_domain?: string;

  // Company
  company_name?: string;
  contact_name?: string;
  contact_surname?: string;
  industry?: string;
  address?: string;
}

export function UserFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    role: "Student",
    is_active: true,
    name: "",
    surname: "",
  });

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/users/${userId}?with=administrator,teacher,student,company`
      );
      const userData = response.data;

      console.log("Raw user data:", userData); // Debug log

      let name = "";
      let surname = "";
      let roleSpecificData = null;

      // First, determine which role-specific data to use
      if (userData.student) roleSpecificData = userData.student;
      if (userData.teacher) roleSpecificData = userData.teacher;
      if (userData.administrator) roleSpecificData = userData.administrator;
      if (userData.company) {
        roleSpecificData = userData.company;
        name = roleSpecificData.contact_name;
        surname = roleSpecificData.contact_surname;
      } else {
        name = roleSpecificData?.name || "";
        surname = roleSpecificData?.surname || "";
      }

      console.log("Extracted name/surname:", { name, surname }); // Debug log

      setFormData({
        email: userData.email,
        role: userData.role,
        is_active: userData.is_active,
        date_of_birth: userData.date_of_birth || "",
        name, // Set the extracted name
        surname, // Set the extracted surname
        // Role-specific fields
        ...(userData.role === "Student" && {
          master_option: userData.student?.master_option,
          overall_average: userData.student?.overall_average,
          admission_year: userData.student?.admission_year,
        }),
        ...(userData.role === "Teacher" && {
          recruitment_date: userData.teacher?.recruitment_date,
          grade: userData.teacher?.grade,
          is_responsible: userData.teacher?.is_responsible,
          research_domain: userData.teacher?.research_domain,
        }),
        ...(userData.role === "Company" && {
          company_name: userData.company?.company_name,
          industry: userData.company?.industry,
          address: userData.company?.address,
        }),
      });

      console.log("Set form data:", formData); // Debug log
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const formattedData = {
        email: formData.email,
        role: formData.role,
        is_active: true,
        date_of_birth: formData.date_of_birth || null,
        ...(formData.role === "Student" && {
          student: {
            name: formData.name,
            surname: formData.surname,
            master_option: formData.master_option,
            overall_average: Number(formData.overall_average),
            admission_year: Number(formData.admission_year),
          },
        }),
        ...(formData.role === "Teacher" && {
          teacher: {
            name: formData.name,
            surname: formData.surname,
            grade: formData.grade,
            research_domain: formData.research_domain,
            is_responsible: formData.is_responsible,
          },
        }),
        ...(formData.role === "Administrator" && {
          administrator: {
            name: formData.name,
            surname: formData.surname,
          },
        }),
        ...(formData.role === "Company" && {
          company: {
            company_name: formData.company_name,
            contact_name: formData.name,
            contact_surname: formData.surname,
            industry: formData.industry,
            address: formData.address,
          },
        }),
      };

      if (id) {
        await api.put(API_ENDPOINTS.users.update(Number(id)), formattedData);
      } else {
        await api.post(API_ENDPOINTS.users.create, {
          ...formattedData,
          password: formData.password,
        });
      }

      navigate("/admin/users");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save user");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleSpecificFields = () => {
    switch (formData.role) {
      case "Student":
        return (
          <div className="space-y-4">
            <Input
              label="Master Option"
              type="select"
              value={formData.master_option || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  master_option: e.target.value as any,
                })
              }
              options={[
                { value: "GL", label: "GL" },
                { value: "IA", label: "IA" },
                { value: "RSD", label: "RSD" },
                { value: "SIC", label: "SIC" },
              ]}
              required
            />
            <Input
              label="Overall Average"
              type="number"
              step="0.01"
              min="0"
              max="20"
              value={formData.overall_average || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  overall_average: parseFloat(e.target.value),
                })
              }
              required
            />
            <Input
              label="Admission Year"
              type="number"
              min="2000"
              max={new Date().getFullYear()}
              value={formData.admission_year || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  admission_year: parseInt(e.target.value),
                })
              }
              required
            />
          </div>
        );

      case "Teacher":
        return (
          <div className="space-y-4">
            <Input
              label="Recruitment Date"
              type="date"
              value={formData.recruitment_date || ""}
              onChange={(e) =>
                setFormData({ ...formData, recruitment_date: e.target.value })
              }
              required
            />
            <Input
              label="Grade"
              type="select"
              value={formData.grade || ""}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value as any })
              }
              options={[
                { value: "MAA", label: "MAA" },
                { value: "MAB", label: "MAB" },
                { value: "MCA", label: "MCA" },
                { value: "MCB", label: "MCB" },
                { value: "PR", label: "PR" },
              ]}
              required
            />
            <Input
              label="Research Domain"
              value={formData.research_domain || ""}
              onChange={(e) =>
                setFormData({ ...formData, research_domain: e.target.value })
              }
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isResponsible"
                checked={formData.is_responsible || false}
                onChange={(e) =>
                  setFormData({ ...formData, is_responsible: e.target.checked })
                }
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label htmlFor="isResponsible">
                Is Master's Program Responsible
              </label>
            </div>
          </div>
        );

      case "Company":
        return (
          <div className="space-y-4">
            <Input
              label="Company Name"
              value={formData.company_name || ""}
              onChange={(e) =>
                setFormData({ ...formData, company_name: e.target.value })
              }
              required
            />
            <Input
              label="Industry"
              value={formData.industry || ""}
              onChange={(e) =>
                setFormData({ ...formData, industry: e.target.value })
              }
              required
            />
            <Input
              label="Address"
              type="textarea"
              value={formData.address || ""}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {id ? "Edit User" : "Add New User"}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/users")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <Input
                label="Surname"
                value={formData.surname}
                onChange={(e) =>
                  setFormData({ ...formData, surname: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    role: e.target.value as UserFormData["role"],
                  })
                }
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
                required
              >
                <option value="Student">Student</option>
                <option value="Teacher">Teacher</option>
                <option value="Administrator">Administrator</option>
                <option value="Company">Company</option>
              </select>
            </div>

            {!id && (
              <Input
                label="Password"
                type="password"
                value={formData.password || ""}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!id}
                minLength={8}
              />
            )}

            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth || ""}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
            />

            {/* Role-specific fields */}
            {getRoleSpecificFields()}
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-8 py-6 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/dashboard/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : id ? "Save Changes" : "Add User"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
