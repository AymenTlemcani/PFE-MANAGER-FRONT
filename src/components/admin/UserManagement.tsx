import React, { useState, useEffect, useRef } from "react";
import {
  UserPlus,
  Upload,
  PenSquare,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  RefreshCw, // Add this import
  Star, // Add Star to imports
} from "lucide-react";
import { Button, Dialog, Input } from "../ui";
import { SnackbarManager, SnackbarItem } from "../ui/SnackbarManager";
import { useTranslation } from "../../hooks/useTranslation";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios"; // Change this import
import { useNavigate } from "react-router-dom";
import { Translation } from "../../i18n/types";

type UserRole = "student" | "teacher" | "company" | "admin";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  onPageChange: (page: number, search?: string, role?: string) => void;
  onSort: (field: SortField) => void;
  sortConfig: { field: SortField; direction: SortDirection } | null;
  currentRole?: string; // Add this line
}

type SortField = "firstName" | "lastName" | "email" | "role";
type SortDirection = "asc" | "desc";

interface RelatedModels {
  administrator?: {
    admin_id: number;
    user_id: number;
    name: string;
    surname: string;
  };
  teacher?: {
    teacher_id: number;
    user_id: number;
    name: string;
    surname: string;
    is_responsible: boolean;
  };
  student?: {
    student_id: number;
    user_id: number;
    name: string;
    surname: string;
  };
  company?: {
    company_id: number;
    user_id: number;
    company_name: string;
    contact_name: string;
    contact_surname: string;
  };
}

interface ApiUser extends RelatedModels {
  user_id: number;
  email: string;
  role: "Administrator" | "Teacher" | "Student" | "Company";
  is_active: boolean;
  temporary_password_expiration: string | null;
  language_preference: "French" | "English";
  date_of_birth: string | null;
}

interface ApiResponse {
  data: ApiUser[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  filters: {
    search?: string;
    role?: string;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isResponsible?: boolean;
}

interface PaginatedResponse {
  current_page: number;
  data: ApiUser[];
  first_page_url: string;
  from: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ImportStats {
  total_records: number;
  successful_imports: number;
  failed_imports: number;
}

interface ImportError {
  row: number;
  email: string;
  error: string;
  data: any;
}

export function UserManagement() {
  const navigate = useNavigate();
  // Add this debug log at the very start of component
  console.log("UserManagement rendering start");

  console.log("UserManagement - Component mounting");

  const { t } = useTranslation(); // Make sure this is at the top of component
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userType, setUserType] = useState<UserRole>("student");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [sortConfig, setSortConfig] = useState<{
    field: SortField;
    direction: SortDirection;
  } | null>(null);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [importErrors, setImportErrors] = useState<ImportError[]>([]);
  const [showErrors, setShowErrors] = useState(false);
  const [currentRole, setCurrentRole] = useState<string>("all"); // Add this state

  // Add a ref to store the latest users state
  const usersRef = useRef(users);
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  const showSnackbar = (
    message: string,
    type: "success" | "error" = "success",
    onUndo?: () => void
  ) => {
    const id = Date.now().toString();
    const newSnackbar: SnackbarItem = {
      id,
      message,
      type,
      onUndo,
    };
    setSnackbars((prev) => [...prev, newSnackbar]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeSnackbar(id);
    }, 5000);
  };

  const removeSnackbar = (id: string) => {
    setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file extension
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if (
        fileExtension === "csv" ||
        fileExtension === "xlsx" ||
        fileExtension === "xls"
      ) {
        setSelectedFile(file);
      } else {
        showSnackbar(
          "Please select a CSV or Excel file (.csv, .xlsx, .xls)",
          "error"
        );
      }
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("type", userType);

    try {
      setIsLoading(true);
      const response = await api.post(API_ENDPOINTS.users.import, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImportStats(response.data.statistics);
      setImportErrors(response.data.errors || []);

      showSnackbar(
        `${t.userManagement.importSuccessful}: ${response.data.statistics.successful_imports}`,
        "success"
      );

      await refreshUsers();
    } catch (error) {
      console.error("Import error:", error);
      showSnackbar(t.userManagement.importError, "error");
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  const handleAddUser = () => {
    navigate("/dashboard/users/new");
  };

  const handleEditUser = (user: User) => {
    navigate(`/dashboard/users/edit/${user.id}`);
  };

  const handleDeleteUser = async (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const formatMessage = (template: string, name: string) => {
    return template.replace("{name}", name);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setIsLoading(true);
      await api.delete(API_ENDPOINTS.users.delete(Number(selectedUser.id)));
      showSnackbar(
        `Successfully deleted ${selectedUser.firstName} ${selectedUser.lastName}`
      );
      await refreshUsers(); // Replace the direct fetchUsers call
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete user error:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to delete user",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSaveUser = async (userData: Omit<User, "id">) => {
    try {
      setIsLoading(true);

      // Format the data according to the backend expectations
      const formattedData = {
        email: userData.email,
        is_active: true,
        language_preference: userData.language || "French",
        // Add role-specific data
        ...(userData.role === "Student" && {
          student: {
            name: userData.firstName,
            surname: userData.lastName,
            master_option: userData.masterOption,
            overall_average: userData.overallAverage,
            admission_year: userData.admissionYear,
            date_of_birth: userData.dateOfBirth,
          },
        }),
        ...(userData.role === "Teacher" && {
          teacher: {
            name: userData.firstName,
            surname: userData.lastName,
            grade: userData.grade,
            research_domain: userData.researchDomain,
            is_responsible: userData.isResponsible,
            date_of_birth: userData.dateOfBirth,
          },
        }),
        ...(userData.role === "Administrator" && {
          administrator: {
            name: userData.firstName,
            surname: userData.lastName,
            date_of_birth: userData.dateOfBirth,
          },
        }),
        ...(userData.role === "Company" && {
          company: {
            company_name: userData.companyName,
            contact_name: userData.firstName,
            contact_surname: userData.lastName,
            industry: userData.industry,
            address: userData.address,
          },
        }),
      };

      if (selectedUser) {
        // Edit existing user
        await api.put(
          API_ENDPOINTS.users.update(Number(selectedUser.id)),
          formattedData
        );
        showSnackbar(
          `Successfully updated ${userData.firstName} ${userData.lastName}`
        );
      } else {
        // Add new user
        await api.post(API_ENDPOINTS.users.create, {
          ...formattedData,
          password: userData.password, // Include password only for new users
          role: userData.role,
        });
        showSnackbar(
          `Successfully added ${userData.firstName} ${userData.lastName}`
        );
      }

      fetchUsers(pagination.currentPage);
      setIsUserModalOpen(false);
    } catch (error) {
      console.error("Save user error:", error);
      showSnackbar(
        error.response?.data?.message || "Failed to save user",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const mapApiUserToUser = (apiUser: ApiUser): User => {
    let firstName = "";
    let lastName = "";

    switch (apiUser.role) {
      case "Student":
        firstName = apiUser.student?.name || "";
        lastName = apiUser.student?.surname || "";
        break;
      case "Teacher":
        firstName = apiUser.teacher?.name || "";
        lastName = apiUser.teacher?.surname || "";
        break;
      case "Administrator":
        firstName = apiUser.administrator?.name || "";
        lastName = apiUser.administrator?.surname || "";
        break;
      case "Company":
        firstName = apiUser.company?.contact_name || "";
        lastName = apiUser.company?.contact_surname || "";
        break;
    }

    return {
      id: apiUser.user_id.toString(),
      firstName,
      lastName,
      email: apiUser.email,
      role: apiUser.role,
      isActive: apiUser.is_active,
      isResponsible: apiUser.teacher?.is_responsible || false,
      language: apiUser.language_preference,
      dateOfBirth: apiUser.date_of_birth,
      additionalInfo: {
        ...(apiUser.student && {
          masterOption: apiUser.student.master_option,
          overallAverage: apiUser.student.overall_average,
          admissionYear: apiUser.student.admission_year,
        }),
        ...(apiUser.teacher && {
          grade: apiUser.teacher.grade,
          researchDomain: apiUser.teacher.research_domain,
        }),
        ...(apiUser.company && {
          companyName: apiUser.company.company_name,
          industry: apiUser.company.industry,
          address: apiUser.company.address,
        }),
      },
    };
  };

  // Update the fetchUsers function to properly handle the "all" role
  const fetchUsers = async (
    page: number,
    search?: string,
    role?: string,
    sortField?: string,
    sortDirection?: string
  ) => {
    console.log("fetchUsers - Starting fetch:", { page, search, role });
    setIsLoading(true);

    // Update currentRole state, using "all" when role is undefined or "all"
    setCurrentRole(role || "all");

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "10",
        ...(search && { search }),
        // Only add role parameter if it's not "all"
        ...(role && role !== "all" && { role }),
        ...(sortField && { sort_by: sortField }),
        ...(sortDirection && { sort_direction: sortDirection }),
        with: "administrator,teacher,student,company",
      });

      const url = `/users?${params}`;
      console.log("Fetching from URL:", url);

      const response = await api.get<ApiResponse>(url);
      console.log("API Response:", response.data);

      const mappedUsers = response.data.data.map(mapApiUserToUser);
      setUsers(mappedUsers);

      // Update pagination using the correct response structure
      setPagination({
        currentPage: response.data.pagination.current_page,
        totalPages: response.data.pagination.last_page,
        totalItems: response.data.pagination.total,
        pageSize: response.data.pagination.per_page,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Failed to fetch users", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    setSortConfig((current) => {
      const direction =
        current?.field === field && current.direction === "asc"
          ? "desc"
          : "asc";
      return { field, direction };
    });

    // Refetch with new sort parameters
    fetchUsers(pagination.currentPage, undefined, undefined, field, direction);
  };

  useEffect(() => {
    console.log("UserManagement - Initial fetch effect running");
    fetchUsers(1);
  }, []);

  const handlePageChange = (page: number, search?: string, role?: string) => {
    fetchUsers(page, search, role);
  };

  // Add a loading overlay component
  const LoadingOverlay = () => (
    <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Loading...
        </span>
      </div>
    </div>
  );

  // Modify the fetchUsers function to be reusable
  const refreshUsers = async () => {
    setSelectedFile(null);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    await fetchUsers(1, undefined, undefined);
  };

  const handleRefresh = () => {
    refreshUsers();
  };

  const ImportSummary = () => {
    if (!importStats) return null;

    return (
      <div className="mt-6 space-y-4">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white">
          {t.userManagement.importSummary}
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {importStats.total_records}
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              {t.userManagement.totalRecords}
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {importStats.successful_imports}
            </div>
            <div className="text-sm text-green-600 dark:text-green-400">
              {t.userManagement.importSuccessful}
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-700 dark:text-red-300">
              {importStats.failed_imports}
            </div>
            <div className="text-sm text-red-600 dark:text-red-400">
              {t.userManagement.importFailed}
            </div>
          </div>
        </div>

        {importErrors.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowErrors(!showErrors)}
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
            >
              {showErrors
                ? t.userManagement.hideErrors
                : t.userManagement.viewErrors}
              <ChevronDown
                className={`h-4 w-4 transform ${
                  showErrors ? "rotate-180" : ""
                }`}
              />
            </button>

            {showErrors && (
              <div className="mt-4 border border-red-200 dark:border-red-800 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-red-200 dark:divide-red-800">
                  <thead className="bg-red-50 dark:bg-red-900/20">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 dark:text-red-300">
                        {t.userManagement.rowNumber}
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 dark:text-red-300">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-red-700 dark:text-red-300">
                        {t.userManagement.errorMessage}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-red-200 dark:divide-red-800">
                    {importErrors.map((error, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {error.row}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {error.email}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-300">
                          {error.error}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 relative">
      {isLoading && <LoadingOverlay />}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {t.userManagement.title}
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {t.userManagement.refresh}
          </Button>
          <Button
            onClick={() => navigate("/dashboard/users/all")}
            variant="outline"
            className="flex items-center gap-2"
          >
            {t.userManagement.seeAllUsers}
          </Button>
          <Button onClick={handleAddUser} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            {t.userManagement.addUser}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t.userManagement.importSection}
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserRole)}
              className="w-48 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              <option value="student">{t.userManagement.students}</option>
              <option value="teacher">{t.userManagement.teachers}</option>
              <option value="company">{t.userManagement.companies}</option>
            </select>

            <div className="flex-1">
              <style>
                {`
                  input[type="file"]::file-selector-button {
                    content: "${t.userManagement.chooseFile}";
                  }
                `}
              </style>
              <Input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
                className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
                placeholder={t.userManagement.noFileChosen}
                data-text={
                  selectedFile
                    ? selectedFile.name
                    : t.userManagement.noFileChosen
                }
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {t.userManagement.import}
            </Button>
          </div>

          {selectedFile && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t.userManagement.selectedFile}: {selectedFile.name}
            </p>
          )}

          {importStats && <ImportSummary />}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          {t.userManagement.userList}
        </h3>
        <UserList
          users={users}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortConfig={sortConfig}
          currentRole={currentRole} // Add this prop
        />
      </div>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t.userManagement.deleteUser}
        description={`${t.userManagement.deleteConfirm} ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        confirmText={t.userManagement.deleteUser}
        confirmVariant="danger"
        onConfirm={confirmDelete}
      />

      <SnackbarManager snackbars={snackbars} onClose={removeSnackbar} />
    </div>
  );
}

const getRoleTranslation = (role: string, t: Translation) => {
  switch (role.toLowerCase()) {
    case "student":
      return t.userManagement.roles.student;
    case "teacher":
      return t.userManagement.roles.teacher;
    case "administrator":
      return t.userManagement.roles.administrator;
    case "company":
      return t.userManagement.roles.company;
    default:
      return role;
  }
};

// Export the function so it can be imported by other components
export const getRoleBadgeStyle = (
  role: string,
  isResponsible: boolean = false
) => {
  switch (role.toLowerCase()) {
    case "student":
      return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800/50";
    case "teacher":
      return isResponsible
        ? "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800/50"
        : "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800/50";
    case "administrator":
      return "bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800/50";
    case "company":
      return "bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800/50";
    default:
      return "bg-gray-100 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-800/50";
  }
};

function UserList({
  users,
  onEditUser,
  onDeleteUser,
  pagination,
  onPageChange,
  onSort,
  sortConfig,
  currentRole = "all", // Add this prop with default value
}: UserListProps) {
  const { t } = useTranslation(); // Add this line to get translations in UserList component
  const [searchEmail, setSearchEmail] = useState("");
  // Update the type to include "all" explicitly and match backend role names
  const [selectedRole, setSelectedRole] = useState<
    "all" | "Administrator" | "Teacher" | "Student" | "Company"
  >(currentRole as "all" | "Administrator" | "Teacher" | "Student" | "Company");

  // Add an effect to sync the selectedRole with currentRole
  useEffect(() => {
    setSelectedRole(
      currentRole as "all" | "Administrator" | "Teacher" | "Student" | "Company"
    );
  }, [currentRole]);

  const debouncedSearch = useRef<NodeJS.Timeout>();

  // Handle search with debounce
  const handleSearch = (value: string) => {
    setSearchEmail(value);
    if (debouncedSearch.current) {
      clearTimeout(debouncedSearch.current);
    }
    debouncedSearch.current = setTimeout(() => {
      onPageChange(1, value, selectedRole); // Reset to first page when searching
    }, 300);
  };

  // Handle role filter
  const handleRoleChange = (
    role: "all" | "Administrator" | "Teacher" | "Student" | "Company"
  ) => {
    const normalizedRole = role === "all" ? undefined : role;
    setSelectedRole(role);
    onPageChange(1, searchEmail, normalizedRole); // Pass undefined instead of "all"
  };

  // Remove client-side filtering since we're using server-side filtering
  const filteredUsers = users;

  const renderPaginationButtons = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    const { currentPage, totalPages } = pagination;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {startPage > 1 && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(1)}
              className="min-w-[2.5rem]"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="min-w-[2.5rem]"
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages - 1 && <span className="px-2">...</span>}
        {endPage < totalPages && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            className="min-w-[2.5rem]"
          >
            {totalPages}
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField;
    children: React.ReactNode;
  }) => {
    const isSorted = sortConfig?.field === field;
    const direction = sortConfig?.direction;

    return (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center gap-2">
          {children}
          <div className="flex flex-col">
            <ChevronUp
              className={`h-3 w-3 ${
                isSorted && direction === "asc"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />
            <ChevronDown
              className={`h-3 w-3 ${
                isSorted && direction === "desc"
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            />
          </div>
        </div>
      </th>
    );
  };

  useEffect(() => {
    // Reset search and role when parent component triggers refresh
    setSearchEmail("");
    setSelectedRole("all");
  }, [users]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder={t.userManagement.searchEmail}
            value={searchEmail}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
          />
          <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={currentRole} // Changed from selectedRole to currentRole
          onChange={(e) =>
            handleRoleChange(
              e.target.value as
                | "all"
                | "Administrator"
                | "Teacher"
                | "Student"
                | "Company"
            )
          }
          className="w-48 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
        >
          <option value="all">{t.userManagement.allUsers}</option>
          <option value="Administrator">
            {t.userManagement.administrators}
          </option>
          <option value="Teacher">{t.userManagement.teachers}</option>
          <option value="Student">{t.userManagement.students}</option>
          <option value="Company">{t.userManagement.companies}</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <SortableHeader field="firstName">
                {t.userManagement.name}
              </SortableHeader>
              <SortableHeader field="email">
                {t.userManagement.email}
              </SortableHeader>
              <SortableHeader field="role">
                {t.userManagement.role}
              </SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {t.userManagement.actions}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeStyle(
                      user.role,
                      user.role === "Teacher" && user.isResponsible
                    )}`}
                  >
                    {getRoleTranslation(user.role, t)}
                    {user.isResponsible && user.role === "Teacher" && (
                      <Star className="h-3 w-3 fill-current" />
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => onEditUser(user)}
                    >
                      <PenSquare className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add pagination controls */}
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {pagination.totalItems === 0 ? (
            t.userManagement.noResults
          ) : (
            <>
              {t.userManagement.showing}{" "}
              <span className="font-medium">
                {(pagination.currentPage - 1) * pagination.pageSize + 1}
              </span>{" "}
              -{" "}
              <span className="font-medium">
                {Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalItems
                )}
              </span>{" "}
              {t.userManagement.of}{" "}
              <span className="font-medium">{pagination.totalItems}</span>{" "}
              {t.userManagement.results}
            </>
          )}
        </div>
        {pagination.totalPages > 1 && (
          <div className="mt-2 sm:mt-0">{renderPaginationButtons()}</div>
        )}
      </div>
    </div>
  );
}
