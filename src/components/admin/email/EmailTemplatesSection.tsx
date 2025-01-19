import { useEffect } from "react";
import { RefreshCw } from "lucide-react"; // Add this import
import {
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Search,
  Filter,
  Loader,
  Eye,
  AlertTriangle,
  Info,
  ArrowUpDown,
  CheckSquare,
  Square,
  ChevronUp,
  ChevronDown,
  Mail,
  Star,
  History,
  Globe,
  FileText,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Dialog } from "../../../components/ui/Dialog";
import { Tooltip } from "../../../components/ui/Tooltip";
import { useState, useCallback } from "react";
import { emailApi } from "../../../api/emailApi";
import { EmailTemplate } from "../../../types/email";
import { EmailTemplateForm } from "./EmailTemplateForm";
import { useNavigate } from "react-router-dom";
import { ContextMenu, ContextMenuItem } from "../../ui/ContextMenu";
import { useSnackbar } from "../../../hooks/useSnackbar";

interface EmailTemplatesProps {
  onAddTemplate: () => void;
}

interface SortConfig {
  field: string;
  direction: "asc" | "desc";
}

export function EmailTemplatesSection({ onAddTemplate }: EmailTemplatesProps) {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "name",
    direction: "asc",
  });
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(
    new Set()
  );
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    template: EmailTemplate;
  } | null>(null);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      console.log("📬 Fetching email templates...");
      const data = await emailApi.getTemplates();
      console.log("📨 Received templates:", data);
      setTemplates(data);
    } catch (error) {
      console.error("❌ Error fetching templates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await fetchTemplates();
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log("🔄 Initial templates load");
    fetchTemplates();
  }, []);

  const getTypeBadgeStyle = (type: string) => {
    switch (type) {
      case "System":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200";
      case "Notification":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200";
      case "Reminder":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-200";
    }
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === "all" || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  const types = ["all", "System", "Notification", "Reminder"];

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, template: any) => {
      if (e.key === "Enter" || e.key === " ") {
        setSelectedTemplate(template);
        setIsPreviewOpen(true);
      }
    },
    []
  );

  const handleDelete = (template: any) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (Array.isArray(selectedTemplate)) {
        // Handle bulk delete
        for (const templateId of selectedTemplate) {
          await emailApi.deleteTemplate(parseInt(templateId));
        }
        setSelectedTemplates(new Set());
        showSnackbar(
          `${selectedTemplate.length} templates deleted successfully`,
          "success"
        );
      } else if (selectedTemplate) {
        // Handle single template delete
        await emailApi.deleteTemplate(selectedTemplate.template_id);
        showSnackbar(
          `Template "${selectedTemplate.name}" deleted successfully`,
          "success"
        );
      }

      // Refresh templates list
      await fetchTemplates();

      // Close dialog and reset selection
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
    } catch (error: any) {
      console.error("❌ Error deleting template(s):", error);
      showSnackbar(
        error.message || "Failed to delete template(s). Please try again.",
        "error"
      );
    }
  };

  const handleSort = (field: string) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const toggleTemplateSelection = (templateId: number) => {
    setSelectedTemplates((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(templateId.toString())) {
        newSet.delete(templateId.toString());
      } else {
        newSet.add(templateId.toString());
      }
      return newSet;
    });
  };

  const toggleAllTemplates = () => {
    if (selectedTemplates.size === filteredTemplates.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(
        new Set(filteredTemplates.map((t) => t.template_id.toString()))
      );
    }
  };

  const handleBulkDelete = () => {
    setSelectedTemplate(Array.from(selectedTemplates));
    setIsDeleteDialogOpen(true);
  };

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    const direction = sortConfig.direction === "asc" ? 1 : -1;
    return a[sortConfig.field] > b[sortConfig.field] ? direction : -direction;
  });

  // Add this helper component for sortable headers
  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => {
    const isSorted = sortConfig.field === field;
    const direction = sortConfig.direction;

    return (
      <th className="px-6 py-4 text-left text-xs font-medium bg-gray-50/80 dark:bg-gray-800/80 first:rounded-tl-lg last:rounded-tr-lg border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleSort(field)}
          className="flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 font-semibold uppercase tracking-wider"
        >
          {children}
          <span className="inline-flex flex-col h-4 w-4 relative ml-1">
            <ChevronUp
              className={`h-2.5 w-2.5 -mb-0.5 ${
                isSorted && direction === "asc"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            />
            <ChevronDown
              className={`h-2.5 w-2.5 -mt-0.5 ${
                isSorted && direction === "desc"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-600"
              }`}
            />
          </span>
        </button>
      </th>
    );
  };

  const handleAddClick = () => {
    navigate("/dashboard/email-management/templates/new");
  };

  const handleFormSuccess = () => {
    fetchTemplates();
  };

  const handleContextMenu = (e: React.MouseEvent, template: EmailTemplate) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      template,
    });
  };

  const handleRowClick = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  const handleEdit = (template: EmailTemplate) => {
    navigate(
      `/dashboard/email-management/templates/edit/${template.template_id}`,
      { state: { template } } // Pass template data in navigation state
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Email Templates
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your email templates for various communications
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? "opacity-50" : ""}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button onClick={handleAddClick}>
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </Button>
        </div>
      </div>

      {selectedTemplates.size > 0 && (
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {selectedTemplates.size} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="ml-auto text-white dark:text-gray-100"
          >
            Delete Selected
          </Button>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="flex gap-4 items-center mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedType === type
                  ? type === "all"
                    ? "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    : getTypeBadgeStyle(type)
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="mx-auto h-12 w-12 text-gray-400">
            {searchQuery ? <Search /> : <Filter />}
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            {searchQuery ? "No matching templates" : "No templates yet"}
          </h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "Create your first email template to get started"}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Button
              onClick={handleAddClick}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Template
            </Button>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear Search
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-6 py-4 bg-gray-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 w-0">
                    <button
                      onClick={toggleAllTemplates}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {selectedTemplates.size === filteredTemplates.length ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </button>
                  </th>
                  <SortableHeader field="name">Name</SortableHeader>
                  <SortableHeader field="subject">Subject</SortableHeader>
                  <SortableHeader field="type">Type</SortableHeader>
                  <SortableHeader field="language">Language</SortableHeader>
                  <SortableHeader field="is_active">Status</SortableHeader>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedTemplates.map((template) => (
                  <tr
                    key={template.template_id}
                    onClick={() => handleRowClick(template)}
                    onContextMenu={(e) => handleContextMenu(e, template)}
                    className={`group transition-all duration-200 cursor-pointer ${
                      selectedTemplates.has(template.template_id.toString())
                        ? "bg-blue-50/50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50/80 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    <td
                      className="px-6 py-4 w-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() =>
                          toggleTemplateSelection(template.template_id)
                        }
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {selectedTemplates.has(
                          template.template_id.toString()
                        ) ? (
                          <CheckSquare className="h-5 w-5" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Tooltip content={template.description}>
                        <div className="flex items-center gap-2 text-gray-900 dark:text-gray-100 font-medium">
                          {template.name}
                          {template.description && (
                            <Info className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                          )}
                        </div>
                      </Tooltip>
                    </td>
                    <td className="p-4 align-middle text-gray-700 dark:text-gray-300">
                      {template.subject}
                    </td>
                    <td className="p-4 align-middle">
                      <Badge className={getTypeBadgeStyle(template.type)}>
                        {template.type}
                      </Badge>
                    </td>
                    <td className="p-4 align-middle text-gray-700 dark:text-gray-300">
                      {template.language}
                    </td>
                    <td className="p-4 align-middle">
                      {template.is_active ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          <Check className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-gray-600">
                          <X className="h-3 w-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Update Preview Dialog */}
      <Dialog
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onClickOutside={() => setIsPreviewOpen(false)}
        className="max-w-5xl w-full"
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Template Preview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  View template details and content
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {selectedTemplate && (
            <div className="space-y-6">
              {/* Template Info Grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                {/* ...existing info fields... */}
              </div>

              {/* Subject Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  Subject Line
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                    (What recipients will see)
                  </span>
                </h3>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-gray-900 dark:text-gray-100">
                  {selectedTemplate.subject}
                </div>
              </div>

              {/* Content Section - Updated styling */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  Email Content
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
                    (HTML template with placeholders)
                  </span>
                </h3>
                <div className="p-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-gray-900 dark:text-gray-100">
                    {selectedTemplate.content || (
                      <p className="text-gray-500 dark:text-gray-400 italic">
                        No content available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              {selectedTemplate.description && (
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Description
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedTemplate.description}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setIsPreviewOpen(false)}
                >
                  Close Preview
                </Button>
                <Button
                  className="flex items-center gap-2"
                  onClick={() => {
                    handleEdit(selectedTemplate);
                    setIsPreviewOpen(false);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  Edit Template
                </Button>
              </div>
            </div>
          )}
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        className="max-w-md w-full"
      >
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/50">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Confirm Deletion
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {selectedTemplates.size > 1
                  ? `Are you sure you want to delete ${selectedTemplates.size} templates?`
                  : "Are you sure you want to delete this template?"}
              </p>
            </div>
          </div>

          {selectedTemplate && !Array.isArray(selectedTemplate) && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Template Name
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {selectedTemplate.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Type
                  </span>
                  <Badge className={getTypeBadgeStyle(selectedTemplate.type)}>
                    {selectedTemplate.type}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <p className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              This action cannot be undone. All associated data will be
              permanently removed.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white dark:text-white flex items-center justify-center"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                {selectedTemplates.size > 1
                  ? `Delete ${selectedTemplates.size} Templates`
                  : "Delete Template"}
              </span>
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Add Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        >
          <ContextMenuItem
            icon={<Eye className="h-4 w-4" />}
            onClick={() => {
              setSelectedTemplate(contextMenu.template);
              setIsPreviewOpen(true);
              setContextMenu(null);
            }}
          >
            Preview
          </ContextMenuItem>
          <ContextMenuItem
            icon={<Edit className="h-4 w-4" />}
            onClick={() => {
              handleEdit(contextMenu.template);
              setContextMenu(null);
            }}
          >
            Edit
          </ContextMenuItem>
          <ContextMenuItem
            icon={<Trash2 className="h-4 w-4" />}
            onClick={() => {
              handleDelete(contextMenu.template);
              setContextMenu(null);
            }}
            destructive
          >
            Delete
          </ContextMenuItem>
        </ContextMenu>
      )}

      {/* Add Form Dialog */}
      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <EmailTemplateForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      </Dialog>
    </div>
  );
}
