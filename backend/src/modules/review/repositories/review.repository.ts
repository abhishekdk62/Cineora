import { IReview, IReviewLike } from "../interfaces/review.model.interface";
import { Review, ReviewLike } from "../models/review.model";
import { IReviewRepository } from "../interfaces/review.repository.interface";

export class ReviewRepository implements IReviewRepository {
  async create(reviewData: Partial<IReview>): Promise<IReview | null> {
    const review = new Review(reviewData);
    return review.save();
  }
  
  async findById(id: string): Promise<IReview | null> {
    return Review.findById(id)
      .populate("userId", "firstName lastName avatar")
      .populate("movieId", "title poster")
      .populate("theaterId", "name location");
  }
  
  async findByReviewId(reviewId: string): Promise<IReview | null> {
    return Review.findOne({ reviewId })
      .populate("userId", "firstName lastName avatar")
      .populate("movieId", "title poster")
      .populate("theaterId", "name location");
  }
  
  async findByMovieId(
    movieId: string,
    page: number = 1,
    limit: number = 10,
    status: string = "approved"
  ): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ movieId, status })
      .populate("userId", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Review.countDocuments({ movieId, status });
    
    const ratingStats = await Review.aggregate([
      { $match: { movieId: movieId, status: status } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    const ratingDistribution = await Review.aggregate([
      { $match: { movieId: movieId, status: status } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const distribution: { [key: number]: number } = {};
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });
    
    return {
      reviews,
      total,
      averageRating: ratingStats[0]?.averageRating || 0,
      ratingDistribution: distribution,
    };
  }
  
  async findByTheaterId(
    theaterId: string,
    page: number = 1,
    limit: number = 10,
    status: string = "approved"
  ): Promise<{
    reviews: IReview[];
    total: number;
    averageRating: number;
    ratingDistribution: { [key: number]: number };
  }> {
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ theaterId, status })
      .populate("userId", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Review.countDocuments({ theaterId, status });
    
    const ratingStats = await Review.aggregate([
      { $match: { theaterId: theaterId, status: status } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);
    
    const ratingDistribution = await Review.aggregate([
      { $match: { theaterId: theaterId, status: status } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const distribution: { [key: number]: number } = {};
    ratingDistribution.forEach(item => {
      distribution[item._id] = item.count;
    });
    
    return {
      reviews,
      total,
      averageRating: ratingStats[0]?.averageRating || 0,
      ratingDistribution: distribution,
    };
  }
  
  async findByUserId(userId: string): Promise<IReview[]> {
    return Review.find({ userId })
      .populate("movieId", "title poster")
      .populate("theaterId", "name location")
      .sort({ createdAt: -1 });
  }
  
  async updateById(
    id: string,
    updateData: Partial<IReview>
  ): Promise<IReview | null> {
    return Review.findByIdAndUpdate(id, updateData, { new: true });
  }
  
  async moderateReview(
    reviewId: string,
    status: string,
    moderatorId: string,
    rejectionReason?: string
  ): Promise<IReview | null> {
    const updateData: any = {
      status,
      moderatedBy: moderatorId,
      moderatedAt: new Date(),
    };
    
    if (rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }
    
    return Review.findOneAndUpdate({ reviewId }, updateData, { new: true });
  }
  
  async deleteById(id: string): Promise<boolean> {
    const result = await Review.findByIdAndDelete(id);
    return !!result;
  }
  
  async addLike(
    userId: string,
    reviewId: string,
    type: "like" | "dislike" | "helpful"
  ): Promise<boolean> {
    try {
      await ReviewLike.findOneAndDelete({ userId, reviewId });
      
      await ReviewLike.create({ userId, reviewId, type });
      
      await this.updateLikeCounts(reviewId);
      
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async removeLike(userId: string, reviewId: string): Promise<boolean> {
    try {
      await ReviewLike.findOneAndDelete({ userId, reviewId });
      await this.updateLikeCounts(reviewId);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  async updateLikeCounts(reviewId: string): Promise<IReview | null> {
    const likeCounts = await ReviewLike.aggregate([
      { $match: { reviewId: reviewId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const counts = {
      likesCount: 0,
      dislikesCount: 0,
      helpfulCount: 0,
    };
    
    likeCounts.forEach(item => {
      if (item._id === "like") counts.likesCount = item.count;
      if (item._id === "dislike") counts.dislikesCount = item.count;
      if (item._id === "helpful") counts.helpfulCount = item.count;
    });
    
    return Review.findOneAndUpdate({ reviewId }, counts, { new: true });
  }
  
  async findPendingReviews(page: number = 1, limit: number = 10): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ status: "pending" })
      .populate("userId", "firstName lastName email")
      .populate("movieId", "title")
      .populate("theaterId", "name")
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Review.countDocuments({ status: "pending" });
    
    return { reviews, total };
  }
  
  async findReviewsByStatus(
    status: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: IReview[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    
    const reviews = await Review.find({ status })
      .populate("userId", "firstName lastName")
      .populate("movieId", "title")
      .populate("theaterId", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Review.countDocuments({ status });
    
    return { reviews, total };
  }
  
  async getReviewStats(): Promise<{
    totalReviews: number;
    pendingReviews: number;
    approvedReviews: number;
    rejectedReviews: number;
  }> {
    const stats = await Review.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    const result = {
      totalReviews: 0,
      pendingReviews: 0,
      approvedReviews: 0,
      rejectedReviews: 0,
    };
    
    stats.forEach(stat => {
      result.totalReviews += stat.count;
      if (stat._id === "pending") result.pendingReviews = stat.count;
      if (stat._id === "approved") result.approvedReviews = stat.count;
      if (stat._id === "rejected") result.rejectedReviews = stat.count;
    });
    
    return result;
  }
}
