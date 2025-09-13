
const ADMIN_WALLET = {
  WALLET: '/admin/wallet' as const,
  TRANSACTIONS: '/admin/transaction' as const,
};


export default ADMIN_WALLET;

export type UserWalletRoutes = typeof ADMIN_WALLET;
