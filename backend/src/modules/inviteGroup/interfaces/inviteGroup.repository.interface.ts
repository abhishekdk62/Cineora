import { IInviteGroup } from "./inviteGroup.model.interface";
import {
  CreateInviteGroupDTO,
  AddParticipantDTO,
  UpdatePaymentStatusDTO,
  UpdateInviteStatusDTO,
  InviteGroupFilterDTO,
} from "../dtos/inviteGroup.dto";
import mongoose from "mongoose";

export interface IInviteGroupRepository {
  createInviteGroup(
    inviteGroupData: CreateInviteGroupDTO
  ): Promise<IInviteGroup>;

  findInviteGroupsByHostUserId(
    hostUserId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]>;

  findInvitesByUserId(
    userId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]>;

  findInviteGroupByShowtimeId(
    showtimeId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]>;
  findInviteGroupByInviteId(inviteId: string): Promise<IInviteGroup | null>;
  addParticipantToInvite(
    inviteId: string,
    participantData: AddParticipantDTO,
  ): Promise<IInviteGroup | null>;
removeParticipantFromInvite(
  inviteId: string,
  userId: string
): Promise<{ 
  updatedInviteGroup: IInviteGroup | null; 
  removedParticipant: { 
    ticketId?: mongoose.Types.ObjectId; 
    amount?: number; 
    paymentStatus?: string;
    seatAssigned?: string;
  } | null 
}> ,  updateParticipantPaymentStatus(
    inviteId: string,
    userId: string,
    paymentData: UpdatePaymentStatusDTO
  ): Promise<IInviteGroup | null>;

  updateInviteGroupStatus(
    inviteId: string,
    statusData: UpdateInviteStatusDTO
  ): Promise<IInviteGroup | null>;
}
