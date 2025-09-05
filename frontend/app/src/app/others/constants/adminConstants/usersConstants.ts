
const ADMIN_USERS = {
  BASE: '/admin/users' as const,
  COUNTS: '/admin/users/counts' as const,
  BY_ID: (id: string) => `/admin/users/${id}`,
  TOGGLE_STATUS: (id: string) => `/admin/users/${id}/toggle-status`,
};

export default ADMIN_USERS;

export type AdminUsersRoutes = typeof ADMIN_USERS;
