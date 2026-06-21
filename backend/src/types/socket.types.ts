export interface ParticipantSocketPayload {
  inviteId?: string;
  availableSlots?: number;
  totalJoined?: number;
  leftUserId?: string;
  releasedSeat?: string;
  releasedSeatPrice?: number;
}

export interface GroupCompletionSocketPayload {
  inviteId: string;
  status?: string;
}

export interface MessageEditSocketPayload {
  messageId: string;
  content: string;
  chatRoomId?: string;
}
