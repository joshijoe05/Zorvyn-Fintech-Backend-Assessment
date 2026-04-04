import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { UserRole, UserStatus } from '@prisma/client';
import { Errors } from "./apiError";

interface GenerateAccessTokenInput {
  id:    string;
  email: string;
  role:  UserRole;
}

export interface AccessTokenPayload {
  sub:   string;
  email: string;
  role:  UserRole;
  type:  'access';
}

export interface RefreshTokenPayload {
  sub:  string;
  type: 'refresh';
}

export const JWTUtil = {
    generateAccessToken(user: GenerateAccessTokenInput) : string {
        const payload: AccessTokenPayload = {
            sub:   user.id,
            email: user.email,
            role:  user.role,
            type:  'access',
        };
        return jwt.sign(payload, env.JWT_ACCESS_SECRET as jwt.Secret, {
            expiresIn: env.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
        });
    },

    generateRefreshToken(userId: string): string {
        const payload: RefreshTokenPayload = {
            sub:  userId,
            type: 'refresh',
        };
        return jwt.sign(payload, env.JWT_REFRESH_SECRET as jwt.Secret, {
            expiresIn: env.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
        });
    },

    verifyAccessToken(token: string): AccessTokenPayload {
        try {
            const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
        
            if (payload.type !== 'access') throw Errors.tokenInvalid();
        
            return payload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) throw Errors.tokenExpired();
            if (err instanceof jwt.JsonWebTokenError)  throw Errors.tokenInvalid();
            throw err;
        }
    },

    verifyRefreshToken(token: string): RefreshTokenPayload {
        try {
            const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
        
            if (payload.type !== 'refresh') throw Errors.tokenInvalid();
        
            return payload;
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) throw Errors.tokenExpired();
            if (err instanceof jwt.JsonWebTokenError)  throw Errors.tokenInvalid();
            throw err;
        }
    },

    extractBearerToken(authHeader: string | undefined): string | null {
        if (!authHeader?.startsWith('Bearer ')) return null;
        const token = authHeader.split(' ')[1];
        return token?.trim() || null;
    },

    generateTokenPair(user: GenerateAccessTokenInput): {
        accessToken:  string;
        refreshToken: string;
    } {
        return {
            accessToken:  JWTUtil.generateAccessToken(user),
            refreshToken: JWTUtil.generateRefreshToken(user.id),
        };
    },
}
