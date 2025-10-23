// server/src/index.js
import express from "express";
import path from "path";
import url from "url";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

// File path setup (for ES modules)
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Import your MongoDB connection helper
import connectDB from "./modules/InterCityGo/db.js";

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect MongoDB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.status(200).send("InterCityGo Backend Running 🚀");
});

// Example API route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Server + MongoDB Connected ✅" });
});

// Views (optional if you use templating later)
app.set("views", path.join(__dirname, "views"));

// Start server
const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
