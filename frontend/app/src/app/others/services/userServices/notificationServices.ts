import USER_NOTIFICATIONS from "../../constants/userConstants/notificationConstants";
import apiClient from "../../Utils/apiClient";
import {
  GetAllUserNotificationsResponseDto,
  MarkNotificationAsSeenResponseDto
} from '../../dtos/notification.dto';

export const getAllUserNotifications = async (): Promise<GetAllUserNotificationsResponseDto> => {
  const response = await apiClient.get(USER_NOTIFICATIONS.ALL);
  return response.data;
};

export const markNotificationAsSeen = async (notificationId: string): Promise<MarkNotificationAsSeenResponseDto> => {
  const response = await apiClient.patch(USER_NOTIFICATIONS.MARK_AS_SEEN(notificationId));
  return response.data;
};
