import { Schema, model, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  type: 'signup' | 'password_reset' | 'login'|'owner_verification';
  expiresAt: Date;
  isUsed: boolean;
  userData?: any; // Add this to store temporary signup data
  createdAt: Date;
  updatedAt: Date;
}

const otpSchema = new Schema<IOTP>({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['signup', 'password_reset', 'login','owner_verification'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  userData: {
    type: Schema.Types.Mixed,
    required: false
  }
}, {
  timestamps: true
});

otpSchema.index({ email: 1, type: 1 });
otpSchema.index({ otp: 1 });

export const OTP = model<IOTP>('OTP', otpSchema);
