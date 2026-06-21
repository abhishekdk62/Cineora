import {
  CreateChatRoomDto,
  AddParticipantDto,
  RemoveParticipantDto,
  ChatRoomResponseDto,
} from "../dtos/dto";

import { IChatRoomRepository } from "../interfaces/chatroom.repository.interface";
import { IChatRoomService } from "../interfaces/chatroom.service.interface";
import { IChatRoom } from "../models/chatroom.model";
import {
  getPopulatedStringField,
  getRefId,
  PopulatedMovieRef,
  PopulatedTheaterRef,
  PopulatedUserRef,
  PopulatedField,
} from "../../../types/mongoose.types";

type PopulatedChatRoom = IChatRoom & {
  movieId?: PopulatedField<PopulatedMovieRef>;
  theaterId?: PopulatedField<PopulatedTheaterRef>;
  participants?: PopulatedField<PopulatedUserRef>[];
  createdBy?: PopulatedField<PopulatedUserRef>;
};

export class ChatRoomService implements IChatRoomService {
  constructor(private readonly chatRoomRepository: IChatRoomRepository) {}

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

  async joinChatRoom(
    data: AddParticipantDto,
    userId: string
  ): Promise<ChatRoomResponseDto> {
    const chatRoom = await this.chatRoomRepository.addParticipant(data, userId);
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
    const populated = chatRoom as PopulatedChatRoom;

    return {
      _id: chatRoom._id.toString(),
      inviteGroupId: chatRoom.inviteGroupId.toString(),
      inviteId: chatRoom.inviteId,
      roomName: chatRoom.roomName,
      roomType: chatRoom.roomType,
      isActive: chatRoom.isActive,

      movieInfo: populated.movieId
        ? {
            _id: getRefId(populated.movieId),
            title: getPopulatedStringField(
              populated.movieId,
              "title",
              "Unknown Movie"
            ),
            poster: getPopulatedStringField(populated.movieId, "poster", ""),
          }
        : null,

      theaterInfo: {
        _id: getRefId(populated.theaterId),
        name: getPopulatedStringField(
          populated.theaterId,
          "name",
          "Unknown Theater"
        ),
      },

      showDate: chatRoom.showDate,
      showTime: chatRoom.showTime,

      participants:
        populated.participants?.map((participant) => ({
          _id: getRefId(participant),
          username: getPopulatedStringField(
            participant,
            "username",
            "Unknown User"
          ),
          seatAssigned: undefined as string | undefined,
        })) ?? [],

      participantCount: chatRoom.participants?.length ?? 0,

      createdBy: {
        _id: getRefId(populated.createdBy),
        username: getPopulatedStringField(
          populated.createdBy,
          "username",
          "Unknown User"
        ),
      },

      createdAt: chatRoom.createdAt,
      updatedAt: chatRoom.updatedAt,
      lastMessageAt: chatRoom.lastMessageAt,
      expiresAt: chatRoom.expiresAt,
    };
  }
}
