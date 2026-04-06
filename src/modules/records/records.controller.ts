import { Request, Response, NextFunction } from 'express';
import { recordsService } from './records.service';
import { ApiResponse, sendResponse } from '../../common/utils/apiResponse';
import { CreateRecordInput, UpdateRecordInput, RecordsQuery } from './records.schema';

const isAdmin = (req: Request) => req.user!.role === 'ADMIN';

export const recordsController = {

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query  = req.validatedQuery as unknown as RecordsQuery;
      const result = await recordsService.findAll(query, req.user!.id, isAdmin(req));

      sendResponse(res, new ApiResponse(200, result, 'Records retrieved successfully'));
    } catch (err) { 
        next(err); 
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await recordsService.findById(req.params.id as string, req.user!.id, isAdmin(req));
      sendResponse(res, new ApiResponse(200, record, 'Record retrieved successfully'));
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: CreateRecordInput = req.body;
      const record = await recordsService.create(input, req.user!.id);

      await recordsService.logAudit('CREATE', record.id, req.user!.id, undefined, record);

      sendResponse(res, new ApiResponse(201, record, 'Record created successfully'));
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input: UpdateRecordInput = req.body;

      const existing = await recordsService.findById(req.params.id as string, req.user!.id, isAdmin(req));
      const updated = await recordsService.update(req.params.id as string, input, req.user!.id, isAdmin(req));

      await recordsService.logAudit('UPDATE', updated.id, req.user!.id, existing, updated);

      sendResponse(res, new ApiResponse(200, updated, 'Record updated successfully'));
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const existing = await recordsService.findById(req.params.id as string, req.user!.id, isAdmin(req));
      await recordsService.delete(req.params.id as string, req.user!.id, isAdmin(req));

      await recordsService.logAudit('DELETE', req.params.id as string, req.user!.id, existing, undefined);
      sendResponse(res, new ApiResponse(200, null, 'Record deleted successfully'));
    } catch (err) { next(err); }
  },
};