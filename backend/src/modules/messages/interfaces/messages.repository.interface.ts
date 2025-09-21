import { IChatMessage } from '../models/messages.model';
import { SendMessageDto, CreateSystemMessageDto, GetMessagesDto, EditMessageDto, DeleteMessageDto } from '../dtos/dto';

export interface IChatMessageRepository {
  create(data: SendMessageDto & { senderId: string; senderName: string }): Promise<IChatMessage>;
  createSystemMessage(data: CreateSystemMessageDto): Promise<IChatMessage>;
  findByChatRoom(params: GetMessagesDto): Promise<{ messages: IChatMessage[]; total: number }>;
  findById(messageId: string): Promise<IChatMessage | null>;
  update(messageId: string, data: EditMessageDto): Promise<IChatMessage | null>;
  delete(messageId: string): Promise<IChatMessage | null>;
  getLastMessage(chatRoomId: string): Promise<IChatMessage | null>;
  markAsDeleted(messageId: string): Promise<IChatMessage | null>;
}
