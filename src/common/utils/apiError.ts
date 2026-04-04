export class ApiError extends Error {
    public statusCode: number;
    public success: boolean;
    public code: string;
    public errors: unknown[];
    public data: null;

    constructor(
        message: string = "Something went wrong",
        statusCode: number,
        code: string = "INTERNAL_SERVER_ERROR",
        errors: unknown[] = [],
        stack?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.code = code;
        this.errors = errors;
        this.data = null;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export const Errors = {
  badRequest: (message: string, code = 'BAD_REQUEST') =>
    new ApiError(message, 400, code),
 
  validationFailed: (message: string) =>
    new ApiError(message, 400, 'VALIDATION_FAILED'),
 
  unauthorized: (message = 'Authentication required') =>
    new ApiError(message, 401, 'UNAUTHORIZED'),
 
  invalidCredentials: () =>
    new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS'),
 
  tokenExpired: () =>
    new ApiError('Token has expired', 401, 'TOKEN_EXPIRED'),
 
  tokenInvalid: () =>
    new ApiError('Token is invalid', 401, 'TOKEN_INVALID'),
 
  forbidden: (message = 'You do not have permission to perform this action') =>
    new ApiError(message, 403, 'FORBIDDEN'),
 
  notFound: (resource: string) =>
    new ApiError(`${resource} not found`, 404, 'NOT_FOUND'),
 
  conflict: (message: string) =>
    new ApiError(message, 409, 'CONFLICT'),
 
  tooManyRequests: () =>
    new ApiError('Too many requests, please try again later', 429, 'TOO_MANY_REQUESTS'),
 
  internal: (message = 'An unexpected error occurred') =>
    new ApiError(message, 500, 'INTERNAL_ERROR'),
} as const;