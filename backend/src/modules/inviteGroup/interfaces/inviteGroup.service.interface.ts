import { IInviteGroup } from './inviteGroup.model.interface';
import { 
  CreateInviteRequestDTO,
  InviteGroupFilterDTO,
  JoinInviteRequestDTO
} from '../dtos/inviteGroup.dto';
import mongoose from 'mongoose';

export interface IInviteGroupService {
createInviteGroup(
  inviteData: CreateInviteRequestDTO,
  hostUserId: string
): Promise<IInviteGroup>   
  getAvailableInvites(userId: string, filters?: InviteGroupFilterDTO): Promise<IInviteGroup[]>;
  
  getUserInviteGroups(hostUserId: string, filters?: InviteGroupFilterDTO): Promise<IInviteGroup[]>;
  
  getInviteGroupsByShowtime(showtimeId: string, filters?: InviteGroupFilterDTO): Promise<IInviteGroup[]>;
  
  getInviteGroupById(inviteId: string): Promise<IInviteGroup | null>;
  
  confirmJoinAfterPayment(
    inviteId: string, 
    userId: string, 
     amount: number ,
    ticketId:string
  ): Promise<{
    success: boolean;
    inviteGroup?: IInviteGroup;
    message: string;
  }>;
leaveInviteGroup(
  inviteId: string,
  userId: string
): Promise<{
  success: boolean;
  inviteGroup?: IInviteGroup;
  message: string;
  participantData?: { 
    ticketId?: mongoose.Types.ObjectId; 
    amount?: number; 
    paymentStatus?: string;
    seatAssigned?: string;
  };
}>
cancelInviteGroup(
  inviteId: string,
  hostUserId: string
): Promise<{
  success: boolean;
  message: string;
  participantDetails?: Array<{
    ticketId: mongoose.Types.ObjectId;
    amount: number;
    userId: mongoose.Types.ObjectId;
    seatAssigned: string;
  }>;
}> }
