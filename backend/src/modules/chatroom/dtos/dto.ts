import { Types } from "mongoose";


export interface CreateChatRoomDto {
  inviteGroupId: string;
  inviteId: string;
  roomName: string;
  movieId: string;
  theaterId: string;
  participants:string[]
  screenId: string;
  showDate: string;
  showTime: string;
  createdBy: string;
  expiresAt: Date;
}

export interface UpdateChatRoomDto {
  roomName?: string;
  isActive?: boolean;
  lastMessageAt?: Date;
}

export interface AddParticipantDto {
  userId: string;
  inviteGroupId: string;
}

export interface RemoveParticipantDto {
  userId: string;
  chatRoomId: string;
}

export interface DeactivateChatRoomDto {
  inviteGroupId: string;
}

export interface GetUserChatRoomsDto {
  userId: string;
  limit?: number;
  page?: number;
}

export interface GetChatRoomDto {
  inviteId: string;
}


export interface ParticipantResponseDto {
  _id: string;
  username: string;
  seatAssigned?: string;
  seatRow?: string;
  seatNumber?: string;
  paymentStatus?: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  joinedAt?: Date;
}

export interface MovieInfoDto {
  _id: string;
  title: string;
  poster: string;
  genre?: string[];
  duration?: number;
}

export interface TheaterInfoDto {
  _id: string;
  name: string;
  location?: {
    address: string;
    city: string;
  };
}

export interface ScreenInfoDto {
  _id: string;
  name: string;
  features?: string[];
}

export interface ChatRoomResponseDto {
  _id: string;
  inviteGroupId: string;
  inviteId: string;
  roomName: string;
  roomType: 'GROUP_BOOKING';
  isActive: boolean;
  
  movieInfo: MovieInfoDto;
  theaterInfo: TheaterInfoDto;
  screenInfo?: ScreenInfoDto;
  showDate: string;
  showTime: string;
  
  participants: ParticipantResponseDto[];
  participantCount: number;
  maxParticipants?: number;
  availableSlots?: number;
  
  // Host Info
  createdBy: {
    _id: string;
    username: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt: Date;
  expiresAt: Date;
  
  hasUnreadMessages?: boolean;
  lastMessage?: {
    content: string;
    senderName: string;
    timestamp: Date;
  };
}

export interface ChatRoomListResponseDto {
  _id: string;
  inviteId: string;
  roomName: string;
  movieInfo: {
    _id: string;
    title: string;
    poster: string;
  };
  theaterInfo: {
    _id: string;
    name: string;
  };
  showDate: string;
  showTime: string;
  participantCount: number;
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: Date;
  isActive: boolean;
  expiresAt: Date;
}


export interface CreateChatRoomValidationDto {
  inviteGroupId: string;
  inviteId: string;
  roomName: string;
  movieId: string;
  theaterId: string;
  screenId: string;
  showDate: string; 
  showTime: string; 
  expiresAt: string;
}

export interface JoinChatRoomValidationDto {
  inviteGroupId: string;
}

export interface LeaveChatRoomValidationDto {
  inviteGroupId: string;
}


export interface ChatRoomJoinEventDto {
  chatRoomId: string;
  inviteGroupId: string;
  userId: string;
  username: string;
  seatAssigned?: string;
  participantCount: number;
}

export interface ChatRoomLeaveEventDto {
  chatRoomId: string;
  inviteGroupId: string;
  userId: string;
  username: string;
  seatReleased?: string;
  participantCount: number;
  availableSlots: number;
}

export interface ChatRoomCompletedEventDto {
  chatRoomId: string;
  inviteGroupId: string;
  inviteId: string;
  participantCount: number;
}

export interface ChatRoomCancelledEventDto {
  chatRoomId: string;
  inviteGroupId: string;
  inviteId: string;
  reason: 'expired' | 'cancelled' | 'insufficient_participants';
}


export interface SystemMessageDto {
  type: 'user_joined' | 'user_left' | 'payment_completed' | 'group_completed' | 'group_cancelled' | 'reminder';
  content: string;
  metadata?: {
    userId?: string;
    username?: string;
    seatInfo?: string;
    paymentAmount?: number;
    timeRemaining?: string;
  };
}


export interface ChatRoomErrorDto {
  code: 'ROOM_NOT_FOUND' | 'ROOM_EXPIRED' | 'ROOM_FULL' | 'USER_NOT_PARTICIPANT' | 'INVALID_INVITE';
  message: string;
  details?: any;
}


export interface PaginationDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedChatRoomsResponseDto {
  data: ChatRoomListResponseDto[];
  pagination: PaginationDto;
}
