import { Types } from "mongoose";
import { IScreen } from "../interfaces/screens.model.interface";
import { IScreenRepository } from "../interfaces/screens.repository.interface";
import { 
  CreateScreenDto,
  UpdateScreenDto,
  ScreenFilterDto,
  AdvancedScreenFilterDto,
  PaginatedScreenResultDto,
  ScreenStatisticsDto
} from "../dtos/dtos";
import { Screen } from "../models/screens.model";

export class ScreenRepository implements IScreenRepository {
  
  async createScreen(screenData: CreateScreenDto): Promise<IScreen> {
    try {
      const screen = new Screen(screenData);
      const savedScreen = await screen.save();
      if (!savedScreen) {
        throw new Error('Failed to save screen to database');
      }
      return savedScreen;
    } catch (error) {
      throw new Error(`Failed to create screen: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getScreenById(screenId: string): Promise<IScreen | null> {
    try {
      if (!this._isValidObjectId(screenId)) {
        throw new Error('Invalid screen ID format');
      }
      
      return await Screen.findById(screenId).populate("theaterId", "name city state");
    } catch (error) {
      throw new Error(`Failed to get screen by ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getScreensByTheaterId(theaterId: string): Promise<IScreen[]> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }
      
      return await Screen.find({ theaterId: new Types.ObjectId(theaterId) })
        .populate("theaterId", "name city state");
    } catch (error) {
      throw new Error(`Failed to get screens by theater ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAllScreensPaginated(
    page: number,
    limit: number,
    filters?: ScreenFilterDto
  ): Promise<PaginatedScreenResultDto> {
    try {
      const query = this._buildScreenQuery(filters);
      const skipCount = (page - 1) * limit;
      const sortOptions = this._buildSortOptions(filters);

      const [screens, totalRecords] = await Promise.all([
        Screen.find(query)
          .sort(sortOptions)
          .skip(skipCount)
          .limit(limit)
          .populate("theaterId", "name city state"),
        Screen.countDocuments(query)
      ]);

      return {
        screens,
        total: totalRecords,
        currentPage: page,
        totalPages: Math.ceil(totalRecords / limit),
        pageSize: limit,
      };
    } catch (error) {
      throw new Error(`Failed to get paginated screens: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getScreenByIdWithTheaterDetails(screenId: string): Promise<IScreen | null> {
    try {
      if (!this._isValidObjectId(screenId)) {
        throw new Error('Invalid screen ID format');
      }
      
      return await Screen.findById(screenId).populate("theaterId", "name isActive");
    } catch (error) {
      throw new Error(`Failed to get screen with theater details: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getScreensByTheaterIdWithAdvancedFilters(
    theaterId: string,
    filters: AdvancedScreenFilterDto
  ): Promise<ScreenStatisticsDto> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }

      const theaterObjId = new Types.ObjectId(theaterId);
      const query = this._buildAdvancedQuery(theaterObjId, filters);
      
      const skipCount = (filters.page - 1) * filters.limit;
      const sortOptions = this._buildAdvancedSortOptions(filters);

      const [screens, totalFiltered, statistics] = await Promise.all([
        Screen.find(query)
          .sort(sortOptions)
          .skip(skipCount)
          .limit(filters.limit)
          .populate("theaterId", "name city state"),
        Screen.countDocuments(query),
        this._getScreenStatistics(theaterObjId)
      ]);

      return {
        screens,
        totalFiltered,
        totalAll: statistics.totalAll,
        activeAll: statistics.activeAll,
        inactiveAll: statistics.inactiveAll
      };
    } catch (error) {
      throw new Error(`Failed to get screens with advanced filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getScreenByTheaterIdAndName(theaterId: string, name: string): Promise<IScreen | null> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }
      
      return await Screen.findOne({
        theaterId: new Types.ObjectId(theaterId),
        name: new RegExp(`^${name.trim()}$`, "i"),
      }).populate("theaterId", "name city state");
    } catch (error) {
      throw new Error(`Failed to get screen by theater ID and name: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getActiveScreensByTheaterId(theaterId: string): Promise<IScreen[]> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }
      
      return await Screen.find({
        theaterId: new Types.ObjectId(theaterId),
        isActive: true,
      }).populate("theaterId", "name city state");
    } catch (error) {
      throw new Error(`Failed to get active screens by theater ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateScreen(screenId: string, updateData: UpdateScreenDto): Promise<IScreen> {
    try {
      if (!this._isValidObjectId(screenId)) {
        throw new Error('Invalid screen ID format');
      }
      
      const processedUpdateData = this._processUpdateData(updateData);

      const updatedScreen = await Screen.findByIdAndUpdate(
        screenId,
        { $set: processedUpdateData },
        { new: true, runValidators: true }
      ).populate("theaterId", "name city state");

      if (!updatedScreen) {
        throw new Error('Screen not found');
      }

      return updatedScreen;
    } catch (error) {
      throw new Error(`Failed to update screen: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async toggleScreenStatus(screenId: string): Promise<IScreen> {
    try {
      if (!this._isValidObjectId(screenId)) {
        throw new Error('Invalid screen ID format');
      }
      
      const screen = await Screen.findById(screenId);
      if (!screen) {
        throw new Error('Screen not found');
      }
      
      screen.isActive = !screen.isActive;
      return await screen.save();
    } catch (error) {
      throw new Error(`Failed to toggle screen status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteScreen(screenId: string): Promise<IScreen> {
    try {
      if (!this._isValidObjectId(screenId)) {
        throw new Error('Invalid screen ID format');
      }
      
      const deletedScreen = await Screen.findByIdAndDelete(screenId);
      if (!deletedScreen) {
        throw new Error('Screen not found');
      }

      return deletedScreen;
    } catch (error) {
      throw new Error(`Failed to delete screen: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteScreensByTheaterId(theaterId: string): Promise<number> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }
      
      const result = await Screen.deleteMany({ 
        theaterId: new Types.ObjectId(theaterId) 
      });

      return result.deletedCount || 0;
    } catch (error) {
      throw new Error(`Failed to delete screens by theater ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async checkScreenExistsByNameAndTheater(
    name: string,
    theaterId: string,
    excludedId?: string
  ): Promise<boolean> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }
      
      const query: any = {
        name: new RegExp(`^${name.trim()}$`, "i"),
        theaterId: new Types.ObjectId(theaterId),
      };
      
      if (excludedId && this._isValidObjectId(excludedId)) {
        query._id = { $ne: new Types.ObjectId(excludedId) };
      }
      
      const existingScreen = await Screen.findOne(query);
      return !!existingScreen;
    } catch (error) {
      throw new Error(`Failed to check screen existence: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async countScreensByTheaterId(theaterId: string): Promise<number> {
    try {
      if (!this._isValidObjectId(theaterId)) {
        throw new Error('Invalid theater ID format');
      }
      
      return await Screen.countDocuments({ 
        theaterId: new Types.ObjectId(theaterId) 
      });
    } catch (error) {
      throw new Error(`Failed to count screens by theater ID: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private _isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  private _buildScreenQuery(filters?: ScreenFilterDto): any {
    const query: any = {};
    
    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.screenType) {
      query.screenType = {
        $exists: true,
        $regex: new RegExp(filters.screenType, "i"),
      };
    }

    if (filters?.theaterId && this._isValidObjectId(filters.theaterId)) {
      query.theaterId = new Types.ObjectId(filters.theaterId);
    }

    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        {
          screenType: {
            $exists: true,
            $regex: new RegExp(filters.search, "i"),
          },
        },
      ];
    }

    return query;
  }

  private _buildAdvancedQuery(theaterObjId: Types.ObjectId, filters?: AdvancedScreenFilterDto): any {
    const query: any = { theaterId: theaterObjId };

    if (filters?.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters?.screenType) {
      query.screenType = {
        $exists: true,
        $regex: new RegExp(filters.screenType, "i"),
      };
    }

    if (filters?.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        {
          screenType: {
            $exists: true,
            $regex: new RegExp(filters.search, "i"),
          },
        },
      ];
    }

    return query;
  }

  private _buildSortOptions(filters?: ScreenFilterDto): any {
    if (filters?.sortBy && filters?.sortOrder) {
      return { [filters.sortBy]: filters.sortOrder === "asc" ? 1 : -1 };
    }
    return { createdAt: -1 };
  }

  private _buildAdvancedSortOptions(filters?: AdvancedScreenFilterDto): any {
    const sortField = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder === "desc" ? -1 : 1;
    return { [sortField]: sortOrder };
  }

  private _processUpdateData(updateData: UpdateScreenDto): any {
    const processedData = { ...updateData };
    
    if (processedData.theaterId && typeof processedData.theaterId === "string") {
      if (this._isValidObjectId(processedData.theaterId)) {
        processedData.theaterId = new Types.ObjectId(processedData.theaterId) as any;
      }
    }

    return processedData;
  }

  private async _getScreenStatistics(theaterObjId: Types.ObjectId): Promise<{
    totalAll: number;
    activeAll: number;
    inactiveAll: number;
  }> {
    try {
      const [totalAll, activeAll, inactiveAll] = await Promise.all([
        Screen.countDocuments({ theaterId: theaterObjId }),
        Screen.countDocuments({ theaterId: theaterObjId, isActive: true }),
        Screen.countDocuments({ theaterId: theaterObjId, isActive: false }),
      ]);

      return { totalAll, activeAll, inactiveAll };
    } catch (error) {
      throw new Error(`Failed to get screen statistics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
