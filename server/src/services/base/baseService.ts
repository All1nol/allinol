import mongoose, { Document, FilterQuery, Model, UpdateQuery, SortOrder } from 'mongoose';

/**
 * Base service providing common CRUD operations for MongoDB models
 */
export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Find all documents that match the filter query
   */
  async findAll(
    filter: FilterQuery<T> = {}, 
    page: number = 1, 
    limit: number = 10, 
    sort: { [key: string]: SortOrder } = { createdAt: -1 },
    populate?: string | string[]
  ): Promise<{ data: T[], total: number, page: number, totalPages: number }> {
    const skip = (page - 1) * limit;
    
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(field => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter)
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      total,
      page,
      totalPages
    };
  }

  /**
   * Find a document by its ID
   */
  async findById(id: string, populate?: string | string[]): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    let query = this.model.findById(id);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(field => {
          query = query.populate(field);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return await query.exec();
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    const newDocument = new this.model(data);
    return await newDocument.save();
  }

  /**
   * Update a document by its ID
   */
  async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    
    return await this.model.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
  }

  /**
   * Delete a document by its ID
   */
  async delete(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    
    const result = await this.model.deleteOne({ _id: id } as FilterQuery<T>);
    return result.deletedCount === 1;
  }
} 