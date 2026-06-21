import { USER_INVITE_GROUPS } from "../../constants/userConstants/inviteGroupConstants";
import apiClient from "../../Utils/apiClient";
import {
  CreateInviteGroupRequestDto,
  InviteGroupResponseDto,
} from "../../dtos/booking.dto";

/** @deprecated Use CreateInviteGroupRequestDto */
export type CreateInviteGroupPayload = CreateInviteGroupRequestDto;

/** @deprecated Use InviteGroupResponseDto */
export type inviteDto = InviteGroupResponseDto;

export const createInviteGroup = async (
  inviteData: CreateInviteGroupRequestDto
): Promise<InviteGroupResponseDto> => {
  const data = await apiClient.post(USER_INVITE_GROUPS.CREATE_GROUP, inviteData);
  return data.data;
};

export const getAvailableInvites = async (filters?: {
  limit?: number;
  skip?: number;
  minRating?: number;
  showtimeId?: string;
  status?: string;
}): Promise<InviteGroupResponseDto> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.minRating) params.append('minRating', filters.minRating.toString());
    if (filters.showtimeId) params.append('showtimeId', filters.showtimeId);
    if (filters.status) params.append('status', filters.status);
  }

  const url = `${USER_INVITE_GROUPS.GET_GROUPS}${params.toString() ? `?${params.toString()}` : ''}`;
  const data = await apiClient.get(url);
  return data.data;
};

export const getMyInviteGroups = async (filters?: {
  limit?: number;
  skip?: number;
  status?: string;
}): Promise<InviteGroupResponseDto> => {
  const params = new URLSearchParams();
  if (filters) {
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.skip) params.append('skip', filters.skip.toString());
    if (filters.status) params.append('status', filters.status);
  }

  const url = `${USER_INVITE_GROUPS.MY_INVITES}${params.toString() ? `?${params.toString()}` : ''}`;
  const data = await apiClient.get(url);
  return data.data;
};

export const getInviteGroupById = async (inviteId: string): Promise<InviteGroupResponseDto> => {
  const data = await apiClient.get(`${USER_INVITE_GROUPS.BASE}/${inviteId}`);
  return data.data;
};

export const confirmJoinInviteGroup = async (joinData: {
  inviteId: string;
  totalAmount: number;
  ticketId: string;
}): Promise<InviteGroupResponseDto> => {
  const data = await apiClient.post(USER_INVITE_GROUPS.JOIN_INVITE, joinData);
  return data.data;
};

export const leaveInviteGroup = async (inviteId: string): Promise<InviteGroupResponseDto> => {
  const data = await apiClient.post(USER_INVITE_GROUPS.LEAVE_INVITE(inviteId), {});
  return data.data;
};

export const cancelInviteGroup = async (inviteId: string): Promise<InviteGroupResponseDto> => {
  const data = await apiClient.delete(USER_INVITE_GROUPS.CANCEL_INVITE(inviteId));
  return data.data;
};
