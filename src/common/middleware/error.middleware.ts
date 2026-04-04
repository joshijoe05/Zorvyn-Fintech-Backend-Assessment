import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/apiError';
import { ApiResponse, sendResponse } from '../utils/apiResponse';
import logger from '../utils/logger';
import {env} from '../../config/env';

export const errorHandler = (
  err:   Error,
  req:   Request,
  res:   Response,
  _next: NextFunction,
): void => {
  logger.error(`${req.method} ${req.path} — ${err.message}`, {
    stack:  err.stack,
    body:   req.body,
    userId: req.user?.id,
  });

  if (err instanceof ApiError) {
    sendResponse(res, new ApiResponse(err.statusCode, null, err.message));
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 — unique constraint violation (e.g. duplicate email)
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
      sendResponse(
        res,
        new ApiResponse(409, null, `A record with this ${fields} already exists`),
      );
      return;
    }

    // P2025 — record not found (e.g. update/delete on non-existent row)
    if (err.code === 'P2025') {
      sendResponse(res, new ApiResponse(404, null, 'Record not found'));
      return;
    }

    // P2003 — foreign key constraint failed (referencing a non-existent row)
    if (err.code === 'P2003') {
      sendResponse(res, new ApiResponse(400, null, 'Related record does not exist'));
      return;
    }
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    sendResponse(res, new ApiResponse(503, null, 'Database connection error'));
    return;
  }

  const message = env.NODE_ENV === 'development'
    ? err.message
    : 'An unexpected error occurred. Please try again later.';

  sendResponse(res, new ApiResponse(500, null, message));
};

export const notFoundHandler = (req: Request, res: Response): void => {
  sendResponse(
    res,
    new ApiResponse(404, null, `Route ${req.method} ${req.path} not found`),
  );
};