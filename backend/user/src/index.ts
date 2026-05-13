import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";
import userRoutes from "./routes/user.js";
import { connectRabbitMQ } from "./config/rabbitmq.js";
import cors from "cors";

dotenv.config({});

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:3000", "https://chat-app-4yyb.vercel.app"],
    credentials: true
}));

app.use("/api/v1", userRoutes);

// ✅ Bootstrap function (IMPORTANT FIX)
const startServer = async () => {
    try {
        // 1. DB
        await connectDb();
        console.log("✅ MongoDB connected");

        // 2. Redis
        await redisClient.connect();
        console.log("✅ Redis connected");

        // 3. RabbitMQ (CRITICAL)
        await connectRabbitMQ();
        console.log("✅ RabbitMQ connected");

        // 4. Start server ONLY after everything is ready
        const port = process.env.PORT || 5000;

        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });

    } catch (err) {
        console.log("❌ Server startup failed:", err);
    }
};

// Redis client (keep outside)
export const redisClient = createClient({
    url: process.env.REDIS_URL as string
});

startServer();