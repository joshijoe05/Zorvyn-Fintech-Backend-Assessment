import { Request, Response, NextFunction } from 'express';
import { JWTUtil } from '../utils/jwt';
import { Errors } from '../utils/apiError';
import prisma from '../../config/db';

export const requireAuth = async (
  req:  Request,
  res:  Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = JWTUtil.extractBearerToken(req.headers.authorization);
    if (!token) throw Errors.unauthorized('No token provided');

    const payload = JWTUtil.verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true, email: true, name: true, role: true, status: true },
    });

    if (!user) throw Errors.unauthorized('User no longer exists');
    if (user.status === 'INACTIVE') throw Errors.forbidden('Your account has been deactivated');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};