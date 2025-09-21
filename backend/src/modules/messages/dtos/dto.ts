import { Types } from "mongoose";

// ===== REQUEST DTOs =====

export interface SendMessageDto {
  chatRoomId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE';
  replyToMessageId?: string;
}

export interface CreateSystemMessageDto {
  chatRoomId: string;
  systemMessageType: 'USER_JOINED' | 'USER_LEFT' | 'PAYMENT_COMPLETED' | 'GROUP_COMPLETED' | 'GROUP_CANCELLED' | 'REMINDER';
  content: string;
  systemData?: {
    userId?: string;
    username?: string;
    seatInfo?: string;
    paymentAmount?: number;
    timeRemaining?: string;
  };
}

export interface GetMessagesDto {
  chatRoomId: string;
  page?: number;
  limit?: number;
  before?: string; // messageId to get messages before this
}

export interface EditMessageDto {
  messageId: string;
  content: string;
}

export interface DeleteMessageDto {
  messageId: string;
}

// ===== RESPONSE DTOs =====

export interface MessageResponseDto {
  _id: string;
  chatRoomId: string;
  senderId: string;
  senderName: string;
  messageType: 'TEXT' | 'SYSTEM' | 'BOOKING_UPDATE' | 'IMAGE';
  content: string;
  
  // System message data
  systemMessageType?: 'USER_JOINED' | 'USER_LEFT' | 'PAYMENT_COMPLETED' | 'GROUP_COMPLETED' | 'GROUP_CANCELLED' | 'REMINDER';
  systemData?: {
    userId?: string;
    username?: string;
    seatInfo?: string;
    paymentAmount?: number;
    timeRemaining?: string;
  };
  
  // Message status
  isDeleted: boolean;
  deletedAt?: Date;
  editedAt?: Date;
  
  // Reply info
  replyToMessage?: {
    _id: string;
    content: string;
    senderName: string;
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // UI helpers
  isOwnMessage?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}

export interface MessagesListResponseDto {
  messages: MessageResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  chatRoomInfo: {
    _id: string;
    roomName: string;
    isActive: boolean;
  };
}

// ===== SOCKET EVENT DTOs =====

export interface NewMessageEventDto {
  chatRoomId: string;
  inviteGroupId: string;
  message: MessageResponseDto;
}

export interface MessageEditedEventDto {
  chatRoomId: string;
  messageId: string;
  newContent: string;
  editedAt: Date;
}

export interface MessageDeletedEventDto {
  chatRoomId: string;
  messageId: string;
  deletedAt: Date;
}

// ===== VALIDATION DTOs =====

export interface SendMessageValidationDto {
  chatRoomId: string;
  content: string;
  messageType?: 'TEXT' | 'IMAGE';
  replyToMessageId?: string;
}
