import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  language?: string;
  gender?: 'male' | 'female' | 'other';
  phone?: string;
  profilePicture?: string;
  locationCity?: string;
  locationState?: string;
  coordinates?: [number, number]; // [longitude, latitude]
  isVerified: boolean;
  xpPoints: number;
  joinedAt: Date;
  lastActive: Date;
  isActive: boolean;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    // ❌ REMOVED: unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    // ❌ REMOVED: unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  dateOfBirth: {
    type: Date
  },
  language: {
    type: String,
    default: 'en'
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String
  },
  locationCity: {
    type: String,
    trim: true
  },
  locationState: {
    type: String,
    trim: true
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    validate: {
      validator: function(v: number[]) {
        return v.length === 2;
      },
      message: 'Coordinates must be an array of 2 numbers [longitude, latitude]'
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  xpPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

userSchema.index({ email: 1 }, { unique: true });        // Now has unique constraint
userSchema.index({ username: 1 }, { unique: true });     // Now has unique constraint
userSchema.index({ coordinates: '2dsphere' }); 
userSchema.index({ isActive: 1, lastActive: -1 });

// Update lastActive on every save
userSchema.pre('save', function(next) {
  if (!this.isNew) {
    this.lastActive = new Date();
  }
  next();
});

export const User = model<IUser>('User', userSchema);
