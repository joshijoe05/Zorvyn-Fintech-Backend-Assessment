import app from "./app";
import logger from "./common/utils/logger";
import { env } from "./config/env";

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  console.log(`Server running on port ${PORT}`);
});