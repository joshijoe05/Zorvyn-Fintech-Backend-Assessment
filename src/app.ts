import express from "express";
import cors from "cors";
import helmet from "helmet";
import errorMiddleware from "./common/middleware/error.middleware";

const app = express();

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(helmet());

app.use(express.static("public"));

app.use(errorMiddleware);

app.get("/", (req, res) => {
    res.send("API is running...");
});

export default app;