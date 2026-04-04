import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
    PORT: z.string().default("3000"),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    LOG_DIRECTORY: z.string()
});

export const env = envSchema.parse(process.env);