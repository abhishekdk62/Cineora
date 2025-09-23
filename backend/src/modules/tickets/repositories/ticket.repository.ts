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
        _id: { $in: ticketIds },
      })
        .populate("userId")
        .populate("movieId")
        .populate("theaterId")
        .populate("screenId")
        .populate("showtimeId");
    } catch (error) {
      throw new Error(
        `Failed to find tickets by IDs: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  async findTicketsForCancellation(ticketIds: string[]): Promise<ITicket[]> {
    try {
      return await Ticket.find({
        _id: { $in: ticketIds },
        status: { $in: ["confirmed"] }, 
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

async markTicketAsUsed(ticketId: string): Promise<ITicket> {
  try {
    const updatedTicket = await Ticket.findOneAndUpdate(
      { ticketId },
      { 
        isUsed: true, 
        usedAt: new Date(),
        status: "used"
      },
      { new: true }
    )
    .populate("movieId", "title")
    .populate("theaterId", "name")
    .populate("screenId", "name")
    .populate("userId", "firstName lastName email");

    if (!updatedTicket) {
      throw new Error("Ticket not found");
    }

    return updatedTicket;
  } catch (error) {
    throw new Error(
      `Failed to mark ticket as used: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async findTicketByTicketId(ticketId: string): Promise<ITicket | null> {
  try {
    return await Ticket.findOne({ ticketId })
      .populate("bookingId" ,"selectedSeats bookingStatus")
      .populate("userId", "firstName lastName email")
      .populate("movieId", "title poster")
      .populate("theaterId", "name location") 
      .populate("screenId", "name");
  } catch (error) {
    throw new Error(
      `Failed to find ticket by ticket ID: ${
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
  types: ("upcoming" | "history" | "cancelled" | "all")[]
): Promise<{
  tickets: ITicket[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const now = new Date();
    const skipCount = (page - 1) * limit;

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
        $addFields: {
          showEndTime: {
            $dateAdd: {
              startDate: {
                $dateFromString: {
                  dateString: {
                    $concat: [
                      { $dateToString: { format: "%Y-%m-%d", date: "$showDate" } },
                      "T",
                      "$showTime",
                      ":00.000Z"
                    ]
                  }
                }
              },
              unit: "minute",
              amount: { $ifNull: ["$movie.duration", 180] } 
            }
          },
          showStartTime: {
            $dateFromString: {
              dateString: {
                $concat: [
                  { $dateToString: { format: "%Y-%m-%d", date: "$showDate" } },
                  "T",
                  "$showTime",
                  ":00.000Z"
                ]
              }
            }
          }
        }
      }
    ];

    if (!types.includes("all")) {
      const matchConditions = [];

      if (types.includes("upcoming")) {
        matchConditions.push({
          $and: [
            { status: "confirmed" },
            { showStartTime: { $gt: now } }
          ]
        });
      }

      if (types.includes("history")) {
        matchConditions.push({
          $and: [
            { status: { $in: ["confirmed", "used", "expired"] } },
            { showEndTime: { $lt: now } }
          ]
        });
      }

      if (types.includes("cancelled")) {
        matchConditions.push({
          status: "cancelled"
        });
      }

      pipeline.push({
        $match: {
          $or: matchConditions
        }
      });
    }

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
