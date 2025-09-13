import USER_NOTIFICATIONS from "../../constants/userConstants/notificationConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetNotificationsResponseDto,
  MarkNotificationReadResponseDto
} from '../../dtos/notification.dto';

export const getAllUserNotifications = async (): Promise<GetNotificationsResponseDto> => {
  const response = await apiClient.get(USER_NOTIFICATIONS.ALL);
  return response.data;
};
export const getFullUserNotifications = async (): Promise<GetNotificationsResponseDto> => {
  const response = await apiClient.get(USER_NOTIFICATIONS.FULL);
  return response.data;
};

export const markNotificationAsSeen = async (notificationId: string): Promise<MarkNotificationReadResponseDto> => {
  const response = await apiClient.patch(USER_NOTIFICATIONS.MARK_AS_SEEN(notificationId));
  return response.data;
};
