import { Admin, IAdmin } from '../models/admin.model';
import { IAdminRepository } from '../interfaces/admin.interface';

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<IAdmin | null> {
    return Admin.findOne({ email }).exec();
  }
}
