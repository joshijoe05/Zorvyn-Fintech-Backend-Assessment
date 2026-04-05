import { NextFunction, Request, Response } from "express";
import { authService } from "./auth.service";
import { ApiResponse, sendResponse } from "../../common/utils/apiResponse";   
import { LoginInput, RefreshInput, RegisterInput } from "./auth.schema";
import { Errors } from "../../common/utils/apiError";
import { JWTUtil } from "../../common/utils/jwt";



export const authController = {
    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: RegisterInput = req.body;
        
            const emailTaken = await authService.emailAlreadyExists(input.email);
            if (emailTaken) throw Errors.conflict('An account with this email already exists');
        
            const passwordHash = await authService.hashPassword(input.password);
        
            const user = await authService.createUser({ ...input, passwordHash });
            const tokens = authService.generateTokenPair(user);
            await authService.storeRefreshToken(user.id, tokens.refreshToken, req);
        
            await authService.logAuthEvent(user.id, 'CREATE', req);
    
            const response = authService.buildAuthResponse(user, tokens);
            sendResponse(res, new ApiResponse(201, response, 'User registered successfully'));
        } catch (err) {
            next(err);
        }
    },

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: LoginInput = req.body;
            const user = await authService.findUserByEmail(input.email);
            if (!user) throw Errors.invalidCredentials();
        
            authService.assertUserIsActive(user);
        
            const passwordValid = await authService.verifyPassword(input.password, user.passwordHash);
            if (!passwordValid) throw Errors.invalidCredentials();
        
            const tokens = authService.generateTokenPair(user);
        
            await authService.storeRefreshToken(user.id, tokens.refreshToken, req);
            await authService.updateLastLogin(user.id);
        
            await authService.logAuthEvent(user.id, 'LOGIN', req);
        
            const response = authService.buildAuthResponse(user, tokens);
            sendResponse(res, new ApiResponse(200, response, 'Login successful'));
        } catch (err) {
            next(err);
        }
    },

    async refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: RefreshInput = req.body;
        
            const payload = JWTUtil.verifyRefreshToken(input.refreshToken);
        
            const user = await authService.findUserById(payload.sub);
            if (!user) throw Errors.tokenInvalid();
            authService.assertUserIsActive(user);
        
            const storedToken = await authService.validateRefreshToken(input.refreshToken, user.id);
            if(!storedToken) throw Errors.tokenInvalid();
        
            await authService.revokeRefreshToken(storedToken.id);
            const tokens = authService.generateTokenPair(user);
        
            await authService.storeRefreshToken(user.id, tokens.refreshToken, req);
        
            const response = authService.buildAuthResponse(user, tokens);
            sendResponse(res, new ApiResponse(200, response, 'Tokens refreshed successfully'));
        } catch (err) {
            next(err);
        }
    },

    async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const input: RefreshInput = req.body;
        
            const userId = req.user!.id;
        
            const payload = JWTUtil.verifyRefreshToken(input.refreshToken);
            if (payload.sub !== userId) throw Errors.forbidden('Token does not belong to this user');
        
            const storedToken = await authService.validateRefreshToken(input.refreshToken, userId);
            await authService.revokeRefreshToken(storedToken.id);
        
            await authService.logAuthEvent(userId, 'LOGOUT', req);
            sendResponse(res, new ApiResponse(200, null, 'Logged out successfully'));
        } catch (err) {
            next(err);
        }
    },
}