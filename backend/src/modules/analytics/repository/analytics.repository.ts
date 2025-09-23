import mongoose, { ObjectId, PipelineStage, Types } from "mongoose";
import Booking from "../../bookings/models/bookings.model";
import MovieShowtime from "../../showtimes/models/showtimes.model";
import { Review } from "../../reviews/models/review.model";
import {
  IAnalyticsRepository,
  IRevenueData,
  ITheaterRevenueData,
  IScreenRevenueData,
  IMovieRevenueData,
  IOccupancyData,
  ITimeSlotData,
  IMoviePerformanceData,
  IFormatPerformanceData,
  ICustomerSatisfactionData,
  IRepeatCustomerData,
  IAdvanceBookingData,
  IPotentialRevenueData,
  IDynamicPricingData,
  IDiscountImpactData
} from "../interfaces/analytics.repository.interface";
import { IDateRange } from "../../adminAnalytics/dtos/dtos";
import { FilterQuery } from "mongoose";

export class AnalyticsRepository implements IAnalyticsRepository {

  async getOwnerTheaterIds(ownerId: string): Promise<Types.ObjectId[]> {
    try {
      const showtimes = await MovieShowtime.find({ ownerId }).distinct('theaterId');
      return showtimes;
    } catch (error) {
      throw new Error(`Failed to get owner theater IDs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMonthlyRevenueTrends(ownerId: string, months: number = 12): Promise<IRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const pipeline:PipelineStage[] = [
        {
          $match: {
            theaterId: { $in: theaterIds },
            paymentStatus: 'completed',
            bookingStatus: 'confirmed',
            bookedAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$bookedAt' },
              month: { $month: '$bookedAt' }
            },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get monthly revenue trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getWeeklyRevenue(ownerId: string, weeks: number = 12): Promise<IRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (weeks * 7));

      const pipeline:PipelineStage[] = [
        {
          $match: {
            theaterId: { $in: theaterIds },
            paymentStatus: 'completed',
            bookingStatus: 'confirmed',
            bookedAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$bookedAt' },
              week: { $week: '$bookedAt' }
            },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.week': 1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get weekly revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDailyRevenue(ownerId: string, days: number = 30): Promise<IRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const pipeline:PipelineStage[] = [
        {
          $match: {
            theaterId: { $in: theaterIds },
            paymentStatus: 'completed',
            bookingStatus: 'confirmed',
            bookedAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$bookedAt' },
              month: { $month: '$bookedAt' },
              day: { $dayOfMonth: '$bookedAt' }
            },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get daily revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTheaterWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<ITheaterRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[]  = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'theaters',
            localField: 'theaterId',
            foreignField: '_id',
            as: 'theater'
          }
        },
        {
          $group: {
            _id: '$theaterId',
            theaterId: { $first: '$theaterId' },
            theaterName: { $first: { $arrayElemAt: ['$theater.name', 0] } },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get theater-wise revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getScreenWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<IScreenRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'screens',
            localField: 'screenId',
            foreignField: '_id',
            as: 'screen'
          }
        },
        {
          $group: {
            _id: '$screenId',
            screenId: { $first: '$screenId' },
            theaterId: { $first: '$theaterId' },
            screenName: { $first: { $arrayElemAt: ['$screen.name', 0] } },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get screen-wise revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMovieWiseRevenue(ownerId: string, dateRange?: IDateRange): Promise<IMovieRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'movies',
            localField: 'movieId',
            foreignField: '_id',
            as: 'movie'
          }
        },
        {
          $group: {
            _id: '$movieId',
            movieId: { $first: '$movieId' },
            movieTitle: { $first: { $arrayElemAt: ['$movie.title', 0] } },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            totalTickets: { $sum: { $size: '$selectedSeats' } },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get movie-wise revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getOverallOccupancy(ownerId: string, dateRange: IDateRange): Promise<IOccupancyData> {
    try {
      const showtimes = await MovieShowtime.find({
        ownerId,
        showDate: { $gte: dateRange.start, $lte: dateRange.end }
      });

      const totalSeatsAvailable = showtimes.reduce((sum, showtime) => sum + showtime.totalSeats, 0);

      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const bookings = await Booking.find({
        theaterId: { $in: theaterIds },
        showDate: { $gte: dateRange.start, $lte: dateRange.end },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      });

      const totalSeatsBooked = bookings.reduce((sum, booking) => sum + booking.selectedSeats.length, 0);
      const occupancyPercentage = totalSeatsAvailable > 0 ? (totalSeatsBooked / totalSeatsAvailable) * 100 : 0;

      return {
        totalSeatsAvailable,
        totalSeatsBooked,
        occupancyPercentage
      };
    } catch (error) {
      throw new Error(`Failed to get overall occupancy: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAverageTicketPrice(ownerId: string, dateRange?: IDateRange): Promise<number> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            avgPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      return result[0]?.avgPrice || 0;
    } catch (error) {
      throw new Error(`Failed to get average ticket price: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRevenuePerScreen(ownerId: string, dateRange?: IDateRange): Promise<IScreenRevenueData[]> {
    try {
      return await this.getScreenWiseRevenue(ownerId, dateRange);
    } catch (error) {
      throw new Error(`Failed to get revenue per screen: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRevenuePerShow(ownerId: string, dateRange?: IDateRange): Promise<IRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: '$showtimeId',
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get revenue per show: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTimeSlotPerformance(ownerId: string, dateRange?: IDateRange): Promise<ITimeSlotData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: '$showTime',
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgOccupancy: { $avg: { $size: '$selectedSeats' } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get time slot performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getWeekdayWeekendComparison(ownerId: string, dateRange?: IDateRange): Promise<IRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.showDate = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $addFields: {
            dayOfWeek: { $dayOfWeek: '$showDate' },
            isWeekend: {
              $in: [{ $dayOfWeek: '$showDate' }, [1, 7]] 
            }
          }
        },
        {
          $group: {
            _id: '$isWeekend',
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get weekday weekend comparison: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTopPerformingMovies(ownerId: string, limit: number = 10, dateRange?: IDateRange): Promise<IMoviePerformanceData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'movies',
            localField: 'movieId',
            foreignField: '_id',
            as: 'movie'
          }
        },
        {
          $group: {
            _id: '$movieId',
            movieTitle: { $first: { $arrayElemAt: ['$movie.title', 0] } },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalTickets: { $sum: { $size: '$selectedSeats' } },
            totalShows: { $addToSet: '$showtimeId' },
            avgOccupancy: { $avg: { $size: '$selectedSeats' } }
          }
        },
        {
          $addFields: {
            totalShows: { $size: '$totalShows' }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: limit }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get top performing movies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getFormatPerformance(ownerId: string, dateRange?: IDateRange): Promise<IFormatPerformanceData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'movieshowtimes',
            localField: 'showtimeId',
            foreignField: '_id',
            as: 'showtime'
          }
        },
        {
          $group: {
            _id: { $arrayElemAt: ['$showtime.format', 0] },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get format performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLanguagePerformance(ownerId: string, dateRange?: IDateRange): Promise<IFormatPerformanceData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'movieshowtimes',
            localField: 'showtimeId',
            foreignField: '_id',
            as: 'showtime'
          }
        },
        {
          $group: {
            _id: { $arrayElemAt: ['$showtime.language', 0] },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { totalRevenue: -1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get language performance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getMovieLifecycleTrends(ownerId: string, movieId: string, dateRange?: IDateRange): Promise<IRevenueData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        movieId: new mongoose.Types.ObjectId(movieId),
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.showDate = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: {
              year: { $year: '$showDate' },
              month: { $month: '$showDate' },
              day: { $dayOfMonth: '$showDate' }
            },
            totalRevenue: { $sum: '$priceDetails.total' },
            totalBookings: { $sum: 1 },
            avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get movie lifecycle trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCustomerSatisfactionRatings(ownerId: string, dateRange?: IDateRange): Promise<ICustomerSatisfactionData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        reviewType: 'theater',
        status: 'active'
      };

      if (dateRange) {
        matchQuery.createdAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: '$theaterId',
            theaterId: { $first: '$theaterId' },
            avgRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratingDistribution: { $push: '$rating' }
          }
        },
        {
          $lookup: {
            from: 'theaters',
            localField: 'theaterId',
            foreignField: '_id',
            as: 'theater'
          }
        },
        {
          $addFields: {
            theaterName: { $arrayElemAt: ['$theater.name', 0] }
          }
        }
      ];

      const result = await Review.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get customer satisfaction ratings: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRepeatCustomerRate(ownerId: string, dateRange?: IDateRange): Promise<IRepeatCustomerData> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: '$userId',
            bookingCount: { $sum: 1 },
            totalSpent: { $sum: '$priceDetails.total' }
          }
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            repeatCustomers: { $sum: { $cond: [{ $gt: ['$bookingCount', 1] }, 1, 0] } },
            avgSpendPerCustomer: { $avg: '$totalSpent' }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      const data = result[0] || { totalCustomers: 0, repeatCustomers: 0, avgSpendPerCustomer: 0 };
      
      return {
        totalCustomers: data.totalCustomers,
        repeatCustomers: data.repeatCustomers,
        repeatRate: data.totalCustomers > 0 ? (data.repeatCustomers / data.totalCustomers) * 100 : 0,
        avgSpendPerCustomer: data.avgSpendPerCustomer
      };
    } catch (error) {
      throw new Error(`Failed to get repeat customer rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAdvanceBookingTrends(ownerId: string, dateRange?: IDateRange): Promise<IAdvanceBookingData[]> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $addFields: {
            daysInAdvance: {
              $floor: {
                $divide: [
                  { $subtract: ['$showDate', '$bookedAt'] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lte: ['$daysInAdvance', 0] }, then: 'Same Day' },
                  { case: { $lte: ['$daysInAdvance', 1] }, then: '1 Day' },
                  { case: { $lte: ['$daysInAdvance', 7] }, then: '1 Week' },
                  { case: { $lte: ['$daysInAdvance', 30] }, then: '1 Month' }
                ],
                default: 'More than 1 Month'
              }
            },
            count: { $sum: 1 },
            totalRevenue: { $sum: '$priceDetails.total' }
          }
        },
        {
          $group: {
            _id: null,
            data: { $push: { category: '$_id', count: '$count', totalRevenue: '$totalRevenue' } },
            totalCount: { $sum: '$count' }
          }
        },
        { $unwind: '$data' },
        {
          $project: {
            _id: '$data.category',
            count: '$data.count',
            totalRevenue: '$data.totalRevenue',
            percentage: { $multiply: [{ $divide: ['$data.count', '$totalCount'] }, 100] }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      return result;
    } catch (error) {
      throw new Error(`Failed to get advance booking trends: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAverageSpendPerCustomer(ownerId: string, dateRange?: IDateRange): Promise<number> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: '$userId',
            totalSpent: { $sum: '$priceDetails.total' }
          }
        },
        {
          $group: {
            _id: null,
            avgSpendPerCustomer: { $avg: '$totalSpent' }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      return result[0]?.avgSpendPerCustomer || 0;
    } catch (error) {
      throw new Error(`Failed to get average spend per customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCancellationRate(ownerId: string, dateRange?: IDateRange): Promise<number> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds }
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalBookings: { $sum: 1 },
            cancelledBookings: { $sum: { $cond: [{ $eq: ['$bookingStatus', 'cancelled'] }, 1, 0] } }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      const data = result[0] || { totalBookings: 0, cancelledBookings: 0 };
      return data.totalBookings > 0 ? (data.cancelledBookings / data.totalBookings) * 100 : 0;
    } catch (error) {
      throw new Error(`Failed to get cancellation rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPotentialVsActualRevenue(ownerId: string, dateRange: IDateRange): Promise<IPotentialRevenueData> {
    try {
      const showtimes = await MovieShowtime.find({
        ownerId,
        showDate: { $gte: dateRange.start, $lte: dateRange.end }
      });

      let potentialRevenue = 0;
      for (const show of showtimes) {
        for (const row of show.rowPricing) {
          potentialRevenue += row.totalSeats * row.showtimePrice;
        }
      }

      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const actualRevenueResult = await Booking.aggregate([
        {
          $match: {
            theaterId: { $in: theaterIds },
            showDate: { $gte: dateRange.start, $lte: dateRange.end },
            paymentStatus: 'completed',
            bookingStatus: 'confirmed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$priceDetails.total' }
          }
        }
      ]);

      const actualRevenue = actualRevenueResult[0]?.total || 0;
      const realizationPercentage = potentialRevenue > 0 ? (actualRevenue / potentialRevenue) * 100 : 0;

      return {
        potentialRevenue,
        actualRevenue,
        realizationPercentage
      };
    } catch (error) {
      throw new Error(`Failed to get potential vs actual revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDynamicPricingImpact(ownerId: string, dateRange?: IDateRange): Promise<IDynamicPricingData> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $lookup: {
            from: 'movieshowtimes',
            localField: 'showtimeId',
            foreignField: '_id',
            as: 'showtime'
          }
        },
        { $unwind: '$seatPricing' },
        { $unwind: '$showtime.rowPricing' },
        {
          $match: {
            $expr: { $eq: ['$seatPricing.rowLabel', '$showtime.rowPricing.rowLabel'] }
          }
        },
        {
          $group: {
            _id: null,
            avgBasePrice: { $avg: '$showtime.rowPricing.basePrice' },
            avgShowtimePrice: { $avg: '$showtime.rowPricing.showtimePrice' },
            avgFinalPrice: { $avg: '$seatPricing.finalPrice' }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      const data = result[0] || { avgBasePrice: 0, avgShowtimePrice: 0, avgFinalPrice: 0 };
      
      return {
        avgBasePrice: data.avgBasePrice,
        avgShowtimePrice: data.avgShowtimePrice,
        avgFinalPrice: data.avgFinalPrice,
        pricingImpact: ((data.avgShowtimePrice - data.avgBasePrice) / data.avgBasePrice) * 100 || 0
      };
    } catch (error) {
      throw new Error(`Failed to get dynamic pricing impact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getDiscountImpact(ownerId: string, dateRange?: IDateRange): Promise<IDiscountImpactData> {
    try {
      const theaterIds = await this.getOwnerTheaterIds(ownerId);
      const matchQuery: FilterQuery = {
        theaterId: { $in: theaterIds },
        paymentStatus: 'completed',
        bookingStatus: 'confirmed'
      };

      if (dateRange) {
        matchQuery.bookedAt = { $gte: dateRange.start, $lte: dateRange.end };
      }

      const pipeline:PipelineStage[] = [
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            totalSubtotal: { $sum: '$priceDetails.subtotal' },
            totalDiscount: { $sum: '$priceDetails.discount' },
            totalFinal: { $sum: '$priceDetails.total' },
            bookingsWithDiscount: { $sum: { $cond: [{ $gt: ['$priceDetails.discount', 0] }, 1, 0] } },
            totalBookings: { $sum: 1 }
          }
        }
      ];

      const result = await Booking.aggregate(pipeline);
      const data = result[0] || {
        totalSubtotal: 0,
        totalDiscount: 0,
        totalFinal: 0,
        bookingsWithDiscount: 0,
        totalBookings: 0
      };

      return {
        totalSubtotal: data.totalSubtotal,
        totalDiscount: data.totalDiscount,
        totalFinal: data.totalFinal,
        discountPercentage: data.totalSubtotal > 0 ? (data.totalDiscount / data.totalSubtotal) * 100 : 0,
        bookingsWithDiscount: data.bookingsWithDiscount,
        totalBookings: data.totalBookings
      };
    } catch (error) {
      throw new Error(`Failed to get discount impact: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getPeakHourRevenue(ownerId: string, dateRange?: IDateRange): Promise<ITimeSlotData[]> {
    try {
      return await this.getTimeSlotPerformance(ownerId, dateRange);
    } catch (error) {
      throw new Error(`Failed to get peak hour revenue: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getSeasonalRevenuePatterns(ownerId: string, months: number = 12): Promise<IRevenueData[]> {
    try {
      return await this.getMonthlyRevenueTrends(ownerId, months);
    } catch (error) {
      throw new Error(`Failed to get seasonal revenue patterns: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

 
  async getShowUtilizationRate(ownerId: string, dateRange?: IDateRange): Promise<IRevenueData[]> {
    try {
      return await this.getRevenuePerShow(ownerId, dateRange);
    } catch (error) {
      throw new Error(`Failed to get show utilization rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getLowPerformingTimeSlots(ownerId: string, threshold: number = 50, dateRange?: IDateRange): Promise<ITimeSlotData[]> {
    try {
      const allTimeSlots = await this.getTimeSlotPerformance(ownerId, dateRange);
      
      return allTimeSlots.filter(slot => slot.avgOccupancy < threshold);
    } catch (error) {
      throw new Error(`Failed to get low performing time slots: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getTheaterEfficiencyScore(ownerId: string, dateRange?: IDateRange): Promise<ITheaterRevenueData[]> {
    try {
      return await this.getTheaterWiseRevenue(ownerId, dateRange);
    } catch (error) {
      throw new Error(`Failed to get theater efficiency score: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getRevenueGrowthRate(ownerId: string, period: 'monthly' | 'quarterly'): Promise<IRevenueData[]> {
    try {
      if (period === 'monthly') {
        return await this.getMonthlyRevenueTrends(ownerId, 12);
      } else {
        const theaterIds = await this.getOwnerTheaterIds(ownerId);
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 12);

        const pipeline:PipelineStage[] = [
          {
            $match: {
              theaterId: { $in: theaterIds },
              paymentStatus: 'completed',
              bookingStatus: 'confirmed',
              bookedAt: { $gte: startDate }
            }
          },
          {
            $group: {
              _id: {
                year: { $year: '$bookedAt' },
                quarter: { $ceil: { $divide: [{ $month: '$bookedAt' }, 3] } }
              },
              totalRevenue: { $sum: '$priceDetails.total' },
              totalBookings: { $sum: 1 },
              avgTicketPrice: { $avg: { $divide: ['$priceDetails.subtotal', { $size: '$selectedSeats' }] } }
            }
          },
          { $sort: { '_id.year': 1, '_id.quarter': 1 } }
        ];

        const result = await Booking.aggregate(pipeline);
        return result;
      }
    } catch (error) {
      throw new Error(`Failed to get revenue growth rate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
