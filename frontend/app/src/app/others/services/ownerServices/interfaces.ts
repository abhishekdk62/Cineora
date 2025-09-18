import { UserProfile } from "../../components/Owner/MyAccount/MyAccount";

export type PartialUserProfile = {
  [P in keyof UserProfile]?: UserProfile[P];
};

export interface OwnerRequestResponse {
  success: boolean;
  message: string;
  requestId?: string;
  data?: OwnerRequestData;
}

export interface OwnerRequestData {
  ownerName: string;
  phone: string;
  email: string;
  aadhaar: string;
  pan: string;
  declaration: boolean;
  otp: string;
  agree: boolean;
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl: string | null;
  accountHolder?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
}