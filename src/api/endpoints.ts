export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    validateResetToken: "/auth/validate-reset-token",
    profile: "/profile",
    updateProfile: "/profile",
    changePassword: "/change-password",
    me: "/profile", // Add this line
  },
  users: {
    list: "/users", // Remove /api prefix
    create: "/users",
    update: (id: number) => `/users/${id}`,
    delete: (id: number) => `/users/${id}`,
    import: "/users/import",
    bulkDelete: "/users/bulk-delete",
  },
  projects: {
    create: "/projects",
    list: "/projects",
    propose: "/project-proposals",
    update: (id: number) => `/projects/${id}`,
    delete: (id: number) => `/projects/${id}`,
    validate: (id: number) => `/projects/validate/${id}`,
    supervise: "/projects/supervise",
    proposed: "/project-proposals",
    listByStatus: (status: string) => `/projects?status=${status}`,
    proposals: "/project-proposals",
    validateProposal: (id: number) => `/project-proposals/${id}`,
    proposalsByStatus: (status: string) =>
      `/project-proposals?status=${status}`,
    updateProposal: (id: number) => `/project-proposals/${id}`,
  },
  students: {
    list: "/students",
    pairs: "/student-pairs",
    projectChoices: "/project-choices",
  },
  defense: {
    sessions: "/defense-sessions",
    jury: {
      preferences: "/jury-preferences",
      assignments: "/jury-assignments",
      autoAssign: "/jury-assignments/auto",
    },
  },
  emails: {
    templates: "/email/templates",
    campaigns: "/email/campaigns",
    activateCampaign: (id: number) => `/email/campaigns/${id}/activate`,
    campaignLogs: (id: number) => `/email/campaigns/${id}/logs`,
    campaignReminders: (campaignId: number) =>
      `/email/campaigns/${campaignId}/reminders`,
  },
  notifications: {
    list: "/notifications",
    markAsRead: (id: number) => `/notifications/${id}/read`,
  },
} as const;
