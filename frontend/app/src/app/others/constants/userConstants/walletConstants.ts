
const USER_WALLET = {
  WALLET: '/users/wallet' as const,
  TRANSACTIONS: '/users/transaction' as const,
  CREDIT_TRANSACTION: '/users/wallet/transactions' as const,
};


export default USER_WALLET;

export type UserWalletRoutes = typeof USER_WALLET;
