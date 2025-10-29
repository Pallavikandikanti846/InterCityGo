import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, refPath: "driverModel" },
    driverModel: { type: String, enum: ["User", "Driver"], default: "Driver" },
    pickupLocation: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
    },
    dropoffLocation: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String, required: true },
    },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    availableSeats: { type: Number, required: true, default: 4 },
    rideType: { 
      type: String, 
      enum: ["private", "pooling", "women-only"], 
      default: "pooling" 
    },
    baseFare: { type: Number, required: true },
    taxesAndFees: { type: Number, required: true },
    totalFare: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["available", "in-progress", "completed", "cancelled"], 
      default: "available" 
    },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

export default Trip;

