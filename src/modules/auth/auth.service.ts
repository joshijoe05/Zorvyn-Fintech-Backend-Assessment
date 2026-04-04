import { AuditAction, RefreshToken, User } from "@prisma/client";
import prisma from "../../config/db";
import { PasswordUtil } from "../../common/utils/password.util";
import { RegisterInput } from "./auth.schema";
import { JWTUtil } from "../../common/utils/jwt";
import { env } from "../../config/env";
import { Request } from "express";
import { Errors } from "../../common/utils/apiError";
import { AuthTokenResponse, SafeUser } from "./auth.types";

export const authService = {

    async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: {email,deletedAt: null},
        });
    },

    async findUserById(id: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: { id, deletedAt: null },
        });
    },


    async emailAlreadyExists(email: string): Promise<boolean> {
        const user = await prisma.user.findFirst({
            where:  { email, deletedAt: null },
            select: { id: true },
        });
        return !!user;
    },

    async hashPassword(plainText: string): Promise<string> {
        return PasswordUtil.hash(plainText);
    },

    async verifyPassword(plainText: string, hash: string): Promise<boolean> {
        return PasswordUtil.verify(plainText, hash);
    },

    async createUser(input: RegisterInput & { passwordHash: string }): Promise<User> {
        return prisma.user.create({
        data: {
            name:         input.name,
            email:        input.email,
            passwordHash: input.passwordHash,
            role:         input.role ?? 'VIEWER',
            status:       'ACTIVE',
        },
        });
    },

    generateTokenPair(user: User): { accessToken: string; refreshToken: string } {
        return JWTUtil.generateTokenPair({
            id:    user.id,
            email: user.email,
            role:  user.role,
        });
    },


    

    async storeRefreshToken(
        userId:       string,
        refreshToken: string,
        req:          Request,
    ): Promise<void> {
        const hashedToken = await PasswordUtil.hash(refreshToken);
    
        const days        = parseInt(env.REFRESH_TOKEN_EXPIRY.replace('d', ''), 10);
        const expiresAt   = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    
        await prisma.refreshToken.create({
        data: {
            userId,
            tokenHash: hashedToken,
            expiresAt,
            ipAddress: req.ip ?? null,
            userAgent: req.headers['user-agent'] ?? null,
            },
        });
    },

    async validateRefreshToken(rawToken: string, userId: string): Promise<RefreshToken> {
        const stored = await prisma.refreshToken.findMany({
            where: {
                userId,
                isRevoked:  false,
                expiresAt:  { gt: new Date() },
            },
        });
    
        for (const record of stored) {
            const matches = await PasswordUtil.verify(rawToken, record.tokenHash);
            if (matches) return record;
        }
    
        throw Errors.tokenInvalid();
    },

    async revokeRefreshToken(tokenId: string): Promise<void> {
        await prisma.refreshToken.update({
            where: { id: tokenId },
            data:  { isRevoked: true },
        });
    },

    async revokeAllRefreshTokens(userId: string): Promise<void> {
        await prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data:  { isRevoked: true },
        });
    },

    async updateLastLogin(userId: string): Promise<void> {
        await prisma.user.update({
            where: { id: userId },
            data:  { lastLoginAt: new Date() },
        });
    },

    async logAuthEvent(
        userId: string,
        action: AuditAction,
        req:    Request,
    ): Promise<void> {
        await prisma.auditLog.create({
        data: {
            entityType:  'USER',
            entityId:    userId,
            action,
            performedBy: userId,
            ipAddress:   req.ip ?? null,
            userAgent:   req.headers['user-agent'] ?? null,
        },
        });
    },

    sanitizeUser(user: User): SafeUser {
        const { passwordHash, deletedAt, ...safe } = user;
        return safe;
    },


    buildAuthResponse(user: User, tokens: { accessToken: string; refreshToken: string }): AuthTokenResponse {
        return {
            user: authService.sanitizeUser(user),
            tokens,
        };
    },
};