import { SendMessageDto, CreateSystemMessageDto, GetMessagesDto, EditMessageDto, DeleteMessageDto, MessageResponseDto, MessagesListResponseDto } from '../dtos/dto';

export interface IChatMessageService {
  sendMessage(userId: string, data: SendMessageDto,senderName:string): Promise<MessageResponseDto>;
  createSystemMessage(data: CreateSystemMessageDto): Promise<MessageResponseDto>;
  getMessages(params: GetMessagesDto): Promise<MessagesListResponseDto>;
  editMessage(userId: string, data: EditMessageDto): Promise<MessageResponseDto>;
  deleteMessage(userId: string, data: DeleteMessageDto): Promise<boolean>;
  getLastMessage(chatRoomId: string): Promise<MessageResponseDto | null>;
}
