import { CreateChatRoomDto, UpdateChatRoomDto, AddParticipantDto, RemoveParticipantDto } from '../dtos/dto';
import { IChatRoom } from '../models/chatroom.model';

export interface IChatRoomRepository {
  create(data: CreateChatRoomDto): Promise<IChatRoom>;
  findByInviteGroupId(inviteGroupId: string): Promise<IChatRoom | null>;
  findByInviteId(inviteId: string): Promise<IChatRoom | null>;
  findUserChatRooms(userId: string): Promise<IChatRoom[]>;
  findById(chatId: string): Promise<IChatRoom | null>;
  update(chatRoomId: string, data: UpdateChatRoomDto): Promise<IChatRoom | null>;
  addParticipant(data: AddParticipantDto,userId:string): Promise<IChatRoom | null>;
  removeParticipant(data: RemoveParticipantDto): Promise<IChatRoom | null>;
  deactivate(chatRoomId: string): Promise<IChatRoom | null>;
  delete(chatRoomId: string): Promise<boolean>;
}
