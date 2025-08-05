import { Schema, model, Document } from 'mongoose';

export interface IOwnerRequest extends Document {
  _id: string;
  ownerName: string;
  phone: string;
  email: string;
  otp?: string;
  aadhaar: string;
  pan: string;
  accountHolder?: string;  // Made optional
  bankName?: string;       // Made optional
  accountNumber?: string;  // Made optional
  ifsc?: string;          // Made optional
  aadhaarUrl: string;
  panUrl: string;
  ownerPhotoUrl?: string;
  declaration: boolean;
  agree: boolean;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
  emailVerified: boolean;
}

const ownerRequestSchema = new Schema<IOwnerRequest>({
  ownerName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  otp: {
    type: String,
    trim: true
  },
  aadhaar: {
    type: String,
    required: true,
    trim: true,
  },
  pan: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
  },
  // ✅ CHANGED: Made bank fields optional
  accountHolder: {
    type: String,
    required: false, // Changed to optional
    trim: true,
    maxlength: 100
  },
  bankName: {
    type: String,
    required: false, // Changed to optional
    trim: true,
    maxlength: 100
  },
  accountNumber: {
    type: String,
    required: false, // Changed to optional
    trim: true
  },
  ifsc: {
    type: String,
    required: false, // Changed to optional
    trim: true,
    uppercase: true
  },
  aadhaarUrl: {
    type: String,
    required: true
  },
  panUrl: {
    type: String,
    required: true
  },
  ownerPhotoUrl: {
    type: String,
    default: null
  },
  declaration: {
    type: Boolean,
    required: true
  },
  agree: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  reviewedBy: {
    type: String,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ownerRequestSchema.index({ phone: 1 });
ownerRequestSchema.index({ email: 1 }); // ✅ Add email index
ownerRequestSchema.index({ aadhaar: 1 });
ownerRequestSchema.index({ pan: 1 });
ownerRequestSchema.index({ status: 1 });
ownerRequestSchema.index({ submittedAt: -1 });
ownerRequestSchema.index({ emailVerified: 1 }); // ✅ Add emailVerified index

export const OwnerRequest = model<IOwnerRequest>('OwnerRequest', ownerRequestSchema);
