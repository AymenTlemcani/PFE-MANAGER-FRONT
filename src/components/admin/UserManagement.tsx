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
} from "lucide-react";
import { Button, Dialog, Input } from "../ui";
import { SnackbarManager, SnackbarItem } from "../ui/SnackbarManager";
import { useTranslation } from "../../hooks/useTranslation";
import axios from "axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import api from "../../api/axios"; // Change this import

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

export function UserManagement() {
  // Add this debug log at the very start of component
  console.log("UserManagement rendering start");

  console.log("UserManagement - Component mounting");

  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userType, setUserType] = useState<UserRole>("student");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
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
      setSelectedFile(file);
      // TODO: Handle CSV parsing and data import
    }
  };

  const handleImport = () => {
    if (!selectedFile) return;
    // TODO: Process the CSV file and import users
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const formatMessage = (template: string, name: string) => {
    return template.replace("{name}", name);
  };

  const confirmDelete = async () => {
    if (selectedUser) {
      try {
        await axios.delete(API_ENDPOINTS.users.delete(Number(selectedUser.id)));
        setUsers(users.filter((u) => u.id !== selectedUser.id));
        setIsDeleteDialogOpen(false);
        showSnackbar(
          formatMessage(
            t.userManagement.userDeleted,
            `${selectedUser.firstName} ${selectedUser.lastName}`
          )
        );
      } catch (error) {
        showSnackbar("Failed to delete user", "error");
      }
    }
  };

  const onSaveUser = async (userData: Omit<User, "id">) => {
    try {
      if (selectedUser) {
        // Edit existing user
        await axios.put(
          API_ENDPOINTS.users.update(Number(selectedUser.id)),
          userData
        );
      } else {
        // Add new user
        await axios.post(API_ENDPOINTS.users.create, userData);
      }
      fetchUsers(pagination.currentPage);
      setIsUserModalOpen(false);
      showSnackbar(
        formatMessage(
          selectedUser
            ? t.userManagement.userUpdated
            : t.userManagement.userAdded,
          `${userData.firstName} ${userData.lastName}`
        )
      );
    } catch (error) {
      showSnackbar("Failed to save user", "error");
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

  const fetchUsers = async (
    page: number,
    search?: string,
    role?: string,
    sortField?: string,
    sortDirection?: string
  ) => {
    console.log("fetchUsers - Starting fetch:", { page, search, role });
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: "10",
        ...(search && { search }),
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

  return (
    <div className="space-y-6">
      {isLoading && <div className="text-center py-4">Loading users...</div>}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          User Management
        </h1>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Import Users
        </h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserRole)}
              className="w-48 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
            >
              <option value="student">Students</option>
              <option value="teacher">Teachers</option>
              <option value="company">Companies</option>
            </select>

            <div className="flex-1">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 dark:file:bg-blue-900/50 file:text-blue-700 dark:file:text-blue-400 hover:file:bg-blue-100 dark:hover:file:bg-blue-900"
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={!selectedFile}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Import
            </Button>
          </div>

          {selectedFile && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          User List
        </h3>
        <UserList
          users={users}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          pagination={pagination}
          onPageChange={handlePageChange}
          onSort={handleSort}
          sortConfig={sortConfig}
        />
      </div>

      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSave={onSaveUser}
        user={selectedUser}
      />

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete User"
        description={`Are you sure you want to delete ${selectedUser?.firstName} ${selectedUser?.lastName}?`}
        confirmText="Delete"
        confirmVariant="danger"
        onConfirm={confirmDelete}
      />

      <SnackbarManager snackbars={snackbars} onClose={removeSnackbar} />
    </div>
  );
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, "id">) => void;
  user?: User | null;
}

function UserFormModal({ isOpen, onClose, onSave, user }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    isResponsible: false,
  });

  useEffect(() => {
    // Reset form data when dialog opens with user data or empty for new user
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || "student",
      isResponsible: user?.isResponsible || false,
    });
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getRoleSpecificFields = () => {
    switch (formData.role) {
      case "Student":
        return (
          <>
            <select
              value={formData.masterOption || "GL"}
              onChange={(e) =>
                setFormData({ ...formData, masterOption: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="GL">GL</option>
              <option value="IA">IA</option>
              <option value="RSD">RSD</option>
              <option value="SIC">SIC</option>
            </select>
            {/* Add other student-specific fields */}
          </>
        );
      case "Teacher":
        return (
          <>
            <select
              value={formData.grade || "MAA"}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
            >
              <option value="MAA">MAA</option>
              <option value="MAB">MAB</option>
              <option value="MCA">MCA</option>
              <option value="MCB">MCB</option>
              <option value="PR">PR</option>
            </select>
            {/* Add other teacher-specific fields */}
          </>
        );
      // Add other role cases...
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={user ? "Edit User" : "Add User"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          required
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          required
        />
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>
        {formData.role === "teacher" && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isResponsible"
              checked={formData.isResponsible}
              onChange={(e) =>
                setFormData({ ...formData, isResponsible: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded border-gray-300 dark:border-gray-600"
            />
            <label
              htmlFor="isResponsible"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              Is Master's Program Responsible
            </label>
          </div>
        )}
        {getRoleSpecificFields()}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{user ? "Save Changes" : "Add User"}</Button>
        </div>
      </form>
    </Dialog>
  );
}

function UserList({
  users,
  onEditUser,
  onDeleteUser,
  pagination,
  onPageChange,
  onSort,
  sortConfig,
}: UserListProps) {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");
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
  const handleRoleChange = (role: UserRole | "all") => {
    setSelectedRole(role);
    onPageChange(1, searchEmail, role); // Reset to first page when changing role
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

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => handleSearch(e.target.value)}
            className="pr-10"
          />
          <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value as UserRole | "all")}
          className="w-48 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100"
        >
          <option value="all">All Users</option>
          <option value="Administrator">Administrators</option>
          <option value="Teacher">Teachers</option>
          <option value="Student">Students</option>
          <option value="Company">Companies</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <SortableHeader field="firstName">Name</SortableHeader>
              <SortableHeader field="email">Email</SortableHeader>
              <SortableHeader field="role">Role</SortableHeader>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
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
                  <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800/50">
                    {user.role}
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
            "No results"
          ) : (
            <>
              Showing{" "}
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
              of <span className="font-medium">{pagination.totalItems}</span>{" "}
              results
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
