
const OWNER_PAYOUT = {
  CREATE_ORDER: '/owner/payout/create-order' as const,
  CONFIRM_ORDER: '/owner/payout/confirm' as const,
};

export default OWNER_PAYOUT;

export type OwnerMoviesRoutes = typeof OWNER_PAYOUT;
