import { Request, Response, NextFunction } from 'express';
import { categoriesService } from './categories.service';
import { ApiResponse, sendResponse } from '../../common/utils/apiResponse';
import { CreateCategoryInput, UpdateCategoryInput } from './categories.schema';

export const categoriesController = {

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoriesService.findAll();
      sendResponse(res, new ApiResponse(200, categories, 'Categories retrieved successfully'));
    } 
    catch (err) { 
        next(err); 
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.findById(req.params.id as string);
      sendResponse(res, new ApiResponse(200, category, 'Category retrieved successfully'));
    } 
    catch (err) { 
        next(err); 
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateCategoryInput = req.body;
      const category = await categoriesService.create(input, req.user!.id);
      sendResponse(res, new ApiResponse(201, category, 'Category created successfully'));
    } catch (err) { 
        next(err); 
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdateCategoryInput = req.body;
      const category = await categoriesService.update(req.params.id as string, input);
      sendResponse(res, new ApiResponse(200, category, 'Category updated successfully'));
    } catch (err) { 
        next(err); 
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoriesService.delete(req.params.id as string);
      sendResponse(res, new ApiResponse(200, null, 'Category deleted successfully'));
    } catch (err) { 
        next(err); 
    }
  },
};