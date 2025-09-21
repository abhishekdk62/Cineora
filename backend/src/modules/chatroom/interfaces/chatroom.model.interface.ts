export interface CreateChatRoomDto {
  inviteGroupId: string;
  inviteId: string;
  roomName: string;
  movieId: string;
  theaterId: string;
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
  inviteGroupId: string;
}

export interface ChatRoomResponseDto {
  _id: string;
  inviteGroupId: string;
  inviteId: string;
  roomName: string;
  isActive: boolean;
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
  participants: Array<{
    _id: string;
    username: string;
    seatAssigned?: string;
  }>;
  participantCount: number;
  createdAt: Date;
  lastMessageAt: Date;
  expiresAt: Date;
}
