import Ticket from "../models/ticket.model";
import { ITicketRepository } from "../interfaces/ticket.repository.interface";
import { ITicket } from "../interfaces/ticket.model.interface";
import mongoose, { FilterQuery, PipelineStage } from "mongoose";
import { TicketMatchCondition } from "../../user/dtos/dto";

export class TicketRepository implements ITicketRepository {
  async createTicket(ticketData: Partial<ITicket>): Promise<ITicket | null> {
    try {
      const ticket = new Ticket(ticketData);
      return await ticket.save();
    } catch (error) {
      throw new Error(
        `Failed to create ticket: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async createBulkTickets(ticketsData: Partial<ITicket>[]): Promise<ITicket[]> {
    try {
     
      
      const result = await Ticket.insertMany(ticketsData);
      return result as ITicket[];
    } catch (error) {
      throw new Error(
        `Failed to create bulk tickets: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async updateTicketById(
    ticketId: string,
    updateData: Partial<ITicket>
  ): Promise<ITicket | null> {
    try {
      return await Ticket.findByIdAndUpdate(ticketId, updateData, {
        new: true,
      });
    } catch (error) {
      throw new Error(
        `Failed to update ticket: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
async findTicketsByIds(ticketIds: string[]): Promise<ITicket[]> {
  try {
    return await Ticket.find({ 
      _id: { $in: ticketIds } 
    })
    .populate("userId")
    .populate("movieId") 
    .populate("theaterId")
    .populate("screenId")
    .populate("showtimeId")
  } catch (error) {
    throw new Error(
      `Failed to find tickets by IDs: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

// Optional: Enhanced method to get tickets with more details for cancellation
async findTicketsForCancellation(ticketIds: string[]): Promise<ITicket[]> {
  try {
    return await Ticket.find({ 
      _id: { $in: ticketIds },
      status: { $in: ['confirmed'] } // Only get confirmed tickets
    })
    .populate("userId", "firstName lastName email")
    .populate("movieId", "title duration") 
    .populate("theaterId", "name location")
    .populate("screenId", "name")
    .populate("showtimeId")
    .populate("bookingId");
  } catch (error) {
    throw new Error(
      `Failed to find tickets for cancellation: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

  async markTicketAsUsed(ticketId: string): Promise<ITicket | null> {
    try {
      return await Ticket.findOneAndUpdate(
        { ticketId },
        { isUsed: true, usedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      throw new Error(
        `Failed to mark ticket as used: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async deleteTicketById(ticketId: string): Promise<boolean> {
    try {
      const result = await Ticket.findByIdAndDelete(ticketId);
      return !!result;
    } catch (error) {
      throw new Error(
        `Failed to delete ticket: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findTicketById(ticketId: string): Promise<ITicket | null> {
    try {
      return await Ticket.findById(ticketId)
        .populate("bookingId")
        .populate("userId");
    } catch (error) {
      throw new Error(
        `Failed to find ticket by ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findTicketByTicketId(ticketId: string): Promise<ITicket | null> {
    try {
      return await Ticket.findOne({ ticketId })
        .populate("bookingId")
        .populate("userId");
    } catch (error) {
      throw new Error(
        `Failed to find ticket by ticket ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findTicketsByBookingId(bookingId: string): Promise<ITicket[]> {
    try {
      return await Ticket.find({ bookingId }).populate("userId");
    } catch (error) {
      throw new Error(
        `Failed to find tickets by booking ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findTicketsByUserId(userId: string): Promise<ITicket[]> {
    try {
      return await Ticket.find({ userId }).sort({ showDate: -1 });
    } catch (error) {
      throw new Error(
        `Failed to find tickets by user ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
  async findTicketsByUserIdPaginated(
    userId: string,
    page: number = 1,
    limit: number = 10,
    types: ("upcoming" | "past" | "cancelled" | "all")[]
  ): Promise<{
    tickets: ITicket[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    try {
      const now = new Date();
console.log(types);

      const skipCount = (page - 1) * limit;
      const sampleTickets = await Ticket.find({
        userId: new mongoose.Types.ObjectId(userId),
      }).limit(5);
      sampleTickets.forEach((ticket, index) => {
        console.log(
          `   ${index + 1}. showDate: ${ticket.showDate}, status: ${
            ticket.status
          }`
        );
      });

      const pipeline: PipelineStage[] = [
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $lookup: {
            from: "showtimes",
            localField: "showtimeId",
            foreignField: "_id",
            as: "showtime",
          },
        },
        {
          $unwind: {
            path: "$showtime",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "movies",
            localField: "movieId",
            foreignField: "_id",
            as: "movie",
          },
        },
        {
          $unwind: {
            path: "$movie",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "theaters",
            localField: "theaterId",
            foreignField: "_id",
            as: "theater",
          },
        },
        {
          $unwind: {
            path: "$theater",
            preserveNullAndEmptyArrays: true,
          },
        },
          {
    $lookup: {
      from: "coupons", 
      localField: "couponId",
      foreignField: "_id",
      as: "coupon",
    },
  },
  { $unwind: { path: "$coupon", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "screens",
            localField: "screenId",
            foreignField: "_id",
            as: "screen",
          },
        },
        {
          $unwind: {
            path: "$screen",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      if (!types.includes("all")) {
        const filterConditions: TicketMatchCondition[] = [];

        if (types.includes("cancelled")) {
          filterConditions.push({ status: "cancelled" });
        }

        if (types.includes("past")) {
          filterConditions.push(
            { status: { $in: ["used", "expired",'cancelled'] } },
            {
              $and: [{ status: "confirmed" }, { showDate: { $lt: now } }],
            }
          );
        }

       if (types.includes("upcoming")) {
  filterConditions.push({
    $and: [{ status: "confirmed" }, { showDate: { $gte: now } }],
  });
}


        if (filterConditions.length > 0) {
          pipeline.push({
            $match: {
              $or: filterConditions,
            },
          });
        }
      }
      const debugPipeline = [...pipeline];
      const debugResult = await Ticket.aggregate([
        ...debugPipeline,
        { $project: { showDate: 1, status: 1, "movie.title": 1 } },
        { $limit: 3 },
      ]);

      pipeline.push({
        $facet: {
          tickets: [
            { $sort: { showDate: -1, createdAt: -1 } },
            { $skip: skipCount },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      });

      const result = await Ticket.aggregate(pipeline);

      const tickets = result[0]?.tickets || [];
      const total = result[0]?.totalCount[0]?.count || 0;

      return {
        tickets,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new Error(
        `Failed to find paginated tickets by user ID: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findUpcomingTickets(userId: string): Promise<ITicket[]> {
    try {
      const currentDate = new Date();
      return await Ticket.find({
        userId,
        showDate: { $gte: currentDate },
        isUsed: false,
      }).sort({ showDate: 1 });
    } catch (error) {
      throw new Error(
        `Failed to find upcoming tickets: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findTicketHistory(userId: string): Promise<ITicket[]> {
    try {
      return await Ticket.find({ userId }).sort({ showDate: -1 });
    } catch (error) {
      throw new Error(
        `Failed to find ticket history: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async validateTicket(
    ticketId: string,
    qrCode: string
  ): Promise<ITicket | null> {
    try {
      return await Ticket.findOne({ ticketId, qrCode, isUsed: false });
    } catch (error) {
      throw new Error(
        `Failed to validate ticket: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }
}
