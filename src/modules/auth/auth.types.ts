import { User } from '@prisma/client';

export type SafeUser = Omit<User, 'passwordHash' | 'deletedAt'>;

export interface AuthTokenResponse {
  user:   SafeUser;
  tokens: {
    accessToken:  string;
    refreshToken: string;
  };
}