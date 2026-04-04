import { PrismaClient } from "@prisma/client";
import logger from "../common/utils/logger";

const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.connect();
        logger.info("PostgreSQL connected");
    } catch (error) {
        logger.error("DB connection failed", { error });
        process.exit(1);
    }
};

export default prisma;