//const express = require('express');
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
// import authRoutes from "./routes/auth.js";
// import messageRoutes from "./routes/messages.js";
// import User from "./models/User.js";
import bodyParser from "body-parser";

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());
console.log("DB URL:", process.env.DB_URL);
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on port", PORT);
});