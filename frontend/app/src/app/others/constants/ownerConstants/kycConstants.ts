
const OWNER_KYC = {
  UPLOAD: '/owners/upload' as const,
};

export default OWNER_KYC;

export type OwnerKycRoutes = typeof OWNER_KYC;
