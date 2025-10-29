import express from "express";
import jwt from "jsonwebtoken";
import Driver from "../models/driver.js";
import Booking from "../models/booking.js";
import Trip from "../models/trip.js";
import User from "../models/user.js";

const router = express.Router();

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    if (decoded.role !== "driver") {
      return res.status(403).json({ message: "Access denied. Driver only." });
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/pending-requests", verifyToken, async (req, res) => {
  try {
    const driverTrips = await Trip.find({ 
      driver: req.userId, 
      status: { $in: ["available", "in-progress"] } 
    });

    if (driverTrips.length === 0) {
      return res.json({
        success: true,
        requests: []
      });
    }

    const pendingBookings = await Booking.find({
      trip: { $in: driverTrips.map(t => t._id) },
      status: { $in: ["pending", "confirmed"] }
    })
      .populate("trip")
      .populate({
        path: "user",
        select: "name email phone",
        model: User
      })
      .sort({ createdAt: -1 });

    const requests = pendingBookings.map(booking => {
      const trip = booking.trip;
      const passenger = booking.user;
      
      let pickup = "Unknown";
      let dropoff = "Unknown";
      
      if (trip) {
        if (typeof trip.pickupLocation === "string") {
          pickup = trip.pickupLocation;
        } else if (trip.pickupLocation?.address) {
          pickup = trip.pickupLocation.address;
        } else if (trip.pickupLocation) {
          pickup = `${trip.pickupLocation.city || ""}, ${trip.pickupLocation.province || ""}`.trim();
        }

        if (typeof trip.dropoffLocation === "string") {
          dropoff = trip.dropoffLocation;
        } else if (trip.dropoffLocation?.address) {
          dropoff = trip.dropoffLocation.address;
        } else if (trip.dropoffLocation) {
          dropoff = `${trip.dropoffLocation.city || ""}, ${trip.dropoffLocation.province || ""}`.trim();
        }
      }
      
      let displayTime = trip?.time || "N/A";
      if (trip?.date) {
        try {
          const tripDate = new Date(trip.date);
          const dateStr = tripDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          displayTime = `${dateStr} ${displayTime}`;
        } catch (e) {
        }
      }

      return {
        id: booking._id.toString(),
        bookingId: booking._id.toString(),
        tripId: trip?._id?.toString() || null,
        time: displayTime,
        date: trip?.date || null,
        route: `${pickup} to ${dropoff}`,
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        passengers: 1,
        fare: booking.fareAmount || trip?.totalFare || 0,
        status: booking.status,
        passenger: passenger ? {
          id: passenger._id?.toString(),
          name: passenger.name || "Unknown",
          email: passenger.email || "",
          phone: passenger.phone || ""
        } : null,
        createdAt: booking.createdAt
      };
    });

    res.json({
      success: true,
      requests: requests
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending requests",
      error: error.message
    });
  }
});

router.get("/booking/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("trip")
      .populate({
        path: "user",
        select: "name email phone",
        model: User
      });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const trip = booking.trip;
    if (!trip || trip.driver?.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const passenger = booking.user;
    let pickup = "Unknown";
    let dropoff = "Unknown";

    if (trip) {
      if (typeof trip.pickupLocation === "string") {
        pickup = trip.pickupLocation;
      } else if (trip.pickupLocation?.address) {
        pickup = trip.pickupLocation.address;
      } else if (trip.pickupLocation) {
        pickup = `${trip.pickupLocation.city || ""}, ${trip.pickupLocation.province || ""}`.trim();
      }

      if (typeof trip.dropoffLocation === "string") {
        dropoff = trip.dropoffLocation;
      } else if (trip.dropoffLocation?.address) {
        dropoff = trip.dropoffLocation.address;
      } else if (trip.dropoffLocation) {
        dropoff = `${trip.dropoffLocation.city || ""}, ${trip.dropoffLocation.province || ""}`.trim();
      }
    }

    res.json({
      success: true,
      booking: {
        id: booking._id.toString(),
        pickupLocation: pickup,
        dropoffLocation: dropoff,
        time: trip?.time || "N/A",
        fare: booking.fareAmount || trip?.totalFare || 0,
        status: booking.status,
        passenger: passenger ? {
          name: passenger.name || "Unknown",
          email: passenger.email || "",
          phone: passenger.phone || "",
          rating: 4.8,
          rides: 120
        } : null
      }
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message
    });
  }
});

router.post("/booking/:id/accept", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("trip");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.trip.driver?.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    booking.status = "confirmed";
    await booking.save();

    if (booking.trip.status === "available") {
      booking.trip.status = "in-progress";
      await booking.trip.save();
    }

    res.json({
      success: true,
      message: "Booking accepted",
      booking
    });
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to accept booking",
      error: error.message
    });
  }
});

router.post("/booking/:id/decline", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("trip");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.trip.driver?.toString() !== req.userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    booking.status = "cancelled";
    await booking.save();

    booking.trip.availableSeats += 1;
    booking.trip.passengers = booking.trip.passengers.filter(
      p => p.toString() !== booking.user.toString()
    );
    await booking.trip.save();

    res.json({
      success: true,
      message: "Booking declined",
      booking
    });
  } catch (error) {
    console.error("Error declining booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to decline booking",
      error: error.message
    });
  }
});

router.get("/earnings", verifyToken, async (req, res) => {
  try {
    const driver = await Driver.findById(req.userId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const driverTrips = await Trip.find({ driver: req.userId });

    const completedBookings = await Booking.find({
      trip: { $in: driverTrips.map(t => t._id) },
      status: "completed"
    })
      .populate({
        path: "trip"
      })
      .sort({ updatedAt: -1 });

    const payments = completedBookings.map(booking => {
      const trip = booking.trip;
      let pickup = "Unknown";
      let dropoff = "Unknown";

      if (trip) {
        if (typeof trip.pickupLocation === "string") {
          pickup = trip.pickupLocation;
        } else if (trip.pickupLocation?.address) {
          pickup = trip.pickupLocation.address;
        } else if (trip.pickupLocation) {
          pickup = `${trip.pickupLocation.city || ""}, ${trip.pickupLocation.province || ""}`.trim();
        }

        if (typeof trip.dropoffLocation === "string") {
          dropoff = trip.dropoffLocation;
        } else if (trip.dropoffLocation?.address) {
          dropoff = trip.dropoffLocation.address;
        } else if (trip.dropoffLocation) {
          dropoff = `${trip.dropoffLocation.city || ""}, ${trip.dropoffLocation.province || ""}`.trim();
        }
      }

      return {
        id: booking._id.toString(),
        amount: booking.fareAmount || 0,
        trip: `${pickup} to ${dropoff}`,
        date: booking.updatedAt || booking.createdAt
      };
    });

    const totalEarnings = payments.reduce((sum, payment) => sum + payment.amount, 0);

    const rideHistory = completedBookings.map(booking => {
      const trip = booking.trip;
      let pickup = "Unknown";
      let dropoff = "Unknown";

      if (trip) {
        if (typeof trip.pickupLocation === "string") {
          pickup = trip.pickupLocation;
        } else if (trip.pickupLocation?.address) {
          pickup = trip.pickupLocation.address;
        } else if (trip.pickupLocation) {
          pickup = `${trip.pickupLocation.city || ""}, ${trip.pickupLocation.province || ""}`.trim();
        }

        if (typeof trip.dropoffLocation === "string") {
          dropoff = trip.dropoffLocation;
        } else if (trip.dropoffLocation?.address) {
          dropoff = trip.dropoffLocation.address;
        } else if (trip.dropoffLocation) {
          dropoff = `${trip.dropoffLocation.city || ""}, ${trip.dropoffLocation.province || ""}`.trim();
        }
      }

      return {
        id: booking._id.toString(),
        route: `${pickup} to ${dropoff}`,
        status: "completed",
        date: booking.updatedAt || booking.createdAt
      };
    });

    res.json({
      success: true,
      totalEarnings: driver.totalEarnings || totalEarnings,
      payments: payments,
      completedRides: rideHistory
    });
  } catch (error) {
    console.error("Error fetching driver earnings:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch earnings", 
      error: error.message 
    });
  }
});

export default router;
