import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';
import { Errors } from '../utils/apiError';

export const requireRole =
  (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(Errors.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(
        Errors.forbidden(
          `Access restricted. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`,
        ),
      );
    }

    next();
  };


// Admin only
export const adminOnly = requireRole(UserRole.ADMIN);

// Admin and Analyst
export const analystAndAbove = requireRole(UserRole.ADMIN, UserRole.ANALYST);

// All authenticated roles (Admin, Analyst, Viewer)
export const allRoles = requireRole(UserRole.ADMIN, UserRole.ANALYST, UserRole.VIEWER);