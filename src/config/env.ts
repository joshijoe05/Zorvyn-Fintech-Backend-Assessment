import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("3000"),
    POSTGRES_USER: z.string().default("postgres"),
    POSTGRES_PASSWORD: z.string().default("password"),
    POSTGRES_DB: z.string().default("finance_db"),
    DB_HOST: z.string().default("localhost"),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LOG_DIRECTORY: z.string(),
    BCRYPT_SALT_ROUNDS: z.string().default("12"),
    ACCESS_TOKEN_EXPIRY: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
});

export const env = envSchema.parse(process.env);