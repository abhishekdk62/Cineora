import { Request, Response } from "express";

import { StatusCodes } from "../../../utils/statuscodes";
import { createResponse } from "../../../utils/createResponse";
import { SendMessageDto, CreateSystemMessageDto, GetMessagesDto, EditMessageDto, DeleteMessageDto } from "../dtos/dto";
import { IChatMessageService } from "../interfaces/messages.service.interface";

// Constants for messages
const CHAT_MESSAGE_MESSAGES = {
  SENT_SUCCESS: "Message sent successfully",
  EDIT_SUCCESS: "Message edited successfully",
  DELETE_SUCCESS: "Message deleted successfully",
  MESSAGES_RETRIEVED: "Messages retrieved successfully",
  MESSAGE_NOT_FOUND: "Message not found",
  CHAT_ROOM_NOT_FOUND: "Chat room not found",
  NOT_PARTICIPANT: "You are not a participant of this chat room",
  CHAT_ROOM_INACTIVE: "Chat room is no longer active",
  CANNOT_EDIT_OTHERS: "You can only edit your own messages",
  CANNOT_DELETE_OTHERS: "You can only delete your own messages",
  CANNOT_EDIT_SYSTEM: "System messages cannot be edited",
  CANNOT_DELETE_SYSTEM: "System messages cannot be deleted",
  FAILED_SEND: "Failed to send message",
  FAILED_GET: "Failed to get messages",
  FAILED_EDIT: "Failed to edit message",
  FAILED_DELETE: "Failed to delete message",
  USER_AUTH_REQUIRED: "User authentication required",
  INVALID_MESSAGE_DATA: "Invalid message data",
  INTERNAL_SERVER_ERROR: "Internal server error"
};

interface AuthenticatedRequest extends Request {
  user?: { id: string; role?: string ,email:string};
  owner?: { ownerId: string; role?: string };
  admin?: { adminId: string; role?: string };
}

export class ChatMessageController {
  constructor(private readonly chatMessageService: IChatMessageService) {}

  async sendMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      let userMail=req.user?.email
const senderName=userMail.split('@')[0]
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.USER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const { chatRoomId, content, messageType, replyToMessageId } = req.body;
      console.log('msg datas',req.body);
      

      if (!chatRoomId || !content) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.INVALID_MESSAGE_DATA,
          })
        );
        return;
      }

      const sendDto: SendMessageDto = {
        chatRoomId,
        content: content.trim(),
        messageType: messageType || 'TEXT',
        replyToMessageId
      };

      const message = await this.chatMessageService.sendMessage(userId, sendDto,senderName);

      res.status(StatusCodes.CREATED).json(
        createResponse({
          success: true,
          message: CHAT_MESSAGE_MESSAGES.SENT_SUCCESS,
          data: message
        })
      );
    } catch (error: unknown) {
      this._handleControllerError(res, error, CHAT_MESSAGE_MESSAGES.FAILED_SEND);
    }
  }

  async getMessages(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.USER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const { chatRoomId } = req.params;
      const { page, limit, before } = req.query;

      const getDto: GetMessagesDto = {
        chatRoomId,
        page: page ? parseInt(page as string) : 1,
        limit: limit ? parseInt(limit as string) : 50,
        before: before as string
      };

      const result = await this.chatMessageService.getMessages(getDto);

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: CHAT_MESSAGE_MESSAGES.MESSAGES_RETRIEVED,
          data: result
        })
      );
    } catch (error: unknown) {
      this._handleControllerError(res, error, CHAT_MESSAGE_MESSAGES.FAILED_GET);
    }
  }

  async editMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.USER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const { messageId } = req.params;
      const { content } = req.body;

      if (!content || !content.trim()) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.INVALID_MESSAGE_DATA,
          })
        );
        return;
      }

      const editDto: EditMessageDto = {
        messageId,
        content: content.trim()
      };

      const editedMessage = await this.chatMessageService.editMessage(userId, editDto);

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: CHAT_MESSAGE_MESSAGES.EDIT_SUCCESS,
          data: editedMessage
        })
      );
    } catch (error: unknown) {
      this._handleControllerError(res, error, CHAT_MESSAGE_MESSAGES.FAILED_EDIT);
    }
  }

  async deleteMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.USER_AUTH_REQUIRED,
          })
        );
        return;
      }

      const { messageId } = req.params;

      const deleteDto: DeleteMessageDto = {
        messageId
      };

      const deleted = await this.chatMessageService.deleteMessage(userId, deleteDto);

      if (!deleted) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: CHAT_MESSAGE_MESSAGES.FAILED_DELETE,
          })
        );
        return;
      }

      res.status(StatusCodes.OK).json(
        createResponse({
          success: true,
          message: CHAT_MESSAGE_MESSAGES.DELETE_SUCCESS
        })
      );
    } catch (error: unknown) {
      this._handleControllerError(res, error, CHAT_MESSAGE_MESSAGES.FAILED_DELETE);
    }
  }

  async createSystemMessage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { chatRoomId, systemMessageType, content, systemData } = req.body;
      console.log('leave data',req.body);

      const systemDto: CreateSystemMessageDto = {
        chatRoomId,
        systemMessageType,
        content,
        systemData
      };

      const systemMessage = await this.chatMessageService.createSystemMessage(systemDto);

      res.status(StatusCodes.CREATED).json(
        createResponse({
          success: true,
          message: "System message created successfully",
          data: systemMessage
        })
      );
    } catch (error: unknown) {
      this._handleControllerError(res, error, CHAT_MESSAGE_MESSAGES.INTERNAL_SERVER_ERROR);
    }
  }

  private _handleControllerError(
    res: Response,
    error: unknown,
    defaultMessage: string
  ): void {
    console.error("Chat Message Controller Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : defaultMessage;
    
    if (errorMessage.includes('not found')) {
      res.status(StatusCodes.NOT_FOUND).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
      return;
    }

    if (errorMessage.includes('not a participant') || errorMessage.includes('only edit your own') || errorMessage.includes('only delete your own')) {
      res.status(StatusCodes.FORBIDDEN).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
      return;
    }

    if (errorMessage.includes('no longer active')) {
      res.status(StatusCodes.BAD_REQUEST).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
      return;
    }
    
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      createResponse({
        success: false,
        message: errorMessage,
      })
    );
  }
}
