import { CHAT_MESSAGE, CHAT_ROOM } from '../../constants/userConstants/chatConstants';
import apiClient from '../../Utils/apiClient';

export interface SendMessageDto {
  chatRoomId: string;
  content: string;
  messageType?: 'TEXT' | 'SYSTEM' | 'BOOKING_UPDATE' | 'IMAGE';
  replyToMessageId?: string;
}

export interface CreateSystemMessageDto {
  chatRoomId: string;
  systemMessageType: 'USER_JOINED' | 'USER_LEFT' | 'PAYMENT_COMPLETED' | 'GROUP_COMPLETED' | 'GROUP_CANCELLED' | 'REMINDER';
  content: string;
  systemData?: {
    userId?: string;
    username?: string;
    seatInfo?: string;
    paymentAmount?: number;
    timeRemaining?: string;
  };
}

export interface GetMessagesDto {
  chatRoomId: string;
  page?: number;
  limit?: number;
  before?: string;
}

export interface EditMessageDto {
  messageId: string;
  content: string;
}

export interface DeleteMessageDto {
  messageId: string;
}


export const createChatRoom = async (data: { inviteGroupId: string; inviteId: string; roomName: string; movieId: string; theaterId: string; screenId: string; showDate: string; showTime: string; createdBy: string; expiresAt: string }) => {
  return apiClient.post(CHAT_ROOM.CREATE_ROOM, data);
};

export const getChatRoomByInvite = async (inviteId: string) => {
  return (await apiClient.get(CHAT_ROOM.GET_ROOM_BY_INVITE(inviteId))).data;
};

export const getUserChatRooms = async () => {
  return (await apiClient.get(CHAT_ROOM.GET_USER_ROOMS)).data;
};

export const joinChatRoom = async (data: { inviteGroupId: string }) => {
  return apiClient.post(CHAT_ROOM.JOIN_ROOM, data);
};

export const leaveChatRoom = async (data: { chatRoomId: string; userId: string }) => {
  return apiClient.post(CHAT_ROOM.LEAVE_ROOM, data);
};


export const sendMessageApi = async (data: SendMessageDto) => {
  return apiClient.post(CHAT_MESSAGE.SEND_MESSAGE, data);
};

export const getMessages = async (params: GetMessagesDto) => {
  const { chatRoomId, page, limit, before } = params;
  return (await apiClient.get(CHAT_MESSAGE.GET_MESSAGES(chatRoomId), { params: { page, limit, before } })).data;
};

export const editMessage = async (data: EditMessageDto) => {
  return (await apiClient.patch(CHAT_MESSAGE.EDIT_MESSAGE(data.messageId), { content: data.content })).data;
};

export const deleteMessage = async (data: DeleteMessageDto) => {
  return (await apiClient.delete(CHAT_MESSAGE.DELETE_MESSAGE(data.messageId))).data;
};

export const createSystemMessage = async (data: CreateSystemMessageDto) => {
  return apiClient.post(CHAT_MESSAGE.CREATE_SYSTEM_MESSAGE, data);
};
