import bcrypt from 'bcrypt';
import { env } from '../../config/env';

export const PasswordUtil = {

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, env.BCRYPT_SALT_ROUNDS);
  },

  async verify(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  },
};