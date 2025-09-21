import { CreateChatRoomDto, UpdateChatRoomDto, AddParticipantDto, RemoveParticipantDto, ChatRoomResponseDto } from '../dtos/dto';

export interface IChatRoomService {
  createChatRoom(data: CreateChatRoomDto): Promise<ChatRoomResponseDto>;
  getChatRoomByInviteId(inviteId: string): Promise<ChatRoomResponseDto | null>;
  getUserChatRooms(userId: string): Promise<ChatRoomResponseDto[]>;
  joinChatRoom(data: AddParticipantDto,userId:string): Promise<ChatRoomResponseDto>;
  leaveChatRoom(data: RemoveParticipantDto): Promise<ChatRoomResponseDto>;
  deactivateChatRoom(inviteGroupId: string): Promise<boolean>;
}
