import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse, sendResponse } from '../utils/apiResponse';

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = groupZodErrors(result.error);
      sendResponse(
        res,
        new ApiResponse(400, null, 'Validation failed', errors),
      );
      return;
    }

    req.body = result.data;
    next();
  };

function groupZodErrors(error: ZodError): Record<string, string[]> {
  return error.issues.reduce<Record<string, string[]>>((acc, issue) => {
    const field = issue.path.join('.') || 'root';
    if (!acc[field]) acc[field] = [];
    acc[field].push(issue.message);
    return acc;
  }, {});
}