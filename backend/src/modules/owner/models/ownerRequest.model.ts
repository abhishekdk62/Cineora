import { Schema, model, Document } from 'mongoose';
import { IOwnerRequest } from '../interfaces/owner.model.interface';



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
  accountHolder: {
    type: String,
    required: false, 
    trim: true,
    maxlength: 100
  },
  bankName: {
    type: String,
    required: false, 
    trim: true,
    maxlength: 100
  },
  accountNumber: {
    type: String,
    required: false, 
    trim: true
  },
  ifsc: {
    type: String,
    required: false, 
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
ownerRequestSchema.index({ email: 1 }); 
ownerRequestSchema.index({ aadhaar: 1 });
ownerRequestSchema.index({ pan: 1 });
ownerRequestSchema.index({ status: 1 });
ownerRequestSchema.index({ submittedAt: -1 });
ownerRequestSchema.index({ emailVerified: 1 }); 

export const OwnerRequest = model<IOwnerRequest>('OwnerRequest', ownerRequestSchema);
