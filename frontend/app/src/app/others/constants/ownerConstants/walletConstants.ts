


const OWNER_WALLET = {
  WALLET: '/owner/wallet' as const,
  TRANSACTIONS: '/owner/transaction' as const,
  CREDIT_TRANSACTION: '/owner/wallet/transactions' as const,
};


export default OWNER_WALLET;

export type UserWalletRoutes = typeof OWNER_WALLET;
