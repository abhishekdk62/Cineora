import { INotification } from "./notification.model.interface";
import { CreateNotificationDTO } from "../dtos/dto";

export interface INotificationReadRepository {
  findNotificationsByUserId(userId: string): Promise<INotification[]>;
  findUnreadNotificationsByUserId(userId: string): Promise<INotification[]>;
  countUnreadNotificationsByUserId(userId: string): Promise<number>;
  findNotificationByNotificationId(notificationId: string): Promise<INotification | null>;
}

export interface INotificationWriteRepository {
  createNotification(notificationData: CreateNotificationDTO): Promise<INotification>;
  markNotificationAsRead(notificationId: string): Promise<INotification>;
  deleteNotificationById(notificationId: string): Promise<boolean>;
}

export interface INotificationRepository extends INotificationReadRepository, INotificationWriteRepository {}
