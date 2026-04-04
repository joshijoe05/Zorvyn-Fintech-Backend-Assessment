import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

export const allowRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;

        if (!user || !roles.includes(user.role)) {
            throw new ApiError(403, "Forbidden");
        }

        next();
    };
};