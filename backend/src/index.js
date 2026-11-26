import "dotenv/config";
import job from "./lib/cron.js";
import {app, server} from "./lib/socket.js";
import express from "express";
import clerkWebhook from "./webhooks/clerk.webhook.js";
import authRoutes from "./routes/auth.route.js";
import messagesRoutes from "./routes/message.route.js";
//import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import fs from "fs";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
//import { server } from "./lib/socket.js";

//dotenv.config();


const PORT = process.env.PORT || 3000;
const publicDir = path.join(process.cwd(), "public");

// Clerk webhook - raw body is required for signature verification
app.use(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhook
);

console.log("MongoDB URI loaded:", !!process.env.MONGO_URI);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Parse JSON for all other routes
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messagesRoutes);

// Serve frontend in production
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));

  app.get("/{*any}", (req, res, next) => {
    res.sendFile(path.join(publicDir, "index.html"), (err) => {
      if (err) {
        next(err);
      }
    });
  });
}

// Start server only after MongoDB connects
async function startServer() {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log("Server is running on port", PORT);
      console.log("NODE_ENV:", process.env.NODE_ENV);

      if (process.env.NODE_ENV === "production") {
        job.start();
        console.log("Cron job started successfully!");
      }
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
