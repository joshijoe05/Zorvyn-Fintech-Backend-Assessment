import { UserRole, UserStatus } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id:     string;
        email:  string;
        name:   string;
        role:   UserRole;
        status: UserStatus;
      };
    }
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    validatedQuery?: any;
  }
}
 
export {};