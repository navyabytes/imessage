//const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
// import authRoutes from "./routes/auth.js";
// import messageRoutes from "./routes/messages.js";
// import User from "./models/User.js";
import bodyParser from "body-parser";

import { clerkMiddleware } from "@clerk/express";

dotenv.config();
const app = express();

app.use(bodyParser.json());

//cors error - you tried to get data from another site but the browser didn't let you
//fix - you should tell the backend to allow requests from your frontend

app.use(express.json()); 
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true })); 
//app.use(cors()); - any website to call your api we want only frontend to call our api, so we will use the origin option to specify the frontend url
//cors - cors origin resource sharing, which allows the server to specify which domains are allowed to access its resources. In this case, it is allowing requests from any origin.
app.use(clerkMiddleware());

console.log("DB URL:", process.env.DB_URL);
const PORT = process.env.PORT ;

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// app.use("/api/auth", authRoutes);
// app.use("/api/messages", messageRoutes);
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});