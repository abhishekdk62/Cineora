import mongoose, { Document, Schema } from "mongoose";

export interface IStaff extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  ownerId: mongoose.Types.ObjectId;
  theaterId?: mongoose.Types.ObjectId;
  isActive: boolean;
  refreshToken?: string;
}

const StaffSchema = new Schema<IStaff>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "staff" },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  theaterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater' },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String }
}, {
  timestamps: true
});

export const Staff = mongoose.model<IStaff>("Staff", StaffSchema);
