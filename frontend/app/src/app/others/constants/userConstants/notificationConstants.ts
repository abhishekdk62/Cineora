
const USER_NOTIFICATIONS = {
  ALL: '/users/notifications' as const,
  FULL: '/users/notifications/all' as const,
  MARK_AS_SEEN: (id: string) => `/users/notification/${id}`,
  MARK_ALL_SEEN:'/users/notifications/all',
  
};

export default USER_NOTIFICATIONS;

export type UserNotificationsRoutes = typeof USER_NOTIFICATIONS;
