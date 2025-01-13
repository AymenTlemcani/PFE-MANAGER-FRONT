import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Dialog } from "../../components/ui";
import api from "../../api/axios";
import { API_ENDPOINTS } from "../../api/endpoints";
import {
  X,
  RefreshCw,
  Trash2,
  CheckSquare,
  Square,
  Loader,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import {
  SnackbarManager,
  SnackbarItem,
} from "../../components/ui/SnackbarManager";

export function AllUsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver>();
  const lastUserElementRef = useRef<HTMLDivElement>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const currentUser = useAuthStore((state) => state.user);
  const currentUserId = currentUser?.id;
  const [snackbars, setSnackbars] = useState<SnackbarItem[]>([]);

  const loadUsers = async (pageNum: number, append = false) => {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/users?page=${pageNum}&per_page=50&with=administrator,teacher,student,company`
      );
      const newUsers = response.data.data;

      if (append) {
        setUsers((prev) => [...prev, ...newUsers]);
      } else {
        setUsers(newUsers);
      }

      setHasMore(
        response.data.pagination.current_page <
          response.data.pagination.last_page
      );
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prev) => {
          const nextPage = prev + 1;
          loadUsers(nextPage, true);
          return nextPage;
        });
      }
    });

    if (lastUserElementRef.current) {
      observer.current.observe(lastUserElementRef.current);
    }
  }, [isLoading, hasMore]);

  const handleRefresh = () => {
    setPage(1);
    loadUsers(1);
  };

  const getUserFullName = (user: any) => {
    switch (user.role) {
      case "Student":
        return `${user.student?.name || ""} ${user.student?.surname || ""}`;
      case "Teacher":
        return `${user.teacher?.name || ""} ${user.teacher?.surname || ""}`;
      case "Administrator":
        return `${user.administrator?.name || ""} ${
          user.administrator?.surname || ""
        }`;
      case "Company":
        return `${user.company?.contact_name || ""} ${
          user.company?.contact_surname || ""
        }`;
      default:
        return "N/A";
    }
  };

  const handleSelectUser = (userId: number) => {
    if (userId === currentUserId) {
      showSnackbar("You cannot delete your own account", "error");
      return;
    }
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(String(userId))) {
        newSet.delete(String(userId));
      } else {
        newSet.add(String(userId));
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      const selectableUsers = users
        .filter((user) => user.user_id !== currentUserId)
        .map((user) => String(user.user_id));
      setSelectedUsers(new Set(selectableUsers));
    }
  };

  const handleBulkDelete = async () => {
    // Check if current user is in selection
    if (Array.from(selectedUsers).includes(String(currentUserId))) {
      showSnackbar(
        "You cannot delete your own account. Please unselect it before proceeding.",
        "error"
      );
      return;
    }

    try {
      setIsLoading(true);
      await api.post(API_ENDPOINTS.users.bulkDelete, {
        user_ids: Array.from(selectedUsers),
      });

      showSnackbar(
        `Successfully deleted ${selectedUsers.size} users`,
        "success"
      );
      setSelectedUsers(new Set());
      setPage(1);
      await loadUsers(1, false);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting users:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to delete users";
      showSnackbar(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    const id = Date.now().toString();
    setSnackbars((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== id));
    }, 5000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              All Users
            </h2>
            {selectedUsers.size > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUsers.size} selected
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {selectedUsers.size > 0 && (
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <button
              onClick={() => navigate("/dashboard/users")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {selectedUsers.size === users.length ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                Select All
              </button>
            </div>

            {users.map((user, index) => (
              <div
                key={user.user_id}
                ref={index === users.length - 1 ? lastUserElementRef : null}
                className={`p-4 border rounded-lg transition-colors ${
                  selectedUsers.has(String(user.user_id))
                    ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleSelectUser(user.user_id)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    disabled={user.user_id === currentUserId}
                  >
                    {selectedUsers.has(String(user.user_id)) ? (
                      <CheckSquare className="h-5 w-5" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">
                      {getUserFullName(user)}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center p-4">
                <Loader className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="Delete Users"
        description={
          selectedUsers.size === 1
            ? "Are you sure you want to delete this user? This action cannot be undone."
            : `Are you sure you want to delete ${selectedUsers.size} users? This action cannot be undone.`
        }
        confirmText={isLoading ? "Deleting..." : "Delete"}
        confirmVariant="danger"
        onConfirm={handleBulkDelete}
        disabled={isLoading}
      />

      <SnackbarManager
        snackbars={snackbars}
        onClose={(id) =>
          setSnackbars((prev) => prev.filter((s) => s.id !== id))
        }
      />
    </div>
  );
}
