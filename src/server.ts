import app from "./app";
import logger from "./common/utils/logger";
import { env } from "./config/env";
import { connectDB } from "./config/db";

const PORT = env.PORT;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
};

startServer();