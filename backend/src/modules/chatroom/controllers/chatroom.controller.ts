import { Request, Response } from 'express';
import { IChatRoomService } from '../interfaces/chatroom.service.interface';
import { CreateChatRoomDto, AddParticipantDto, RemoveParticipantDto } from '../dtos/dto';

export class ChatRoomController {
  constructor(private chatRoomService: IChatRoomService) {}

  createChatRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const createData: CreateChatRoomDto = req.body;
      const chatRoom = await this.chatRoomService.createChatRoom(createData);
      
      res.status(201).json({
        success: true,
        message: 'Chat room created successfully',
        data: chatRoom
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create chat room',
        error: (error as Error).message
      });
    }
  };

  getChatRoomByInvite = async (req: Request, res: Response): Promise<void> => {
    try {
      const { inviteId } = req.params;
      const chatRoom = await this.chatRoomService.getChatRoomByInviteId(inviteId);
      
      if (!chatRoom) {
        res.status(404).json({
          success: false,
          message: 'Chat room not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: chatRoom
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get chat room',
        error: (error as Error).message
      });
    }
  };

  getUserChatRooms = async (req: Request, res: Response): Promise<void> => {
    try {
      const  userId  = req.user.id;
      const chatRooms = await this.chatRoomService.getUserChatRooms(userId);
      
      res.status(200).json({
        success: true,
        data: chatRooms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get user chat rooms',
        error: (error as Error).message
      });
    }
  };

  joinChatRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const joinData: AddParticipantDto = req.body;
       let userId=req.user.id
       console.log(userId);
      console.log('joindate',joinData);
       
      const chatRoom = await this.chatRoomService.joinChatRoom(joinData,userId);
      
      res.status(200).json({
        success: true,
        message: 'Joined chat room successfully',
        data: chatRoom
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to join chat room',
        error: (error as Error).message
      });
    }
  };

  leaveChatRoom = async (req: Request, res: Response): Promise<void> => {
    try {
      const leaveData: RemoveParticipantDto = req.body;
      console.log('leave data',leaveData);
      
      const chatRoom = await this.chatRoomService.leaveChatRoom(leaveData);
      
      res.status(200).json({
        success: true,
        message: 'Left chat room successfully',
        data: chatRoom
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to leave chat room',
        error: (error as Error).message
      });
    }
  };
}
