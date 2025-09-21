import { SocketService } from '../../../services/socket.service';
import { IChatRoomRepository } from '../../chatroom/interfaces/chatroom.repository.interface';
import { SendMessageDto, CreateSystemMessageDto, GetMessagesDto, EditMessageDto, DeleteMessageDto, MessageResponseDto, MessagesListResponseDto } from '../dtos/dto';
import { IChatMessageRepository } from '../interfaces/messages.repository.interface';
import { IChatMessageService } from '../interfaces/messages.service.interface';
import { IChatMessage } from '../models/messages.model';

export class ChatMessageService implements IChatMessageService {
  constructor(
    private chatMessageRepository: IChatMessageRepository,
    private chatRoomRepository: IChatRoomRepository,
    private socketService:SocketService
  ) {}

  async sendMessage(userId: string, data: SendMessageDto,senderName:string): Promise<MessageResponseDto> {
    // Verify user is participant of chat room
    const chatRoom = await this.chatRoomRepository.findById(data.chatRoomId)
    
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    const isParticipant = chatRoom.participants.some(p => p._id.toString() === userId);
    if (!isParticipant) {
      throw new Error('User is not a participant of this chat room');
    }

    if (!chatRoom.isActive) {
      throw new Error('Chat room is no longer active');
    }

 
    const message = await this.chatMessageRepository.create({
      ...data,
      senderId: userId,
      senderName
    });

    // Update chat room's last message time
    await this.chatRoomRepository.update(chatRoom._id.toString(), {
      lastMessageAt: new Date()
    });
  const responseDto = this.transformToResponseDto(message, userId);
  this.socketService.emitNewMessage(data.chatRoomId, responseDto);

  return responseDto;
  }

  async createSystemMessage(data: CreateSystemMessageDto): Promise<MessageResponseDto> {
    const message = await this.chatMessageRepository.createSystemMessage(data);
    
   
    await this.chatRoomRepository.update(data.chatRoomId, {
      lastMessageAt: new Date()
    });

  const responseDto = this.transformToResponseDto(message, 'system');
  this.socketService.emitNewMessage(data.chatRoomId, responseDto);

  return responseDto;
  }

  async getMessages(params: GetMessagesDto): Promise<MessagesListResponseDto> {
    const { messages, total } = await this.chatMessageRepository.findByChatRoom(params);
    
    const chatRoom = await this.chatRoomRepository.findById(params.chatRoomId);
    if (!chatRoom) {
      throw new Error('Chat room not found');
    }

    const page = params.page || 1;
    const limit = params.limit || 50;

    return {
      messages: messages.map(msg => this.transformToResponseDto(msg)),
      pagination: {
        page,
        limit,
        total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      chatRoomInfo: {
        _id: chatRoom._id.toString(),
        roomName: chatRoom.roomName,
        isActive: chatRoom.isActive
      }
    };
  }

  async editMessage(userId: string, data: EditMessageDto): Promise<MessageResponseDto> {
    const message = await this.chatMessageRepository.findById(data.messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new Error('You can only edit your own messages');
    }

    if (message.messageType === 'SYSTEM') {
      throw new Error('System messages cannot be edited');
    }

    const editedMessage = await this.chatMessageRepository.update(data.messageId, data);
    if (!editedMessage) {
      throw new Error('Failed to edit message');
    }

  this.socketService.emitMessageEdit(editedMessage.chatRoomId.toString(), {
    messageId: data.messageId,
    content: data.content
  });

  return this.transformToResponseDto(editedMessage, userId);
  }

  async deleteMessage(userId: string, data: DeleteMessageDto): Promise<boolean> {
    const message = await this.chatMessageRepository.findById(data.messageId);
    if (!message) {
      throw new Error('Message not found');
    }

    if (message.senderId.toString() !== userId) {
      throw new Error('You can only delete your own messages');
    }

    if (message.messageType === 'SYSTEM') {
      throw new Error('System messages cannot be deleted');
    }

  const deletedMessage = await this.chatMessageRepository.markAsDeleted(data.messageId);
  
  if (deletedMessage) {
    this.socketService.emitMessageDelete(
      deletedMessage.chatRoomId.toString(), 
      data.messageId
    );
  }

  return !!deletedMessage;
  }

  async getLastMessage(chatRoomId: string): Promise<MessageResponseDto | null> {
    const message = await this.chatMessageRepository.getLastMessage(chatRoomId);
    if (!message) return null;

    return this.transformToResponseDto(message);
  }

  private transformToResponseDto(message: IChatMessage, currentUserId?: string): MessageResponseDto {
    const response: MessageResponseDto = {
      _id: message._id.toString(),
      chatRoomId: message.chatRoomId.toString(),
      senderId: message.senderId.toString(),
      senderName: message.senderName,
      messageType: message.messageType,
      content: message.content,
      isDeleted: message.isDeleted,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt
    };

    // Add system message data if applicable
    if (message.messageType === 'SYSTEM' && message.systemMessageType) {
      response.systemMessageType = message.systemMessageType;
      if (message.systemData) {
        response.systemData = {
          userId: message.systemData.userId?.toString(),
          username: message.systemData.username,
          seatInfo: message.systemData.seatInfo,
          paymentAmount: message.systemData.paymentAmount,
          timeRemaining: message.systemData.timeRemaining
        };
      }
    }

    // Add edit/delete timestamps if applicable
    if (message.editedAt) response.editedAt = message.editedAt;
    if (message.deletedAt) response.deletedAt = message.deletedAt;

    // Add reply info if applicable
    if (message.replyToMessageId && (message.replyToMessageId as any).content) {
      response.replyToMessage = {
        _id: (message.replyToMessageId as any)._id.toString(),
        content: (message.replyToMessageId as any).content,
        senderName: (message.replyToMessageId as any).senderName
      };
    }

    // Add UI helper flags
    if (currentUserId) {
      response.isOwnMessage = message.senderId.toString() === currentUserId;
      response.canEdit = response.isOwnMessage && message.messageType !== 'SYSTEM' && !message.isDeleted;
      response.canDelete = response.isOwnMessage && message.messageType !== 'SYSTEM' && !message.isDeleted;
    }

    return response;
  }
}
