// routes/bookings.js
import express from "express";
import Booking from "../models/booking.js";
import Trip from "../models/trip.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// GET /api/bookings/my-trips - Get user's bookings
router.get("/my-trips", authenticateToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "trip",
        populate: { path: "driver", select: "name email" },
      })
      .sort({ createdAt: -1 });

    // Separate into upcoming and past
    const now = new Date();
    const upcoming = [];
    const past = [];

    bookings.forEach((booking) => {
      if (booking.trip && new Date(booking.trip.date) >= now) {
        upcoming.push(booking);
      } else if (booking.trip) {
        past.push(booking);
      }
    });

    res.json({ upcoming, past });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
  }
});

// GET /api/bookings/:id - Get booking details
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: "trip",
        populate: { path: "driver", select: "name email phone" },
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch booking", error: error.message });
  }
});

// PUT /api/bookings/:id/cancel - Cancel a booking
router.put("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    // Update trip availability
    const trip = await Trip.findById(booking.trip);
    if (trip) {
      trip.availableSeats += 1;
      trip.passengers = trip.passengers.filter(
        (p) => p.toString() !== req.user.id
      );
      await trip.save();
    }

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Failed to cancel booking", error: error.message });
  }
});

export default router;

