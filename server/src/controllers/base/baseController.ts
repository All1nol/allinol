import { Request, Response } from 'express';
import { BaseService } from '../../services/base/baseService';
import { Document } from 'mongoose';

/**
 * Base controller class providing common CRUD operations
 */
export abstract class BaseController<T extends Document> {
  protected service: BaseService<T>;
  
  constructor(service: BaseService<T>) {
    this.service = service;
  }
  
  /**
   * Get all records with pagination
   */
  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.service.findAll({}, page, limit);
      
      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Get a record by ID
   */
  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const item = await this.service.findById(id);
      
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: item });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Create a new record
   */
  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const item = await this.service.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Update a record
   */
  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const item = await this.service.update(id, req.body);
      
      if (!item) {
        res.status(404).json({ success: false, message: 'Item not found' });
        return;
      }
      
      res.status(200).json({ success: true, data: item });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(400).json({ success: false, message: errorMessage });
    }
  }
  
  /**
   * Delete a record
   */
  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id;
      const success = await this.service.delete(id);
      
      if (!success) {
        res.status(404).json({ success: false, message: 'Item not found or could not be deleted' });
        return;
      }
      
      res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json({ success: false, message: errorMessage });
    }
  }
} 