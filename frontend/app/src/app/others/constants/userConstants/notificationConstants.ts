
const USER_NOTIFICATIONS = {
  ALL: '/users/notifications' as const,
  MARK_AS_SEEN: (id: string) => `/users/notification/${id}`,
};

export default USER_NOTIFICATIONS;

export type UserNotificationsRoutes = typeof USER_NOTIFICATIONS;
