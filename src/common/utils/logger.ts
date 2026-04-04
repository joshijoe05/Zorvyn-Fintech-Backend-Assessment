import { createLogger, transports, format } from "winston";
import { env } from "../../config/env";
import path from "path";
import fs from "fs";
import DailyRotateFile from "winston-daily-rotate-file";
import { da } from "zod/locales";

let logDirectory = env.LOG_DIRECTORY

if(!logDirectory) logDirectory = path.resolve('logs') 

if(!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logLevel = env.NODE_ENV === "development" ? "debug" : "warn"

const dailyRotateFile = new DailyRotateFile({
    level: logLevel,
    filename: `${logDirectory}/%DATE%-results.log`,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    handleExceptions: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: format.combine(
        format.errors({stack: true}),
        format.timestamp(),
        format.json()
    )
})

const logger = createLogger({
    transports: [
        new transports.Console({
            level: logLevel,
            format: format.combine(
                format.errors({stack: true}),
                format.colorize(),
                format.prettyPrint()
            )
        }),
        dailyRotateFile
    ],
    exceptionHandlers: [dailyRotateFile],
    exitOnError: false
});


export default logger;