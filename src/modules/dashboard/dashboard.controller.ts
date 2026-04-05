import { Request, Response, NextFunction } from 'express';
import { dashboardService } from './dashboard.service';
import { ApiResponse, sendResponse } from '../../common/utils/apiResponse';
import { Errors } from '../../common/utils/apiError';

function getFilterUserId(req: Request): string | undefined {
  const { userId } = req.query;
  if (!userId || typeof userId !== 'string') return undefined;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) throw Errors.badRequest('userId query param must be a valid UUID');

  return userId;
}

export const dashboardController = {

  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filterUserId = getFilterUserId(req);
      const summary = await dashboardService.getSummary(
        req.user!.role,
        req.user!.id,
        filterUserId,
      );
      sendResponse(res, new ApiResponse(200, summary, 'Summary retrieved successfully'));
    } catch (err) { next(err); }
  },

  async getCategoryTotals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filterUserId = getFilterUserId(req);
      const totals = await dashboardService.getCategoryTotals(
        req.user!.role,
        req.user!.id,
        filterUserId,
      );
      sendResponse(res, new ApiResponse(200, totals, 'Category totals retrieved successfully'));
    } catch (err) { next(err); }
  },

  async getMonthlyTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const months       = Math.min(Number(req.query.months) || 12, 12);
      const filterUserId = getFilterUserId(req);
      const trends = await dashboardService.getMonthlyTrends(
        req.user!.role,
        req.user!.id,
        months,
        filterUserId,
      );
      sendResponse(res, new ApiResponse(200, trends, 'Monthly trends retrieved successfully'));
    } catch (err) { next(err); }
  },

  async getWeeklyTrends(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const weeks        = Math.min(Number(req.query.weeks) || 12, 12);
      const filterUserId = getFilterUserId(req);
      const trends = await dashboardService.getWeeklyTrends(
        req.user!.role,
        req.user!.id,
        weeks,
        filterUserId,
      );
      sendResponse(res, new ApiResponse(200, trends, 'Weekly trends retrieved successfully'));
    } catch (err) { next(err); }
  },

};