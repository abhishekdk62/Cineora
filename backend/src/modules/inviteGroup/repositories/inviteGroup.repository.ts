import { IInviteGroup } from "../interfaces/inviteGroup.model.interface";
import { IInviteGroupRepository } from "../interfaces/inviteGroup.repository.interface";
import InviteGroup from "../models/inviteGroup.model";
import {
  CreateInviteGroupDTO,
  AddParticipantDTO,
  UpdatePaymentStatusDTO,
  UpdateInviteStatusDTO,
  InviteGroupFilterDTO,
} from "../dtos/inviteGroup.dto";
import mongoose from "mongoose";

export class InviteGroupRepository implements IInviteGroupRepository {
  async createInviteGroup(inviteGroupData: any): Promise<IInviteGroup> {
    try {
      if (!inviteGroupData.inviteId) {
        inviteGroupData.inviteId = `INV_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
      }

      const inviteGroup = new InviteGroup(inviteGroupData);

      const savedInviteGroup = await inviteGroup.save();
      if (!savedInviteGroup) {
        throw new Error("Failed to create invite group");
      }

      return savedInviteGroup;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Create invite group failed: ${errorMessage}`);
    }
  }

  async findInviteGroupsByHostUserId(
    hostUserId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]> {
    try {
      const query: any = { hostUserId };
      const inviteGroups = await InviteGroup.find(query)
        .populate("hostUserId", "username profilePicture groupBookingStats")
        .populate("movieId", "title poster")
        .populate("screenId", "name layout features")
        .populate("theaterId", "name location")
        .sort({ createdAt: -1 })
        .limit(filters?.limit || 20)
        .skip(filters?.skip || 0)
        .lean();

      return inviteGroups;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Find invite groups by host failed: ${errorMessage}`);
    }
  }

  async findInvitesByUserId(
    userId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]> {
    try {
      const query: any = {
        status: { $ne: "cancelled" },
            hostUserId: { $ne: userId },           // 🚫 exclude groups you hosted

        $or: [

          { status: "completed" }, // Show completed regardless of slots
          {
            status: { $in: ["pending", "active"] },
            availableSlots: { $gt: 0 }, // Only check slots for pending/active
          },
        ],
      };

      if (filters?.minRating) {
        query.minRequiredRating = { $lte: filters.minRating };
      }

      if (filters?.showtimeId) {
        query.showtimeId = filters.showtimeId;
      }

      const inviteGroups = await InviteGroup.find(query)
        .populate("hostUserId", "username profilePicture groupBookingStats")
        .populate("movieId", "title poster")
        .populate("screenId", "name layout features screenType")
        .populate("theaterId", "name location")
        .sort({
          // ✅ Sort by status first (pending/active first), then by creation date
          status: 1,
          createdAt: -1,
        })
        .limit(filters?.limit || 20)
        .skip(filters?.skip || 0)
        .lean();

      return inviteGroups;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Find invites by userId failed: ${errorMessage}`);
    }
  }

  async findInviteGroupByInviteId(
    inviteId: string
  ): Promise<IInviteGroup | null> {
    try {
      const inviteGroup = await InviteGroup.findOne({ inviteId })
        .populate("hostUserId", "username profilePicture groupBookingStats")
        .populate("movieId", "title poster")
        .populate("theaterId", "name location")
        .populate("participants.userId", "username profilePicture")
        .lean();

      return inviteGroup;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Find invite group by invite ID failed: ${errorMessage}`);
    }
  }

  async findInviteGroupByShowtimeId(
    showtimeId: string,
    filters?: InviteGroupFilterDTO
  ): Promise<IInviteGroup[]> {
    try {
      const query: any = {
        showtimeId,

        status: { $in: filters?.status || ["pending", "active"] },
      };

      const inviteGroups = await InviteGroup.find(query)
        .populate("hostUserId", "username profilePicture groupBookingStats")
        .sort({ createdAt: -1 })
        .lean();

      return inviteGroups;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Find invite groups by showtime failed: ${errorMessage}`);
    }
  }

  async addParticipantToInvite(
    inviteId: string,
    participantData: any
  ): Promise<IInviteGroup | null> {
    try {
      const result = await InviteGroup.findOneAndUpdate(
        { inviteId },
        {
          $push: { participants: participantData },
          $inc: { availableSlots: -1 }, // ✅ Decrease available slots
        },
        { new: true, runValidators: true }
      );

      return result;
    } catch (error) {
      throw error;
    }
  }

  async removeParticipantFromInvite(
    inviteId: string,
    userId: string
  ): Promise<{
    updatedInviteGroup: IInviteGroup | null;
    removedParticipant: {
      ticketId?: mongoose.Types.ObjectId;
      amount?: number;
      paymentStatus?: string;
      seatAssigned?: string;
    } | null;
  }> {
    try {
      // First, find the invite group to get participant details before removal
      const inviteGroup = await InviteGroup.findOne({ inviteId });

      if (!inviteGroup) {
        return { updatedInviteGroup: null, removedParticipant: null };
      }

      // Find the specific participant being removed
      const participantToRemove = inviteGroup.participants.find(
        (participant) => participant.userId.toString() === userId
      );

      // Extract participant data before removal
      const removedParticipant = participantToRemove
        ? {
            ticketId: participantToRemove.ticketId,
            amount: participantToRemove.amount,
            paymentStatus: participantToRemove.paymentStatus,
            seatAssigned: participantToRemove.seatAssigned,
          }
        : null;

      // Remove the participant and increment available slots
      const updatedInviteGroup = await InviteGroup.findOneAndUpdate(
        { inviteId },
        {
          status: "active",
          $pull: { participants: { userId: userId } },
          $inc: { availableSlots: 1 },
        },
        { new: true }
      );

      return {
        updatedInviteGroup,
        removedParticipant,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Remove participant failed: ${errorMessage}`);
    }
  }

  async updateParticipantPaymentStatus(
    inviteId: string,
    userId: string,
    paymentData: UpdatePaymentStatusDTO
  ): Promise<IInviteGroup | null> {
    try {
      const updatedInviteGroup = await InviteGroup.findOneAndUpdate(
        {
          inviteId,
          "participants.userId": userId,
        },
        {
          $set: {
            "participants.$.paymentStatus": paymentData.paymentStatus,

            "participants.$.paidAt": paymentData.paidAt || new Date(),
          },
          ...(paymentData.paymentStatus === "completed" && {
            $inc: { paidAmount: 0 }, // Will be calculated in service
          }),
        },
        { new: true }
      );

      return updatedInviteGroup;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Update payment status failed: ${errorMessage}`);
    }
  }

  async updateInviteGroupStatus(
    inviteId: string,
    statusData: UpdateInviteStatusDTO
  ): Promise<IInviteGroup | null> {
    try {
      const updateData: any = {
        status: statusData.status,
      };

      if (statusData.completedAt) {
        updateData.completedAt = statusData.completedAt;
      }

      if (statusData.cancelledAt) {
        updateData.cancelledAt = statusData.cancelledAt;
      }

      const existingInvite = await InviteGroup.findOne({ inviteId });

      const updatedInviteGroup = await InviteGroup.findOneAndUpdate(
        { inviteId },
        { $set: updateData },
        {
          new: true,
          runValidators: true, // ✅ Add this
        }
      );
console.log('participantDetails at repo',updatedInviteGroup);

      return updatedInviteGroup;
    } catch (error) {
      console.error("❌ Update status error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      throw new Error(`Update invite group status failed: ${errorMessage}`);
    }
  }
}
