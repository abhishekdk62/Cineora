import mongoose, { PipelineStage, Types } from "mongoose";
import { IAnalyticsRepository } from "../interfaces/adminAnalytics.repository.interface";
import Booking from "../../bookings/models/bookings.model";
import MovieShowtime from "../../showtimes/models/showtimes.model";

import {Movie} from "../../movies/models/movies.model";
import { Review } from "../../reviews/models/review.model";
import {User} from '../../user/models/user.model'
import {Owner} from '../../owner/models/owner.model'
import {Theater} from '../../theaters/models/theater.model'
import { IDateRange } from "../dtos/dtos";

export class AdminAnalyticsRepository implements IAnalyticsRepository {

  private buildDateMatch(dateRange: IDateRange): any {
    const match: any = {};
    if (dateRange.startDate) {
      match.$gte = new Date(dateRange.startDate);
    }
    if (dateRange.endDate) {
      match.$lte = new Date(dateRange.endDate);
    }
    return Object.keys(match).length > 0 ? match : { $gte: new Date(0) };
  }

  // Platform-wide aggregations
  async getAggregateRevenue(dateRange: IDateRange): Promise<number> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed",
            paymentStatus: "completed"
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$priceDetails.total" }
          }
        }
      ]);

      return result[0]?.totalRevenue || 0;
    } catch (error) {
      throw new Error(`Failed to get aggregate revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAggregateBookings(dateRange: IDateRange): Promise<number> {
    try {
      return await Booking.countDocuments({
        createdAt: this.buildDateMatch(dateRange),
        bookingStatus: "confirmed"
      });
    } catch (error) {
      throw new Error(`Failed to get aggregate bookings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAggregateOccupancy(dateRange: IDateRange): Promise<number> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed"
          }
        },
        {
          $lookup: {
            from: "movieshowtimes",
            localField: "showtimeId",
            foreignField: "_id",
            as: "showtime"
          }
        },
        { $unwind: "$showtime" },
        {
          $group: {
            _id: "$showtimeId",
            bookedSeats: { $sum: { $size: "$selectedSeats" } },
            totalSeats: { $first: "$showtime.totalSeats" }
          }
        },
        {
          $project: {
            occupancy: {
              $cond: {
                if: { $gt: ["$totalSeats", 0] },
                then: { $divide: ["$bookedSeats", "$totalSeats"] },
                else: 0
              }
            }
          }
        },
        {
          $group: {
            _id: null,
            avgOccupancy: { $avg: "$occupancy" }
          }
        }
      ]);

      return (result[0]?.avgOccupancy || 0) * 100; // Return as percentage
    } catch (error) {
      throw new Error(`Failed to get aggregate occupancy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTotalCustomers(dateRange: IDateRange): Promise<number> {
    try {
      return await User.countDocuments({
        createdAt: this.buildDateMatch(dateRange),
        role: "user"
      });
    } catch (error) {
      throw new Error(`Failed to get total customers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTotalOwners(): Promise<number> {
    try {
      return await Owner.countDocuments({ isActive: true });
    } catch (error) {
      throw new Error(`Failed to get total owners: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTotalTheaters(): Promise<number> {
    try {
      return await Theater.countDocuments({ isActive: true });
    } catch (error) {
      throw new Error(`Failed to get total theaters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTotalMovies(): Promise<number> {
    try {
      return await Movie.countDocuments({ isActive: true });
    } catch (error) {
      throw new Error(`Failed to get total movies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Revenue breakdowns
  async getRevenuePerTheater(dateRange: IDateRange): Promise<Array<{theaterId: Types.ObjectId; theaterName: string; revenue: number; bookings: number; occupancy: number}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed",
            paymentStatus: "completed"
          }
        },
        {
          $group: {
            _id: "$theaterId",
            revenue: { $sum: "$priceDetails.total" },
            bookings: { $sum: 1 },
            totalSeatsBooked: { $sum: { $size: "$selectedSeats" } }
          }
        },
        {
          $lookup: {
            from: "theaters",
            localField: "_id",
            foreignField: "_id",
            as: "theater"
          }
        },
        { $unwind: "$theater" },
        {
          $lookup: {
            from: "movieshowtimes",
            localField: "_id",
            foreignField: "theaterId",
            as: "showtimes",
            pipeline: [
              {
                $match: {
                  showDate: this.buildDateMatch(dateRange),
                  isActive: true
                }
              }
            ]
          }
        },
        {
          $project: {
            theaterId: "$_id",
            theaterName: "$theater.name",
            revenue: 1,
            bookings: 1,
            occupancy: {
              $cond: {
                if: { $gt: [{ $size: "$showtimes" }, 0] },
                then: {
                  $divide: [
                    "$totalSeatsBooked",
                    { $sum: "$showtimes.totalSeats" }
                  ]
                },
                else: 0
              }
            }
          }
        },
        { $sort: { revenue: -1 } }
      ]);

      return result;
    } catch (error) {
      throw new Error(`Failed to get revenue per theater: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRevenuePerOwner(dateRange: IDateRange): Promise<Array<{ownerId: Types.ObjectId; ownerName: string; revenue: number; bookings: number; occupancy: number; theatersCount: number}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed",
            paymentStatus: "completed"
          }
        },
        {
          $lookup: {
            from: "movieshowtimes",
            localField: "showtimeId",
            foreignField: "_id",
            as: "showtime"
          }
        },
        { $unwind: "$showtime" },
        {
          $group: {
            _id: "$showtime.ownerId",
            revenue: { $sum: "$priceDetails.total" },
            bookings: { $sum: 1 },
            totalSeatsBooked: { $sum: { $size: "$selectedSeats" } }
          }
        },
        {
          $lookup: {
            from: "owners",
            localField: "_id",
            foreignField: "_id",
            as: "owner"
          }
        },
        { $unwind: "$owner" },
        {
          $lookup: {
            from: "theaters",
            localField: "_id",
            foreignField: "ownerId",
            as: "theaters"
          }
        },
        {
          $project: {
            ownerId: "$_id",
            ownerName: "$owner.name",
            revenue: 1,
            bookings: 1,
            theatersCount: { $size: "$theaters" },
            occupancy: {
              $divide: ["$totalSeatsBooked", { $multiply: ["$bookings", 100] }]
            }
          }
        },
        { $sort: { revenue: -1 } }
      ]);

      return result;
    } catch (error) {
      throw new Error(`Failed to get revenue per owner: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRevenuePerMovie(dateRange: IDateRange): Promise<Array<{movieId: Types.ObjectId; movieName: string; revenue: number; bookings: number; avgRating: number}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed",
            paymentStatus: "completed"
          }
        },
        {
          $group: {
            _id: "$movieId",
            revenue: { $sum: "$priceDetails.total" },
            bookings: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "movies",
            localField: "_id",
            foreignField: "_id",
            as: "movie"
          }
        },
        { $unwind: "$movie" },
        {
          $lookup: {
            from: "reviews",
            localField: "_id",
            foreignField: "movieId",
            as: "reviews",
            pipeline: [
              { $match: { reviewType: "movie", status: "active" } }
            ]
          }
        },
        {
          $project: {
            movieId: "$_id",
            movieName: "$movie.title",
            revenue: 1,
            bookings: 1,
            avgRating: {
              $cond: {
                if: { $gt: [{ $size: "$reviews" }, 0] },
                then: { $avg: "$reviews.rating" },
                else: 0
              }
            }
          }
        },
        { $sort: { revenue: -1 } }
      ]);

      return result;
    } catch (error) {
      throw new Error(`Failed to get revenue per movie: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMonthlyRevenueTrends(dateRange: IDateRange): Promise<Array<{month: string; revenue: number; bookings: number}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed",
            paymentStatus: "completed"
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            revenue: { $sum: "$priceDetails.total" },
            bookings: { $sum: 1 }
          }
        },
        {
          $project: {
            month: {
              $concat: [
                { $toString: "$_id.year" },
                "-",
                {
                  $cond: {
                    if: { $lt: ["$_id.month", 10] },
                    then: { $concat: ["0", { $toString: "$_id.month" }] },
                    else: { $toString: "$_id.month" }
                  }
                }
              ]
            },
            revenue: 1,
            bookings: 1
          }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
      ]);

      return result;
    } catch (error) {
      throw new Error(`Failed to get monthly revenue trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDailyRevenueTrends(dateRange: IDateRange): Promise<Array<{date: string; revenue: number; bookings: number}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed",
            paymentStatus: "completed"
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" }
            },
            revenue: { $sum: "$priceDetails.total" },
            bookings: { $sum: 1 }
          }
        },
        {
          $project: {
            date: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: {
                  $dateFromParts: {
                    year: "$_id.year",
                    month: "$_id.month",
                    day: "$_id.day"
                  }
                }
              }
            },
            revenue: 1,
            bookings: 1
          }
        },
        { $sort: { date: 1 } }
      ]);

      return result;
    } catch (error) {
      throw new Error(`Failed to get daily revenue trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Customer analytics
  async getCustomerStats(dateRange: IDateRange): Promise<{totalCustomers: number; newCustomers: number; retentionRate: number; avgBookingsPerCustomer: number}> {
    try {
      const [totalCustomers, newCustomers, bookingStats] = await Promise.all([
        User.countDocuments({ role: "user" }),
        User.countDocuments({
          role: "user",
          createdAt: this.buildDateMatch(dateRange)
        }),
        Booking.aggregate([
          {
            $match: {
              createdAt: this.buildDateMatch(dateRange),
              bookingStatus: "confirmed"
            }
          },
          {
            $group: {
              _id: "$userId",
              bookingCount: { $sum: 1 }
            }
          },
          {
            $group: {
              _id: null,
              avgBookings: { $avg: "$bookingCount" },
              uniqueCustomers: { $sum: 1 }
            }
          }
        ])
      ]);

      const avgBookingsPerCustomer = bookingStats[0]?.avgBookings || 0;
      const retentionRate = totalCustomers > 0 ? (bookingStats[0]?.uniqueCustomers || 0) / totalCustomers : 0;

      return {
        totalCustomers,
        newCustomers,
        retentionRate: retentionRate * 100,
        avgBookingsPerCustomer
      };
    } catch (error) {
      throw new Error(`Failed to get customer stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCustomerSegments(dateRange: IDateRange): Promise<Array<{segment: string; count: number; percentage: number}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed"
          }
        },
        {
          $group: {
            _id: "$userId",
            bookingCount: { $sum: 1 },
            totalSpent: { $sum: "$priceDetails.total" }
          }
        },
        {
          $project: {
            userId: "$_id",
            bookingCount: 1,
            totalSpent: 1,
            segment: {
              $switch: {
                branches: [
                  { case: { $gte: ["$bookingCount", 10] }, then: "Frequent" },
                  { case: { $gte: ["$bookingCount", 5] }, then: "Regular" },
                  { case: { $gte: ["$bookingCount", 2] }, then: "Occasional" }
                ],
                default: "New"
              }
            }
          }
        },
        {
          $group: {
            _id: "$segment",
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            segments: { $push: { segment: "$_id", count: "$count" } },
            total: { $sum: "$count" }
          }
        },
        {
          $project: {
            segments: {
              $map: {
                input: "$segments",
                as: "seg",
                in: {
                  segment: "$$seg.segment",
                  count: "$$seg.count",
                  percentage: {
                    $multiply: [
                      { $divide: ["$$seg.count", "$total"] },
                      100
                    ]
                  }
                }
              }
            }
          }
        }
      ]);

      return result[0]?.segments || [];
    } catch (error) {
      throw new Error(`Failed to get customer segments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Continue with other methods...
  async getCustomerAcquisition(dateRange: IDateRange): Promise<Array<{source: string; count: number}>> {
    // Implementation would depend on how you track customer acquisition sources
    // For now, returning mock data structure
    return [
      { source: "Organic Search", count: 0 },
      { source: "Social Media", count: 0 },
      { source: "Referrals", count: 0 },
      { source: "Direct", count: 0 }
    ];
  }

  async getCustomerSatisfaction(dateRange: IDateRange): Promise<{avgRating: number; totalReviews: number; ratingDistribution: Array<{rating: number; count: number}>}> {
    try {
      const result = await Review.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            status: "active"
          }
        },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 },
            ratings: { $push: "$rating" }
          }
        },
        {
          $project: {
            avgRating: 1,
            totalReviews: 1,
            ratingDistribution: {
              $map: {
                input: [1, 2, 3, 4, 5],
                as: "rating",
                in: {
                  rating: "$$rating",
                  count: {
                    $size: {
                      $filter: {
                        input: "$ratings",
                        cond: { $eq: ["$$this", "$$rating"] }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      ]);

      return result[0] || {
        avgRating: 0,
        totalReviews: 0,
        ratingDistribution: []
      };
    } catch (error) {
      throw new Error(`Failed to get customer satisfaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Financial KPIs
  async getFinancialKPIs(dateRange: IDateRange): Promise<{
    totalRevenue: number; 
    totalRefunds: number; 
    totalDiscounts: number; 
    platformCommission: number;
    avgTicketPrice: number;
    totalConvenienceFees: number;
    totalTaxes: number;
  }> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange)
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: {
                  if: { $eq: ["$bookingStatus", "confirmed"] },
                  then: "$priceDetails.total",
                  else: 0
                }
              }
            },
            totalRefunds: {
              $sum: {
                $cond: {
                  if: { $eq: ["$paymentStatus", "refunded"] },
                  then: "$priceDetails.total",
                  else: 0
                }
              }
            },
            totalDiscounts: { $sum: "$priceDetails.discount" },
            totalConvenienceFees: { $sum: "$priceDetails.convenienceFee" },
            totalTaxes: { $sum: "$priceDetails.taxes" },
            confirmedBookings: {
              $sum: {
                $cond: {
                  if: { $eq: ["$bookingStatus", "confirmed"] },
                  then: 1,
                  else: 0
                }
              }
            }
          }
        },
        {
          $project: {
            totalRevenue: 1,
            totalRefunds: 1,
            totalDiscounts: 1,
            totalConvenienceFees: 1,
            totalTaxes: 1,
            platformCommission: { $multiply: ["$totalRevenue", 0.1] }, // Assuming 10% commission
            avgTicketPrice: {
              $cond: {
                if: { $gt: ["$confirmedBookings", 0] },
                then: { $divide: ["$totalRevenue", "$confirmedBookings"] },
                else: 0
              }
            }
          }
        }
      ]);

      return result[0] || {
        totalRevenue: 0,
        totalRefunds: 0,
        totalDiscounts: 0,
        platformCommission: 0,
        avgTicketPrice: 0,
        totalConvenienceFees: 0,
        totalTaxes: 0
      };
    } catch (error) {
      throw new Error(`Failed to get financial KPIs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Growth rates - simplified implementation
  async getGrowthRates(dateRange: IDateRange): Promise<{monthlyGrowthRate: number; quarterlyGrowthRate: number; yearlyGrowthRate: number}> {
    // This would require comparing current period with previous periods
    // Returning placeholder for now
    return {
      monthlyGrowthRate: 0,
      quarterlyGrowthRate: 0,
      yearlyGrowthRate: 0
    };
  }

  // Additional methods can be implemented following similar patterns...
  
  async getMoviePerformance(dateRange: IDateRange): Promise<Array<{movieId: Types.ObjectId; movieName: string; totalBookings: number; avgRating: number; format: string; language: string}>> {
    try {
      const result = await Booking.aggregate([
        {
          $match: {
            createdAt: this.buildDateMatch(dateRange),
            bookingStatus: "confirmed"
          }
        },
        {
          $lookup: {
            from: "movieshowtimes",
            localField: "showtimeId",
            foreignField: "_id",
            as: "showtime"
          }
        },
        { $unwind: "$showtime" },
        {
          $group: {
            _id: {
              movieId: "$movieId",
              format: "$showtime.format",
              language: "$showtime.language"
            },
            totalBookings: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "movies",
            localField: "_id.movieId",
            foreignField: "_id",
            as: "movie"
          }
        },
        { $unwind: "$movie" },
        {
          $lookup: {
            from: "reviews",
            localField: "_id.movieId",
            foreignField: "movieId",
            as: "reviews"
          }
        },
        {
          $project: {
            movieId: "$_id.movieId",
            movieName: "$movie.title",
            format: "$_id.format",
            language: "$_id.language",
            totalBookings: 1,
            avgRating: {
              $cond: {
                if: { $gt: [{ $size: "$reviews" }, 0] },
                then: { $avg: "$reviews.rating" },
                else: 0
              }
            }
          }
        },
        { $sort: { totalBookings: -1 } }
      ]);

      return result;
    } catch (error) {
      throw new Error(`Failed to get movie performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Placeholder implementations for remaining methods
  async getTopPerformingMovies(dateRange: IDateRange, limit: number): Promise<Array<{movieId: Types.ObjectId; movieName: string; revenue: number; bookings: number}>> {
    return this.getRevenuePerMovie(dateRange).then(movies => movies.slice(0, limit));
  }

  async getMovieFormatPerformance(dateRange: IDateRange): Promise<Array<{format: string; bookings: number; revenue: number}>> {
    // Implementation similar to other aggregations
    return [];
  }

  async getMovieLanguagePerformance(dateRange: IDateRange): Promise<Array<{language: string; bookings: number; revenue: number}>> {
    // Implementation similar to other aggregations
    return [];
  }

  async getShowtimePerformance(dateRange: IDateRange): Promise<Array<{showtimeId: Types.ObjectId; occupancy: number; revenue: number; showTime: string}>> {
    // Implementation
    return [];
  }

  async getTimeSlotPerformance(dateRange: IDateRange): Promise<Array<{timeSlot: string; bookings: number; avgOccupancy: number}>> {
    // Implementation
    return [];
  }

  async getWeekdayWeekendComparison(dateRange: IDateRange): Promise<{weekday: {bookings: number; revenue: number}; weekend: {bookings: number; revenue: number}}> {
    // Implementation
    return {
      weekday: { bookings: 0, revenue: 0 },
      weekend: { bookings: 0, revenue: 0 }
    };
  }

  async getSeasonalTrends(dateRange: IDateRange): Promise<Array<{period: string; bookings: number; revenue: number}>> {
    // Implementation
    return [];
  }

  async getCancellationRates(dateRange: IDateRange): Promise<{cancellationRate: number; refundAmount: number}> {
    // Implementation
    return { cancellationRate: 0, refundAmount: 0 };
  }

  async getPaymentAnalytics(dateRange: IDateRange): Promise<{successRate: number; failureRate: number; avgProcessingTime: number}> {
    // Implementation
    return { successRate: 0, failureRate: 0, avgProcessingTime: 0 };
  }
}
