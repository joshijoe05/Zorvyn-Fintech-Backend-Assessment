import { Request, Response, NextFunction } from "express";
import ApiError from "../utils/apiError";

const errorMiddleware = (
    err: ApiError | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode =
        err instanceof ApiError ? err.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
        errors: err instanceof ApiError ? err.errors : [],
        stack:
            process.env.NODE_ENV === "development"
                ? err.stack
                : undefined,
    });
};

export default errorMiddleware;