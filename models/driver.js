import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: "driver", enum: ["driver"] },
    carModel: { type: String, required: true },
    carImage: { type: String, required: true },
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

const Driver = mongoose.models.Driver || mongoose.model("Driver", driverSchema);

export default Driver;

