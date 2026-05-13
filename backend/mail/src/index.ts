import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { startSendOtpConsumer } from "./consumer.js";

dotenv.config({});

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chat-app-4yyb.vercel.app"
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Mail Service Running 🚀");
});

const port = process.env.PORT || 5001;

// 🔥 CRITICAL FIX: START EVERYTHING IN ORDER
const startServer = async () => {
  try {
    console.log("⏳ Starting RabbitMQ consumer...");

    await startSendOtpConsumer();

    console.log("✅ RabbitMQ consumer READY");

    app.listen(port, () => {
      console.log(`🚀 Mail service running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error("❌ Mail service failed to start:", err);
  }
};

startServer();