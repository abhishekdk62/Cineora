import mongoose, { Document, Schema } from 'mongoose';

export interface IChatRoom extends Document {
  _id: mongoose.Types.ObjectId;
  inviteGroupId: mongoose.Types.ObjectId;
  inviteId: string;
  roomName: string;
  roomType: 'GROUP_BOOKING';
  isActive: boolean;
  
  movieId: mongoose.Types.ObjectId;
  theaterId: mongoose.Types.ObjectId;
  screenId: mongoose.Types.ObjectId;
  showDate: string;
  showTime: string;
  
  participants: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  expiresAt: Date;
}

const ChatRoomSchema: Schema<IChatRoom> = new Schema(
  {
    inviteGroupId: { 
      type: Schema.Types.ObjectId, 
      ref: 'InviteGroup', 
      required: true,
      unique: true 
    },
    inviteId: { 
      type: String, 
      required: true,
      unique: true 
    },
    roomName: { 
      type: String, 
      required: true 
    },
    roomType: { 
      type: String, 
      enum: ['GROUP_BOOKING'], 
      default: 'GROUP_BOOKING' 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
    
    movieId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Movie', 
      required: true 
    },
    theaterId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Theater', 
      required: true 
    },
    screenId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Screen', 
      required: true 
    },
    showDate: { 
      type: String, 
      required: true 
    },
    showTime: { 
      type: String, 
      required: true 
    },
    
    participants: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    
    lastMessageAt: { 
      type: Date, 
      default: Date.now 
    },
    expiresAt: { 
      type: Date, 
      required: true 
    }
  },
  {
    timestamps: true,
  }
);

ChatRoomSchema.index({ inviteGroupId: 1 });
ChatRoomSchema.index({ inviteId: 1 });
ChatRoomSchema.index({ participants: 1 });

export default mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);
