// server/src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["passenger", "driver", "admin"], default: "passenger" },
  },
  { timestamps: true }
);

// Prevent Mongoose from overwriting model if it already exists
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
