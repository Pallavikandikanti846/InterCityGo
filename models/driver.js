// models/driver.js
import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: "driver", enum: ["driver"] },
    // Driver-specific fields
    carModel: { type: String, required: true },
    carImage: { type: String, required: true }, // URL or path to image
    vehicleInfo: {
      make: { type: String, default: "" },
      model: { type: String, default: "" },
      year: { type: Number },
      licensePlate: { type: String, default: "" },
    },
    licenseNumber: { type: String, default: "" },
    isOnline: { type: Boolean, default: false },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent Mongoose from overwriting model if it already exists
const Driver = mongoose.models.Driver || mongoose.model("Driver", driverSchema);

export default Driver;

