import { Server as SocketIOServer } from "socket.io";
import { MessageDto, UserDto } from "../mappers/user.mapper";
import {
  GroupCompletionSocketPayload,
  MessageEditSocketPayload,
  ParticipantSocketPayload,
} from "../types/socket.types";

function getRoomClientCount(io: SocketIOServer, roomId: string): number {
  const namespace = io.of("/") as unknown as {
    adapter: { rooms: Map<string, Set<string>> };
  };
  return namespace.adapter.rooms.get(roomId)?.size ?? 0;
}

export class SocketService {
  private readonly io: SocketIOServer;

  constructor(io: SocketIOServer) {
    this.io = io;

    this.io.on("connection", (socket) => {
      socket.on("join-showtime", (showtimeId: string) => {
        socket.join(showtimeId);
      });

      socket.on("leave-showtime", (showtimeId: string) => {
        socket.leave(showtimeId);
      });
    });
  }

  emitSeatUpdate(showtimeId: string, bookedSeats: string[]): void {
    this.io.to(showtimeId).emit("seat-update", {
      showtimeId,
      bookedSeats,
      action: "booked",
    });
  }

  emitSeatCancellation(showtimeId: string, cancelledSeats: string[]): void {
    this.io.to(showtimeId).emit("seat-update", {
      showtimeId,
      cancelledSeats,
      action: "cancelled",
    });
  }

  emitParticipantJoined(
    inviteId: string,
    participantData: ParticipantSocketPayload
  ): void {
    this.io.emit("participant_joined", {
      inviteId,
      availableSlots: participantData.availableSlots,
      totalJoined: participantData.totalJoined ?? 0,
    });
  }

  emitParticipantLeft(
    _inviteId: string,
    participantData: ParticipantSocketPayload
  ): void {
    this.io.emit("participant_left", {
      inviteId: participantData.inviteId,
      availableSlots: participantData.availableSlots,
      leftUserId: participantData.leftUserId,
      releasedSeat: participantData.releasedSeat,
      releasedSeatPrice: participantData.releasedSeatPrice,
    });
  }

  emitGroupCompleted(
    inviteId: string,
    _completionData: GroupCompletionSocketPayload
  ): void {
    this.io.emit("group_completed", {
      inviteId,
      status: "completed",
    });
  }

  emitInviteCancelled(inviteId: string): void {
    this.io.emit("invite_cancelled", { inviteId });
  }

  emitSeatHold(
    showtimeId: string,
    heldSeats: string[],
    inviteId?: string
  ): void {
    this.io.to(showtimeId).emit("seat-update", {
      showtimeId,
      heldSeats,
      action: "held",
      inviteId: inviteId ?? null,
    });
  }

  emitSeatRelease(
    showtimeId: string,
    releasedSeats: string[],
    inviteId?: string
  ): void {
    this.io.to(showtimeId).emit("seat-update", {
      showtimeId,
      releasedSeats,
      action: "released",
      inviteId: inviteId ?? null,
    });
  }

  emitNewMessage(chatRoomId: string, messageData: MessageDto): void {
    this.io.to(`chat-${chatRoomId}`).emit("new-message", messageData);
  }

  emitMessageEdit(
    chatRoomId: string,
    messageData: MessageEditSocketPayload
  ): void {
    this.io.to(`chat-${chatRoomId}`).emit("message-edited", {
      messageId: messageData.messageId,
      content: messageData.content,
      chatRoomId,
    });
  }

  emitMessageDelete(chatRoomId: string, messageId: string): void {
    this.io.to(`chat-${chatRoomId}`).emit("message-deleted", {
      messageId,
      chatRoomId,
    });
  }

  emitUserJoinedChat(chatRoomId: string, userData: UserDto): void {
    this.io.to(`chat-${chatRoomId}`).emit("user-joined-chat", userData);
  }

  emitUserLeftChat(chatRoomId: string, userData: UserDto): void {
    this.io.to(`chat-${chatRoomId}`).emit("user-left-chat", userData);
  }

  /** Exposed for diagnostics without casting socket internals. */
  getRoomSize(roomId: string): number {
    return getRoomClientCount(this.io, roomId);
  }
}
