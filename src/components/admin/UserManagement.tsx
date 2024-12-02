import React, { useState } from "react";
import { UserPlus, Upload, PenSquare, Trash2, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

type UserRole = "student" | "teacher" | "company" | "admin";

export function UserManagement() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userType, setUserType] = useState<UserRole>("student");

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        <Button onClick={() => {}} className="flex items-center gap-2">
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
        <UserList />
      </div>
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

function UserList() {
  const [searchEmail, setSearchEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  const users: User[] = [
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "student",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      role: "teacher",
    },
    {
      id: "3",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: "admin",
    },
    {
      id: "4",
      firstName: "Company",
      lastName: "Rep",
      email: "company@example.com",
      role: "company",
    },
  ];

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
                      onClick={() => {}}
                    >
                      <PenSquare className="h-4 w-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => {}}
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
