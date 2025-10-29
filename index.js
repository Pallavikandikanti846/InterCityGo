import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import url from "url";
import connectDB from "./modules/InterCityGo/db.js";
import authRoutes from "./routes/auth.js";
import tripRoutes from "./routes/trips.js";
import bookingRoutes from "./routes/bookings.js";
import driverRoutes from "./routes/driver.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

connectDB();
// ✅ Health check route
app.get("/api/ping", (req, res) => {
  res.json({ message: "Server + MongoDB Connected ✅" });
});

// ✅ Register routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/driver", driverRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.status(200).send("InterCityGo Backend Running 🚀"));



const PORT = process.env.PORT || 8888;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
