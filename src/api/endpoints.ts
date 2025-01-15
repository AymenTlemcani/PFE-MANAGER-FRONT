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
    list: "/projects",
    create: "/projects", // Make sure this matches your Laravel route
    update: (id: number) => `/projects/${id}`,
    delete: (id: number) => `/projects/${id}`,
    validate: (id: number) => `/projects/validate/${id}`,
    supervise: "/projects/supervise",
    propose: "/project-proposals", // Update this to match your Laravel route
    proposed: "/project-proposals",
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
    periods: "/email-periods",
    templates: "/email-period-templates",
    reminders: "/email-period-reminders",
    sendReminders: "/email-period-reminders/send",
  },
  notifications: {
    list: "/notifications",
    markAsRead: (id: number) => `/notifications/${id}/read`,
  },
} as const;
