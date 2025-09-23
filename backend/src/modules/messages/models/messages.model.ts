import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  _id: mongoose.Types.ObjectId;
  chatRoomId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  senderName: string; 
  
  messageType: 'TEXT' | 'SYSTEM' | 'BOOKING_UPDATE' | 'IMAGE';
  content: string;
  
  systemMessageType?: 'USER_JOINED' | 'USER_LEFT' | 'PAYMENT_COMPLETED' | 'GROUP_COMPLETED' | 'GROUP_CANCELLED' | 'REMINDER';
  systemData?: {
    userId?: mongoose.Types.ObjectId;
    username?: string;
    seatInfo?: string;
    paymentAmount?: number;
    timeRemaining?: string;
  };
  
  // Message Status
  isDeleted: boolean;
  deletedAt?: Date;
  editedAt?: Date;
  
  // Reply Feature
  replyToMessageId?: mongoose.Types.ObjectId;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema: Schema<IChatMessage> = new Schema(
  {
    chatRoomId: { 
      type: Schema.Types.ObjectId, 
      ref: 'ChatRoom', 
      required: true,
      index: true 
    },
    senderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    senderName: { 
      type: String, 
      required: true 
    },
    
    messageType: { 
      type: String, 
      enum: ['TEXT', 'SYSTEM', 'BOOKING_UPDATE', 'IMAGE'], 
      default: 'TEXT' 
    },
    content: { 
      type: String, 
      required: true,
      maxlength: 2000 
    },
    
    systemMessageType: {
      type: String,
      enum: ['USER_JOINED', 'USER_LEFT', 'PAYMENT_COMPLETED', 'GROUP_COMPLETED', 'GROUP_CANCELLED', 'REMINDER'],
      required: function() { return this.messageType === 'SYSTEM'; }
    },
    systemData: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      username: String,
      seatInfo: String,
      paymentAmount: Number,
      timeRemaining: String
    },
    
    isDeleted: { 
      type: Boolean, 
      default: false 
    },
    deletedAt: Date,
    editedAt: Date,
    
    replyToMessageId: { 
      type: Schema.Types.ObjectId, 
      ref: 'ChatMessage' 
    }
  },
  {
    timestamps: true,
  }
);

ChatMessageSchema.index({ chatRoomId: 1, createdAt: -1 });
ChatMessageSchema.index({ senderId: 1 });
ChatMessageSchema.index({ messageType: 1 });

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
