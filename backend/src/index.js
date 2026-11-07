//const express = require('express');
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
console.log("DB URL:", process.env.DB_URL);
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});