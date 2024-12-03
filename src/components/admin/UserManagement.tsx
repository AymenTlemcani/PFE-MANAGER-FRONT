import React, { useState, useEffect, useRef } from "react";
import { UserPlus, Upload, PenSquare, Trash2, Search } from "lucide-react";
import { Button, Dialog, Input } from "../ui";
import { SnackbarManager, SnackbarItem } from "../ui/SnackbarManager";
import { useTranslation } from "../../hooks/useTranslation";

type UserRole = "student" | "teacher" | "company" | "admin";

interface UserListProps {
  users: User[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}

export function UserManagement() {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userType, setUserType] = useState<UserRole>("student");
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      firstName: "Aymen",
      lastName: "Tlemcani",
      email: "aymen@example.com",
      role: "student",
    },
    {
      id: "11",
      firstName: "Aymen",
      lastName: "Tlemcani",
      email: "Tlemcani@example.com",
      role: "student",
    },
    {
      id: "111",
      firstName: "Aymen",
      lastName: "Tlemcani",
      email: "etudiant@example.com",
      role: "student",
    },
    {
      id: "1111",
      firstName: "Aymen",
      lastName: "Tlemcani",
      email: "salaheddine@example.com",
      role: "student",
    },
    {
      id: "2",
      firstName: "Asma",
      lastName: "Amraoui",
      email: "AmraouiAsma@example.com",
      role: "teacher",
    },
    {
      id: "3",
      firstName: "Admin",
      lastName: "Aymen",
      email: "adminaymen@example.com",
      role: "admin",
    },
    {
      id: "4",
      firstName: "Company",
      lastName: "Rep",
      email: "company@example.com",
      role: "company",
    },
  ]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

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

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const formatMessage = (template: string, name: string) => {
    return template.replace("{name}", name);
  };

  // Update the confirmDelete function
  const confirmDelete = () => {
    if (selectedUser) {
      const userIndex = users.findIndex((u) => u.id === selectedUser.id);
      if (userIndex !== -1) {
        const deletedUser = users[userIndex];
        const deletedUserState = {
          user: deletedUser,
          index: userIndex,
          users: [...users], // Store current users state
        };

        setUsers(users.filter((u) => u.id !== selectedUser.id));
        setIsDeleteDialogOpen(false);

        // Create undo function with closure over deleted user state
        const undoDelete = () => {
          const newUsers = [...usersRef.current];
          newUsers.splice(deletedUserState.index, 0, deletedUserState.user);
          setUsers(newUsers);
        };

        showSnackbar(
          formatMessage(
            t.userManagement.userDeleted,
            `${selectedUser.firstName} ${selectedUser.lastName}`
          ),
          "success",
          undoDelete
        );
      }
    }
  };

  const onSaveUser = (userData: Omit<User, "id">) => {
    if (selectedUser) {
      // Edit existing user
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id ? { ...userData, id: selectedUser.id } : u
        )
      );
      showSnackbar(
        formatMessage(
          t.userManagement.userUpdated,
          `${userData.firstName} ${userData.lastName}`
        )
      );
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Date.now().toString(), // Simple ID generation
      };
      setUsers([...users, newUser]);
      showSnackbar(
        formatMessage(
          t.userManagement.userAdded,
          `${userData.firstName} ${userData.lastName}`
        )
      );
    }
    setIsUserModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Import Users</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserRole)}
              className="rounded-md border border-gray-300 px-3 py-2"
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
                className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
            <p className="text-sm text-gray-600">
              Selected file: {selectedFile.name}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">User List</h3>
        <UserList
          users={users}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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
  });

  useEffect(() => {
    // Reset form data when dialog opens with user data or empty for new user
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      role: user?.role || "student",
    });
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="company">Company</option>
          <option value="admin">Admin</option>
        </select>
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

function UserList({ users, onEditUser, onDeleteUser }: UserListProps) {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  const filteredUsers = users.filter((user) => {
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchEmail.toLowerCase());
    const roleMatch = selectedRole === "all" || user.role === selectedRole;
    return emailMatch && roleMatch;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Search by email..."
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value)}
            className="pr-10"
          />
          <Search className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value as UserRole | "all")}
          className="rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="all">All Users</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="company">Companies</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
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
    </div>
  );
}
