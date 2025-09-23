import {
  CreateChatRoomDto,
  UpdateChatRoomDto,
  AddParticipantDto,
  RemoveParticipantDto,
  ChatRoomResponseDto,
} from "../dtos/dto";

import { IChatRoomRepository } from "../interfaces/chatroom.repository.interface";
import { IChatRoomService } from "../interfaces/chatroom.service.interface";
import { IChatRoom } from "../models/chatroom.model";

export class ChatRoomService implements IChatRoomService {
  constructor(private chatRoomRepository: IChatRoomRepository) {}
  async createChatRoom(data: CreateChatRoomDto): Promise<ChatRoomResponseDto> {
    if (!data.participants) {
      data.participants = [];
    }
    if (!data.participants.includes(data.createdBy)) {
      data.participants.push(data.createdBy);
    }

    const chatRoom = await this.chatRoomRepository.create(data);
    return this.transformToResponseDto(chatRoom);
  }

  async getChatRoomByInviteId(
    inviteId: string
  ): Promise<ChatRoomResponseDto | null> {
    const chatRoom = await this.chatRoomRepository.findByInviteId(inviteId);
    return chatRoom ? this.transformToResponseDto(chatRoom) : null;
  }

  async getUserChatRooms(userId: string): Promise<ChatRoomResponseDto[]> {
    const chatRooms = await this.chatRoomRepository.findUserChatRooms(userId);
    return chatRooms.map((room) => this.transformToResponseDto(room));
  }

  async joinChatRoom(data: AddParticipantDto,userId:string): Promise<ChatRoomResponseDto> {
    
    const chatRoom = await this.chatRoomRepository.addParticipant(data,userId);
    if (!chatRoom) {
      throw new Error("Chat room not found");
    }
    return this.transformToResponseDto(chatRoom);
  }

  async leaveChatRoom(
    data: RemoveParticipantDto
  ): Promise<ChatRoomResponseDto> {
    const chatRoom = await this.chatRoomRepository.removeParticipant(data);
    if (!chatRoom) {
      throw new Error("Chat room not found");
    }
    return this.transformToResponseDto(chatRoom);
  }

  async deactivateChatRoom(inviteGroupId: string): Promise<boolean> {
    const chatRoom = await this.chatRoomRepository.findByInviteGroupId(
      inviteGroupId
    );
    if (!chatRoom) return false;

    await this.chatRoomRepository.deactivate(chatRoom._id.toString());
    return true;
  }

  private transformToResponseDto(chatRoom: IChatRoom): ChatRoomResponseDto {
    return {
      _id: chatRoom._id.toString(),
      inviteGroupId: chatRoom.inviteGroupId.toString(),
      inviteId: chatRoom.inviteId,
      roomName: chatRoom.roomName,
      roomType: chatRoom.roomType, 
      isActive: chatRoom.isActive,

      movieInfo: {
        _id:
          (chatRoom.movieId as string)._id?.toString() ||
          chatRoom.movieId.toString(),
        title: (chatRoom.movieId as string).title || "Unknown Movie",
        poster: (chatRoom.movieId as string).poster || "",
      },
      theaterInfo: {
        _id:
          (chatRoom.theaterId as string)._id?.toString() ||
          chatRoom.theaterId.toString(),
        name: (chatRoom.theaterId as string).name || "Unknown Theater",
      },
      showDate: chatRoom.showDate,
      showTime: chatRoom.showTime,

      participants: (chatRoom.participants as string[]).map((p) => ({
        _id: p._id?.toString() || p.toString(),
        username: p.username || "Unknown User",
        seatAssigned: undefined,
      })),
      participantCount: chatRoom.participants.length,

      createdBy: {
        _id:
          (chatRoom.createdBy as string)._id?.toString() ||
          chatRoom.createdBy.toString(),
        username: (chatRoom.createdBy as string).username || "Unknown User",
      },

      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
      lastMessageAt: chatRoom.lastMessageAt,
      expiresAt: chatRoom.expiresAt,
    };
  }
}
