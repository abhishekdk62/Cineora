

const ADMIN_OWNERS = {
  BASE: '/admin/owners' as const,
  REQUESTS: '/admin/owners/requests' as const,
  COUNTS: '/admin/owners/counts' as const,
  ACCEPT_REQUEST: (id: string) => `/admin/owners/requests/${id}/accept`,
  REJECT_REQUEST: (id: string) => `/admin/owners/requests/${id}/reject`,
  TOGGLE_STATUS: (id: string) => `/admin/owners/${id}/toggle-status`,
};

export default ADMIN_OWNERS;

export type AdminOwnersRoutes = typeof ADMIN_OWNERS;
