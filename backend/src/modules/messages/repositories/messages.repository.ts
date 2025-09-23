import mongoose from 'mongoose';
import { SendMessageDto, CreateSystemMessageDto, GetMessagesDto, EditMessageDto, DeleteMessageDto }  from '../dtos/dto';
import { IChatMessageRepository } from '../interfaces/messages.repository.interface';
import { IChatMessage } from '../models/messages.model';
import  ChatMessage  from '../models/messages.model';

export class ChatMessageRepository implements IChatMessageRepository {
  async create(data: SendMessageDto & { senderId: string; senderName: string }): Promise<IChatMessage> {
    const message = new ChatMessage({
      chatRoomId: new mongoose.Types.ObjectId(data.chatRoomId),
      senderId: new mongoose.Types.ObjectId(data.senderId),
      senderName: data.senderName,
      content: data.content,
      messageType: data.messageType || 'TEXT',
      replyToMessageId: data.replyToMessageId ? new mongoose.Types.ObjectId(data.replyToMessageId) : undefined
    });
    
    const savedMessage = await message.save();
    
    if (savedMessage.replyToMessageId) {
      await savedMessage.populate('replyToMessageId', 'content senderName');
    }
    
    return savedMessage;
  }

  async createSystemMessage(data: CreateSystemMessageDto): Promise<IChatMessage> {
    const systemMessage = new ChatMessage({
      chatRoomId: new mongoose.Types.ObjectId(data.chatRoomId),
      senderId: new mongoose.Types.ObjectId('000000000000000000000000'), 
      senderName: 'System',
      content: data.content,
      messageType: 'SYSTEM',
      systemMessageType: data.systemMessageType,
      systemData: data.systemData ? {
        userId: data.systemData.userId ? new mongoose.Types.ObjectId(data.systemData.userId) : undefined,
        username: data.systemData.username,
        seatInfo: data.systemData.seatInfo,
        paymentAmount: data.systemData.paymentAmount,
        timeRemaining: data.systemData.timeRemaining
      } : undefined
    });
    
    return await systemMessage.save();
  }

  async findByChatRoom(params: GetMessagesDto): Promise<{ messages: IChatMessage[]; total: number }> {
    const { chatRoomId, page = 1, limit = 50, before } = params;
    
    let query: any = { 
      chatRoomId: new mongoose.Types.ObjectId(chatRoomId),
    };
    if (before) {
      const beforeMessage = await ChatMessage.findById(before).select('createdAt');
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }
    
    const messages = await ChatMessage.find(query)
      .populate('replyToMessageId', 'content senderName')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    console.log(messages);
    
    const total = await ChatMessage.countDocuments({
      chatRoomId: new mongoose.Types.ObjectId(chatRoomId),
    });
    
    return { messages: messages.reverse(), total };
  }

  async findById(messageId: string): Promise<IChatMessage | null> {
    return await ChatMessage.findById(messageId)
      .populate('replyToMessageId', 'content senderName')
      .exec();
  }

  async update(messageId: string, data: EditMessageDto): Promise<IChatMessage | null> {
    return await ChatMessage.findByIdAndUpdate(
      messageId,
      { 
        content: data.content,
        editedAt: new Date()
      },
      { new: true }
    )
    .populate('replyToMessageId', 'content senderName')
    .exec();
  }

  async delete(messageId: string): Promise<IChatMessage | null> {
    return await ChatMessage.findByIdAndDelete(messageId).exec();
  }

  async markAsDeleted(messageId: string): Promise<IChatMessage | null> {
    return await ChatMessage.findByIdAndUpdate(
      messageId,
      { 
        isDeleted: true,
        deletedAt: new Date(),
        content: 'This message was deleted'
      },
      { new: true }
    ).exec();
  }

  async getLastMessage(chatRoomId: string): Promise<IChatMessage | null> {
    return await ChatMessage.findOne({
      chatRoomId: new mongoose.Types.ObjectId(chatRoomId),
      isDeleted: false
    })
    .sort({ createdAt: -1 })
    .exec();
  }
}
