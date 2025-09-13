import { Request, Response } from "express";
import { INotificationService } from "../interfaces/notification.service.interface";
import { StatusCodes } from "../../../utils/statuscodes";
import { NOTIFICATION_MESSAGES } from "../../../utils/messages.constants";
import { createResponse } from "../../../utils/createResponse";

export class NotificationController {
  constructor(private readonly notificationService: INotificationService) {}

  async getUserNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const result = await this.notificationService.getUserNotifications(
        userId
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message ||
              NOTIFICATION_MESSAGES.NOTIFICATION_RETRIEVED_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }
  async markAllNotificationsRead(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }
      const result = await this.notificationService.markAllNotificationsRead(
        userId
      );
      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message ||
              NOTIFICATION_MESSAGES.NOTIFICATION_RETRIEVED_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }
  async getAllUserNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(StatusCodes.UNAUTHORIZED).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.AUTH_REQUIRED,
          })
        );
        return;
      }

      const result = await this.notificationService.getAllUserNotifications(
        userId
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message:
              result.message ||
              NOTIFICATION_MESSAGES.NOTIFICATION_RETRIEVED_SUCCESS,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.NOTIFICATION_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this.notificationService.markNotificationAsRead(
        notificationId
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }

  async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;

      if (!notificationId) {
        res.status(StatusCodes.BAD_REQUEST).json(
          createResponse({
            success: false,
            message: NOTIFICATION_MESSAGES.NOTIFICATION_ID_REQUIRED,
          })
        );
        return;
      }

      const result = await this.notificationService.deleteNotification(
        notificationId
      );

      if (result.success) {
        res.status(StatusCodes.OK).json(
          createResponse({
            success: true,
            message: result.message,
            data: result.data,
          })
        );
      } else {
        res.status(StatusCodes.NOT_FOUND).json(
          createResponse({
            success: false,
            message: result.message,
          })
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : NOTIFICATION_MESSAGES.INTERNAL_SERVER_ERROR;
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
        createResponse({
          success: false,
          message: errorMessage,
        })
      );
    }
  }
}
