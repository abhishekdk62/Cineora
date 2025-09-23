
const OWNER_STAFF = {
  CREATE: '/owner/create/staff' as const,
  VERIFY_TICKET: '/staff/verify-ticket' as const,
  GET_DETAILS: '/staff/details' as const,
};

export default OWNER_STAFF;

export type OwnerShowtimeRoutes = typeof OWNER_STAFF;
