import mongoose, { Types } from "mongoose";
import { IInviteGroupService } from "../interfaces/inviteGroup.service.interface";
import { IInviteGroupRepository } from "../interfaces/inviteGroup.repository.interface";
import { IInviteGroup } from "../interfaces/inviteGroup.model.interface";
import {
  CreateInviteGroupDTO,
  InviteGroupFilterDTO,
  JoinInviteRequestDTO,
  CreateInviteRequestDTO,
} from "../dtos/inviteGroup.dto";
import { SocketService } from "../../../services/socket.service";
import { IShowtimeService } from "../../showtimes/interfaces/showtimes.service.interface";

export class InviteGroupService implements IInviteGroupService {
  constructor(
    private inviteGroupRepository: IInviteGroupRepository,
    private socketService: SocketService,
    private showTimeService: IShowtimeService
  ) {}

async createInviteGroup(
  inviteData: CreateInviteRequestDTO,
  hostUserId: string
): Promise<IInviteGroup> {
  try {
    const inviteId = 
      inviteData.inviteId ||
      `INV_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const seatNumbers = inviteData.requestedSeats.map(seat => seat.seatNumber);
    
    const holdResult = await this.showTimeService.holdSeatsForGroup(
      inviteData.showtimeId,
      {
        seatNumbers,
        userId: hostUserId,
        sessionId: inviteId, 
        inviteGroupId: inviteId,
        holdDurationMinutes: 180,
      }
    );

    if (!holdResult.success) {
      throw new Error(`Failed to hold seats: ${holdResult.message}`);
    }

    if (holdResult.data!.heldSeats.length === 0) {
      throw new Error("No seats could be held for the group invite.");
    }

    const hostExistingSeats = inviteData.requestedSeats.filter(seat => 
      holdResult.data!.failedSeats.includes(seat.seatNumber)
    );

    const newlyHeldSeats = inviteData.requestedSeats.filter(seat => 
      holdResult.data!.heldSeats.includes(seat.seatNumber)
    );
    const allInviteSeats = [...hostExistingSeats, ...newlyHeldSeats];
    const totalInviteAmount = allInviteSeats.reduce((total, seat) => total + seat.price, 0);

    const allParticipants = [
      ...(inviteData.participants?.map((participant) => ({
        ...participant,
        paymentStatus: hostExistingSeats.some(seat => 
    seat.seatNumber === participant.seatAssigned
  ) ? "completed" : participant.paymentStatus,
        userId: new Types.ObjectId(participant.userId),
      })) || [])
    ];

    const completeInviteData = {
      inviteId,
      hostUserId: new Types.ObjectId(hostUserId),
      showtimeId: new Types.ObjectId(inviteData.showtimeId),
      movieId: new Types.ObjectId(inviteData.movieId),
      theaterId: new Types.ObjectId(inviteData.theaterId),
      screenId: new Types.ObjectId(inviteData.screenId),
  expiresAt: (() => {
    const showDateTime = new Date(inviteData.showDate);
    const [hours, minutes] = inviteData.showTime.split(':').map(Number);
    showDateTime.setUTCHours(hours, minutes, 0, 0);
    return new Date(showDateTime.getTime() - (4 * 60 * 60 * 1000));
  })(),

      requestedSeats: allInviteSeats.map((seat) => ({
        seatNumber: seat.seatNumber,
        seatRow: seat.seatRow || seat.seatNumber.charAt(0),
        seatType: seat.seatType,
        price: seat.price,
        isOccupied: hostExistingSeats.some(h => h.seatNumber === seat.seatNumber), 
      })),

      totalSlotsRequested: allInviteSeats.length,
      availableSlots: newlyHeldSeats.length, 

      showDate: inviteData.showDate ? new Date(inviteData.showDate) : new Date(),
      showTime: inviteData.showTime || "00:00",

      totalAmount: totalInviteAmount,
      paidAmount: hostExistingSeats.reduce((total, seat) => total + seat.price, 0), 
      currency: inviteData.currency || "INR",

      priceBreakdown: inviteData.priceBreakdown,

      ...(inviteData.couponUsed && {
        couponUsed: {
          ...inviteData.couponUsed,
          couponId: new Types.ObjectId(inviteData.couponUsed.couponId),
        },
      }),

      participants: allParticipants,

      minRequiredRating: inviteData.minRequiredRating,
      status: inviteData.status || "pending",
    };

    const inviteGroup = await this.inviteGroupRepository.createInviteGroup(
      completeInviteData
    );

    this.socketService.emitSeatHold(
      inviteGroup.showtimeId.toString(),
      holdResult.data!.heldSeats,
      inviteGroup.inviteId
    );

    console.log(` Created invite group with ${allInviteSeats.length} total seats:`);
    console.log(`   - Host's existing seats: ${hostExistingSeats.map(s => s.seatNumber).join(', ')}`);
    console.log(`   - Available for others: ${newlyHeldSeats.map(s => s.seatNumber).join(', ')}`);

    return inviteGroup;
  } catch (error) {
    console.error("Service error details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(`Create invite group failed: ${errorMessage}`);
  }
}


  async cancelInviteGroup(
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
  }> {
    try {
      const inviteGroup = await this.getInviteGroupById(inviteId);

      if (!inviteGroup) {
        return {
          success: false,
          message: "Invite group not found",
        };
      }

      if (inviteGroup.hostUserId._id.toString() !== hostUserId) {
        return {
          success: false,
          message: "Only the host can cancel the invite group",
        };
      }

      const nonHostParticipants = inviteGroup.participants.filter(
        (p) => p.userId.toString() !== hostUserId && p.role !== "host"
      );

      if (nonHostParticipants.length > 0) {
        return {
          success: false,
          message: `Cannot cancel - ${nonHostParticipants.length} people have already joined and paid. Contact support if needed.`,
        };
      }

      if (inviteGroup.status === "completed") {
        return {
          success: false,
          message: "Cannot cancel - group booking is already completed",
        };
      }

      if (inviteGroup.status === "cancelled") {
        return {
          success: false,
          message: "Invite group is already cancelled",
        };
      }

      const participantDetails = inviteGroup.participants
        .filter((p) => p.ticketId && p.amount)
        .map((p) => ({
          ticketId: p.ticketId as mongoose.Types.ObjectId,
          amount: p.amount as number,
          userId: p.userId as mongoose.Types.ObjectId,
          seatAssigned: p.seatAssigned || "",
        }));

      const releaseResult = await this.showTimeService.releaseHeldSeats(
        inviteGroup.showtimeId.toString(),
        { inviteGroupId: inviteId }
      );

      if (!releaseResult.success) {
        console.warn("Failed to release held seats:", releaseResult.message);
      }

      const updatedInviteGroup =
        await this.inviteGroupRepository.updateInviteGroupStatus(inviteId, {
          status: "cancelled",
          cancelledAt: new Date(),
        });

      if (updatedInviteGroup) {
        const seatNumbers = inviteGroup.requestedSeats.map(
          (seat) => seat.seatNumber
        );

        this.socketService.emitSeatRelease(
          inviteGroup.showtimeId.toString(),
          seatNumbers
        );

        this.socketService.emitInviteCancelled(inviteId);
      }

      return {
        success: true,
        message: "Invite group cancelled successfully",
        participantDetails:
          participantDetails.length > 0 ? participantDetails : undefined,
      };
    } catch (error) {
      console.error(` [BACKEND] cancelInviteGroup error:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message: `Cancel invite group failed: ${errorMessage}`,
      };
    }
  }

  async getAvailableInvites(
    userId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]> {
    try {
      return await this.inviteGroupRepository.findInvitesByUserId(
        userId,
        filters
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Get available invites failed: ${errorMessage}`);
    }
  }

  async getUserInviteGroups(
    hostUserId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]> {
    try {
      return await this.inviteGroupRepository.findInviteGroupsByHostUserId(
        hostUserId,
        filters
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Get user invite groups failed: ${errorMessage}`);
    }
  }

  async getInviteGroupsByShowtime(
    showtimeId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]> {
    try {
      return await this.inviteGroupRepository.findInviteGroupByShowtimeId(
        showtimeId,
        filters
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Get invite groups by showtime failed: ${errorMessage}`);
    }
  }

  async getInviteGroupById(inviteId: string): Promise<IInviteGroup | null> {
    try {
      return await this.inviteGroupRepository.findInviteGroupByInviteId(
        inviteId
      );
    } catch (error) {
      return null;
    }
  }

  async confirmJoinAfterPayment(
    inviteId: string,
    userId: string,
    amount: number,
    ticketId: string
  ): Promise<{
    success: boolean;
    inviteGroup?: IInviteGroup;
    message: string;
  }> {
    try {
      const inviteGroup = await this.getInviteGroupById(inviteId);

      if (!inviteGroup) {
        return {
          success: false,
          message: "Invite group not found",
        };
      }

      const isAlreadyParticipant = inviteGroup.participants.some(
        (p) => p.userId.toString() === userId
      );

      if (isAlreadyParticipant) {
        return {
          success: false,
          message: "You are already part of this invite group",
        };
      }

      if (inviteGroup.availableSlots <= 0) {
        return {
          success: false,
          message: "No available slots in this group",
        };
      }

      const availableSeatIndex = this.findAvailableSeatIndex(inviteGroup);
      const assignedSeat = inviteGroup.requestedSeats[availableSeatIndex];

      const participantData = {
        userId: new Types.ObjectId(userId),
        seatAssigned: assignedSeat.seatNumber,
        seatIndex: availableSeatIndex,
        amount: amount,
        ticketId,
      };

      const updatedInviteGroup =
        await this.inviteGroupRepository.addParticipantToInvite(
          inviteId,
          participantData
        );

      if (updatedInviteGroup) {
        await this.inviteGroupRepository.updateParticipantPaymentStatus(
          inviteId,
          userId,
          {
            paymentStatus: "completed",
            paidAt: new Date(),
          }
        );

        this.socketService.emitParticipantJoined(inviteId, {
          inviteId: inviteId,
          availableSlots: updatedInviteGroup.availableSlots,
          totalJoined: updatedInviteGroup.participants.length,
        });
        console.log("🚀 SOCKET EVENT SENT: participant_joined", {
          inviteId: inviteId,
          availableSlots: updatedInviteGroup.availableSlots,
          totalJoined: updatedInviteGroup.participants.length,
        });

        if (updatedInviteGroup.availableSlots === 0) {
          const finalInviteGroup =
            await this.inviteGroupRepository.updateInviteGroupStatus(inviteId, {
              status: "completed",
              completedAt: new Date(),
            });

          this.socketService.emitGroupCompleted(inviteId, {
            inviteId: inviteId,
            status: "completed",
          });

          return {
            success: true,
            inviteGroup: finalInviteGroup,
            message: "Successfully joined the invite group",
          };
        }

        return {
          success: true,
          inviteGroup: updatedInviteGroup,
          message: "Successfully joined the invite group",
        };
      }

      return {
        success: false,
        message: "Failed to add participant to invite group",
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message: `Join invite group failed: ${errorMessage}`,
      };
    }
  }

  async leaveInviteGroup(
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
  }> {
    try {
      const result =
        await this.inviteGroupRepository.removeParticipantFromInvite(
          inviteId,
          userId
        );

      if (result.updatedInviteGroup && result.removedParticipant) {
        const socketData = {
          inviteId: inviteId,
          leftUserId: userId,
          availableSlots: result.updatedInviteGroup.availableSlots,
          releasedSeat: result.removedParticipant.seatAssigned,
          releasedSeatPrice: result.removedParticipant.amount,
        };

        this.socketService.emitParticipantLeft(inviteId, socketData);
      } else {
        console.error(` [BACKEND] Cannot emit socket - missing data:`, {
          updatedInviteGroup: !!result.updatedInviteGroup,
          removedParticipant: !!result.removedParticipant,
        });
      }

      return {
        success: true,
        inviteGroup: result.updatedInviteGroup,
        message: "Successfully left the invite group",
        participantData: result.removedParticipant,
      };
    } catch (error) {
      console.error(` [BACKEND] leaveInviteGroup error:`, error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return {
        success: false,
        message: `Leave invite group failed: ${errorMessage}`,
      };
    }
  }

  private findAvailableSeatIndex(inviteGroup: IInviteGroup): number {
    const occupiedIndices = inviteGroup.participants.map((p) => p.seatIndex);
    for (let i = 0; i < inviteGroup.requestedSeats.length; i++) {
      if (!occupiedIndices.includes(i)) {
        return i;
      }
    }

    return inviteGroup.participants.length;
  }
}
