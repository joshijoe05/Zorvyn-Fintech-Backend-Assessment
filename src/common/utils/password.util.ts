import bcrypt from 'bcrypt';
import { env } from '../../config/env';

const saltRounds = parseInt(env.BCRYPT_SALT_ROUNDS, 10);

export const PasswordUtil = {

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, saltRounds);
  },

  async verify(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  },
};