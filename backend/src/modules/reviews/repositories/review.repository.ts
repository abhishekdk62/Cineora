import { Types } from "mongoose";
import { IReview, ReviewData } from "../interfaces/review.model.interface";
import { IReviewRepository } from "../interfaces/review.repository.interface";
import { Review } from "../models/review.model";

export class ReviewRepository implements IReviewRepository {
  async addReview(reviewData: ReviewData): Promise<IReview> {
    const review = new Review({
      userId: new Types.ObjectId(reviewData.userId),
      movieId: reviewData.movieId ? new Types.ObjectId(reviewData.movieId) : undefined,
      theaterId: reviewData.theaterId ? new Types.ObjectId(reviewData.theaterId) : undefined,
      bookingId: reviewData.bookingId ? new Types.ObjectId(reviewData.bookingId) : undefined,
      rating: reviewData.rating,
      reviewText: reviewData.reviewText,
      reviewType: reviewData.reviewType,
      isVerifiedBooking: !!reviewData.bookingId,
    });
    return review.save();
  }

  async updateReview(reviewId: string, reviewData: Partial<ReviewData>): Promise<IReview | null> {
    return Review.findByIdAndUpdate(
      reviewId,
      { 
        ...reviewData,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();
  }

  async deleteReview(reviewId: string, userId: string): Promise<boolean> {
    const result = await Review.deleteOne({
      _id: new Types.ObjectId(reviewId),
      userId: new Types.ObjectId(userId),
    });
    return result.deletedCount > 0;
  }

  async getReviewById(reviewId: string): Promise<IReview | null> {
    return Review.findById(reviewId)
      .populate('userId', 'name')
      .populate('movieId', 'title poster')
      .populate('theaterId', 'name')
      .exec();
  }

  async getMovieReviews(movieId: string, page: number = 1, limit: number = 10): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [reviews, total, ratingStats] = await Promise.all([
      Review.find({ 
        movieId: new Types.ObjectId(movieId),
        status: 'active',
        reviewType:'movie',
      })
        .populate('userId','profilePicture email username')

        .sort({ isVerifiedBooking: -1, helpfulCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Review.countDocuments({ 
        movieId: new Types.ObjectId(movieId),
        status: 'active'
      }),
      Review.aggregate([
        { $match: { movieId: new Types.ObjectId(movieId), status: 'active' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ])
    ]);

    return {
      reviews,
      total,
      averageRating: ratingStats[0]?.averageRating || 0
    };
  }
async getBulkMovieRatings(movieIds: string[]): Promise<Array<{ 
  _id: string; 
  averageRating: number; 
  totalReviews: number; 
}>> {
  if (!movieIds || movieIds.length === 0) return [];

  return await Review.aggregate([
    { 
      $match: { 
        movieId: { $in: movieIds.map(id => new Types.ObjectId(id)) }, 
        reviewType: 'movie',
        status: 'active' 
      } 
    },
    {
      $group: {
        _id: '$movieId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
}

async getBulkTheaterRatings(theaterIds: string[]): Promise<Array<{ 
  _id: string; 
  averageRating: number; 
  totalReviews: number; 
}>> {
  if (!theaterIds || theaterIds.length === 0) return [];

  return await Review.aggregate([
    { 
      $match: { 
        theaterId: { $in: theaterIds.map(id => new Types.ObjectId(id)) }, 
        reviewType: 'theater',
        status: 'active' 
      } 
    },
    {
      $group: {
        _id: '$theaterId',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
}

  async getTheaterReviews(theaterId: string, page: number = 1, limit: number = 10): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
    
  }> {
    const skip = (page - 1) * limit;
    
    const [reviews, total, ratingStats] = await Promise.all([
      Review.find({ 
        theaterId: new Types.ObjectId(theaterId),
        status: 'active',
        reviewType:'theater'
      })
        .populate('userId', 'name')
        .sort({ isVerifiedBooking: -1, helpfulCount: -1, createdAt: -1 })
        .populate('userId','email username profilePicture')

        .skip(skip)
        .limit(limit)
        .exec(),
      Review.countDocuments({ 
        theaterId: new Types.ObjectId(theaterId),
        status: 'active'
      }),
      Review.aggregate([
        { $match: { theaterId: new Types.ObjectId(theaterId), status: 'active' } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ])
    ]);

    return {
      reviews,
      total,
      averageRating: ratingStats[0]?.averageRating || 0
    };
  }

  async getUserReviews(userId: string, page: number = 1, limit: number = 10): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      Review.find({ userId: new Types.ObjectId(userId) })
        .populate('movieId', 'title poster')
        .populate('userId','email username profilePicture')
        .populate('theaterId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Review.countDocuments({ userId: new Types.ObjectId(userId) })
    ]);

    return { reviews, total };
  }

  async hasUserReviewed(userId: string, movieId?: string, theaterId?: string,reviewType?:string): Promise<boolean> {
    const query: any = { userId: new Types.ObjectId(userId),reviewType };
    if (movieId) query.movieId = new Types.ObjectId(movieId);
    if (theaterId) query.theaterId = new Types.ObjectId(theaterId);
    const review = await Review.findOne(query).exec();
    return !!review;
  }
  async getMovieRatingStats(movieId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const stats = await Review.aggregate([
      { $match: {reviewType:'movie', movieId: new Types.ObjectId(movieId), status: 'active' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: { $push: '$rating' }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratings.forEach((rating: number) => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution
    };
  }

  async getTheaterRatingStats(theaterId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const stats = await Review.aggregate([
      { $match: {reviewType:'theater', theaterId: new Types.ObjectId(theaterId), status: 'active' } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratings: { $push: '$rating' }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const ratingDistribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratings.forEach((rating: number) => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution
    };
  }

  async markHelpful(reviewId: string): Promise<boolean> {
    const result = await Review.updateOne(
      { _id: new Types.ObjectId(reviewId) },
      { $inc: { helpfulCount: 1 } }
    );
    return result.modifiedCount > 0;
  }

  async reportReview(reviewId: string): Promise<boolean> {
    const result = await Review.updateOne(
      { _id: new Types.ObjectId(reviewId) },
      { 
        $inc: { reportCount: 1 },
        $set: { status: 'reported' }
      }
    );
    return result.modifiedCount > 0;
  }

  async getReportedReviews(page: number = 1, limit: number = 20): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      Review.find({ status: 'reported' })
        .populate('userId', 'name')
        .populate('movieId', 'title')
        .populate('theaterId', 'name')
        .sort({ reportCount: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      Review.countDocuments({ status: 'reported' })
    ]);

    return { reviews, total };
  }

  async updateReviewStatus(reviewId: string, status: 'active' | 'hidden' | 'reported'): Promise<boolean> {
    const result = await Review.updateOne(
      { _id: new Types.ObjectId(reviewId) },
      { status }
    );
    return result.modifiedCount > 0;
  }
}
