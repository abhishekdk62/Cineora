export const CHAT_ROOM = {
  CREATE_ROOM: '/users/rooms',
  GET_ROOM_BY_INVITE: (inviteId: string) => `/users/rooms/invite/${inviteId}`,
  GET_USER_ROOMS:  `/users/rooms/user`,
  JOIN_ROOM: '/users/rooms/join',
  LEAVE_ROOM: '/users/rooms/leave'
};

export const CHAT_MESSAGE = {
  SEND_MESSAGE: '/users/messages',
  GET_MESSAGES: (chatRoomId: string) => `/users/messages/${chatRoomId}`,
  EDIT_MESSAGE: (messageId: string) => `/users/messages/${messageId}`,
  DELETE_MESSAGE: (messageId: string) => `/users/messages/${messageId}`,
  CREATE_SYSTEM_MESSAGE: '/users/messages/system'
};
