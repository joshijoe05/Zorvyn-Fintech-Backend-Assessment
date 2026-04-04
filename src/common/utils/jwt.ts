import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { UserRole, UserStatus } from '@prisma/client';

export interface JwtPayload {
    userId: string;
    role: string;
}

export interface AuthUser {
  id:     string;
  email:  string;
  name:   string;
  role:   UserRole;
  status: UserStatus;
}

export const JWTUtil = {
    generateAccessToken(payload: JwtPayload) : string {
        return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
            expiresIn: "15m"
        });
    },

    generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
            expiresIn: "7d"
        });
    },

    verifyAccessToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    },

    verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
    },

    extractBearerToken(authHeader: string | undefined): string | null {
        if (!authHeader?.startsWith('Bearer ')) return null;
        const token = authHeader.split(' ')[1];
        return token?.trim() || null;
    },
}
