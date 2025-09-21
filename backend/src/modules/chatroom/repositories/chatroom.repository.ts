import ChatRoom, { IChatRoom } from "../models/chatroom.model";
import { IChatRoomRepository } from "../interfaces/chatroom.repository.interface";
import {
  CreateChatRoomDto,
  UpdateChatRoomDto,
  AddParticipantDto,
  RemoveParticipantDto,
} from "../dtos/dto";
import mongoose from "mongoose";

export class ChatRoomRepository implements IChatRoomRepository {
  async create(data: CreateChatRoomDto): Promise<IChatRoom> {
    const chatRoom = new ChatRoom(data);
    return await chatRoom.save();
  }

  async findByInviteGroupId(inviteGroupId: string): Promise<IChatRoom | null> {
    return await ChatRoom.findOne({
      inviteGroupId: new mongoose.Types.ObjectId(inviteGroupId),
    })
      .populate("movieId", "title poster")
      .populate("theaterId", "name")
      .populate("participants", "username")
      .exec();
  }
  async findById(chatId: string): Promise<IChatRoom | null> {
    return await ChatRoom.findById(chatId)
      .populate("movieId", "title poster")
      .populate("theaterId", "name")
      .populate("participants", "username")
      .exec();
  }

  async findByInviteId(inviteId: string): Promise<IChatRoom | null> {
    return await ChatRoom.findOne({ inviteId })
      .populate("movieId", "title poster")
      .populate("theaterId", "name")
      .populate("participants", "username")
      .exec();
  }

  async findUserChatRooms(userId: string): Promise<IChatRoom[]> {
    return await ChatRoom.find({
      participants: new mongoose.Types.ObjectId(userId),
      isActive: true,
    })
      .populate("movieId", "title poster")
      .populate("theaterId", "name")
      .populate("participants", "username")
      .sort({ lastMessageAt: -1 })
      .exec();
  }

  async update(
    chatRoomId: string,
    data: UpdateChatRoomDto
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findByIdAndUpdate(chatRoomId, data, {
      new: true,
    }).exec();
  }

  async addParticipant(
    data: AddParticipantDto,
    userId: string
  ): Promise<IChatRoom | null> {

    return await ChatRoom.findOneAndUpdate(
      { inviteGroupId: new mongoose.Types.ObjectId(data.inviteGroupId) },
      {
        $addToSet: { participants: new mongoose.Types.ObjectId(userId) },
        $set: { lastMessageAt: new Date() },
      },
      { new: true }
    )
      .populate("movieId", "title poster")
      .populate("theaterId", "name")
      .populate("participants", "username")
      .exec();
  }

  async removeParticipant(
    data: RemoveParticipantDto
  ): Promise<IChatRoom | null> {
    return await ChatRoom.findOneAndUpdate(
      { inviteGroupId: new mongoose.Types.ObjectId(data.chatRoomId) },
      {
        $pull: { participants: new mongoose.Types.ObjectId(data.userId) },
        $set: { lastMessageAt: new Date() },
      },
      { new: true }
    )
      .populate("movieId", "title poster")
      .populate("theaterId", "name")
      .populate("participants", "username")
      .exec();
  }

  async deactivate(chatRoomId: string): Promise<IChatRoom | null> {
    return await ChatRoom.findByIdAndUpdate(
      chatRoomId,
      { isActive: false },
      { new: true }
    ).exec();
  }

  async delete(chatRoomId: string): Promise<boolean> {
    const result = await ChatRoom.findByIdAndDelete(chatRoomId).exec();
    return !!result;
  }
}
