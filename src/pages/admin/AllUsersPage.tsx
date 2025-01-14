import React, { useState, useEffect, useRef, useMemo } from "react";
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
  Search,
  SortAsc,
  SortDesc,
  Filter,
  LayoutGrid,
  List,
  BadgeCheck,
  Mail,
  Calendar,
  GraduationCap,
  Briefcase,
  Building2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import {
  SnackbarManager,
  SnackbarItem,
} from "../../components/ui/SnackbarManager";
import { useTranslation } from "../../hooks/useTranslation";
import { getRoleBadgeStyle } from "../../components/admin/UserManagement";

export function AllUsersPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("role");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(
    new Set(["Student", "Teacher", "Administrator", "Company"])
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showOnlyResponsibles, setShowOnlyResponsibles] = useState(false);

  const showResponsibleFilter = useMemo(() => {
    return selectedRoles.has("Teacher") && selectedRoles.size === 1;
  }, [selectedRoles]);

  const loadUsers = async (pageNum: number, append = false) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: pageNum.toString(),
        per_page: "50",
        with: "administrator,teacher,student,company",
        ...(searchQuery && { search: searchQuery }),
        ...(sortField && { sort_by: sortField }),
        ...(sortDirection && { sort_direction: sortDirection }),
      });

      const response = await api.get(`/users?${params}`);
      console.log("API Response:", response.data); // Debug log
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
      showSnackbar("Failed to load users", "error");
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

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(
      (user) =>
        selectedRoles.has(user.role) &&
        (searchQuery === "" ||
          getUserFullName(user)
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (!showOnlyResponsibles ||
          (user.role === "Teacher" && user.teacher?.is_responsible))
    );

    return filtered;
  }, [users, selectedRoles, searchQuery, showOnlyResponsibles]);

  const groupedUsers = useMemo(() => {
    return filteredAndSortedUsers.reduce((acc, user) => {
      const role = user.role;
      if (!acc[role]) {
        acc[role] = [];
      }
      acc[role].push(user);
      return acc;
    }, {} as Record<string, typeof users>);
  }, [filteredAndSortedUsers]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => {
      const newRoles = new Set(prev);
      if (newRoles.has(role)) {
        newRoles.delete(role);
      } else {
        newRoles.add(role);
      }
      return newRoles;
    });
  };

  const selectableUsers = useMemo(() => {
    return filteredAndSortedUsers.filter(
      (user) => user.user_id !== currentUserId
    );
  }, [filteredAndSortedUsers, currentUserId]);

  const isAllSelected = useMemo(() => {
    return (
      selectableUsers.length > 0 &&
      selectedUsers.size === selectableUsers.length
    );
  }, [selectableUsers, selectedUsers]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(
        new Set(selectableUsers.map((user) => String(user.user_id)))
      );
    }
  };

  const getRoleSpecificInfo = (user: any) => {
    try {
      switch (user.role) {
        case "Student":
          return {
            icon: <GraduationCap className="h-4 w-4" />,
            details: [
              {
                label: "Master Option",
                value: user.student?.master_option || "N/A",
              },
              {
                label: "Average",
                value: user.student?.overall_average
                  ? Number(user.student.overall_average).toFixed(2)
                  : "N/A",
              },
              {
                label: "Year",
                value: user.student?.admission_year || "N/A",
              },
            ],
          };
        case "Teacher":
          return {
            icon: <GraduationCap className="h-4 w-4" />,
            details: [
              { label: "Grade", value: user.teacher?.grade || "N/A" },
              {
                label: "Domain",
                value: user.teacher?.research_domain || "N/A",
              },
              {
                label: "Recruited",
                value:
                  new Date(user.teacher?.recruitment_date).getFullYear() ||
                  "N/A",
              },
            ],
          };
        case "Company":
          return {
            icon: <Building2 className="h-4 w-4" />,
            details: [
              { label: "Company", value: user.company?.company_name || "N/A" },
              { label: "Industry", value: user.company?.industry || "N/A" },
              { label: "Location", value: user.company?.address || "N/A" },
            ],
          };
        default:
          return {
            icon: <Briefcase className="h-4 w-4" />,
            details: [],
          };
      }
    } catch (error) {
      console.error("Error getting role specific info:", error);
      return {
        icon: <Briefcase className="h-4 w-4" />,
        details: [{ label: "Error", value: "Failed to load details" }],
      };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t.allUsers.title}
            </h2>
            {selectedUsers.size > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUsers.size} {t.allUsers.selected}
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
                {t.allUsers.deleteSelected}
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
              {t.allUsers.refresh}
            </Button>
            <button
              onClick={() => navigate("/dashboard/users")}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="px-8 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.allUsers.searchUsers}
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                />
                <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex gap-2 items-center">
                {[
                  { key: "Student", label: t.allUsers.students },
                  { key: "Teacher", label: t.allUsers.teachers },
                  { key: "Administrator", label: t.allUsers.administrators },
                  { key: "Company", label: t.allUsers.companies },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => toggleRole(key)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedRoles.has(key)
                        ? getRoleBadgeStyle(
                            key,
                            key === "Teacher" && showOnlyResponsibles
                          )
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {label}
                  </button>
                ))}
                {showResponsibleFilter && (
                  <button
                    onClick={() => setShowOnlyResponsibles((prev) => !prev)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      showOnlyResponsibles
                        ? getRoleBadgeStyle("Teacher", true)
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    <BadgeCheck className="h-4 w-4" />
                    {t.allUsers.onlyResponsibles}
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Select All Button Bar - Only show when users are selected or filtered users exist */}
        {(selectedUsers.size > 0 || selectableUsers.length > 0) && (
          <div className="px-8 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
                {t.allUsers.selectAll} ({selectableUsers.length})
              </button>
              {selectedUsers.size > 0 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedUsers.size} {t.allUsers.selected}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {viewMode === "grid" ? (
            // Grid View
            <div className="space-y-8">
              {Object.entries(groupedUsers).map(([role, roleUsers]) => (
                <div key={role} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    {t.userManagement.roles[role.toLowerCase()]}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({roleUsers.length})
                    </span>
                  </h3>
                  <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {roleUsers.map((user, index) => {
                      const roleInfo = getRoleSpecificInfo(user);
                      return (
                        <div
                          key={user.user_id}
                          ref={
                            index === roleUsers.length - 1
                              ? lastUserElementRef
                              : null
                          }
                          className={`p-4 border rounded-lg transition-colors hover:border-blue-500 ${
                            selectedUsers.has(String(user.user_id))
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => handleSelectUser(user.user_id)}
                                disabled={user.user_id === currentUserId}
                                className="flex-none mt-1"
                              >
                                {selectedUsers.has(String(user.user_id)) ? (
                                  <CheckSquare className="h-5 w-5" />
                                ) : (
                                  <Square className="h-5 w-5" />
                                )}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-medium truncate">
                                    {getUserFullName(user)}
                                  </h4>
                                  {user.role === "Teacher" &&
                                    user.teacher?.is_responsible && (
                                      <BadgeCheck
                                        className="h-4 w-4 text-blue-500 flex-shrink-0"
                                        title="Program Responsible"
                                      />
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                              </div>
                              <span
                                className={`px-2.5 py-0.5 text-xs rounded-full ${getRoleBadgeStyle(
                                  user.role,
                                  user.role === "Teacher" &&
                                    user.teacher?.is_responsible
                                )}`}
                              >
                                {
                                  t.userManagement.roles[
                                    user.role.toLowerCase()
                                  ]
                                }
                              </span>
                            </div>

                            <div className="pl-8">
                              <div className="text-sm space-y-1">
                                {roleInfo.details.map((detail, i) => {
                                  // Translate the labels
                                  const label = (() => {
                                    switch (detail.label) {
                                      case "Master Option":
                                        return t.allUsers.masterOption;
                                      case "Average":
                                        return t.allUsers.average;
                                      case "Year":
                                        return t.allUsers.year;
                                      case "Grade":
                                        return t.allUsers.grade;
                                      case "Domain":
                                        return t.allUsers.domain;
                                      case "Recruited":
                                        return t.allUsers.recruited;
                                      case "Company":
                                        return t.allUsers.company;
                                      case "Industry":
                                        return t.allUsers.industry;
                                      case "Location":
                                        return t.allUsers.location;
                                      default:
                                        return detail.label;
                                    }
                                  })();

                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="text-gray-500">
                                        {label}:
                                      </span>
                                      <span className="font-medium">
                                        {detail.value}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-center p-4">
                  <Loader className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              )}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {Object.entries(groupedUsers).map(([role, roleUsers]) => (
                <div key={role} className="space-y-2">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {t.userManagement.roles[role.toLowerCase()]}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ({roleUsers.length})
                    </span>
                  </h3>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {roleUsers.map((user, index) => {
                      const roleInfo = getRoleSpecificInfo(user);
                      return (
                        <div
                          key={user.user_id}
                          ref={
                            index === roleUsers.length - 1
                              ? lastUserElementRef
                              : null
                          }
                          className={`py-4 transition-colors ${
                            selectedUsers.has(String(user.user_id))
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => handleSelectUser(user.user_id)}
                              disabled={user.user_id === currentUserId}
                              className="flex-none mt-1"
                            >
                              {selectedUsers.has(String(user.user_id)) ? (
                                <CheckSquare className="h-5 w-5" />
                              ) : (
                                <Square className="h-5 w-5" />
                              )}
                            </button>
                            <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {getUserFullName(user)}
                                  </span>
                                  {user.role === "Teacher" &&
                                    user.teacher?.is_responsible && (
                                      <BadgeCheck
                                        className="h-4 w-4 text-blue-500"
                                        title="Program Responsible"
                                      />
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <Mail className="h-3 w-3" />
                                  <span className="truncate">{user.email}</span>
                                </div>
                              </div>
                              <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                                {roleInfo.details.map((detail, i) => {
                                  // Translate the labels
                                  const label = (() => {
                                    switch (detail.label) {
                                      case "Master Option":
                                        return t.allUsers.masterOption;
                                      case "Average":
                                        return t.allUsers.average;
                                      case "Year":
                                        return t.allUsers.year;
                                      case "Grade":
                                        return t.allUsers.grade;
                                      case "Domain":
                                        return t.allUsers.domain;
                                      case "Recruited":
                                        return t.allUsers.recruited;
                                      case "Company":
                                        return t.allUsers.company;
                                      case "Industry":
                                        return t.allUsers.industry;
                                      case "Location":
                                        return t.allUsers.location;
                                      default:
                                        return detail.label;
                                    }
                                  })();

                                  return (
                                    <div
                                      key={i}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="text-gray-500">
                                        {label}:
                                      </span>
                                      <span className="font-medium">
                                        {detail.value}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="flex items-start justify-end">
                                <span
                                  className={`px-2.5 py-0.5 text-xs rounded-full ${getRoleBadgeStyle(
                                    user.role,
                                    user.role === "Teacher" &&
                                      user.teacher?.is_responsible
                                  )}`}
                                >
                                  {
                                    t.userManagement.roles[
                                      user.role.toLowerCase()
                                    ]
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title={t.allUsers.deleteUsers}
        description={t.allUsers.deleteConfirm}
        confirmText={isLoading ? "Deleting..." : t.allUsers.deleteSelected}
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
