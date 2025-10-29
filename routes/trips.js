import express from "express";
import Trip from "../models/trip.js";
import Booking from "../models/booking.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/search", authenticateToken, async (req, res) => {
  try {
    const { pickupCity, dropoffCity, date, rideType } = req.body;
    
    const query = {
      "pickupLocation.city": pickupCity,
      "dropoffLocation.city": dropoffCity,
      status: "available",
      availableSeats: { $gt: 0 },
    };

    if (date) {
      const searchDate = new Date(date);
      query.date = {
        $gte: searchDate,
        $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000),
      };
    }

    if (rideType && rideType !== "all") {
      query.rideType = rideType;
    }

    const trips = await Trip.find(query)
      .populate("driver", "name email")
      .sort({ date: 1, time: 1 });

    res.json({ trips });
  } catch (error) {
    res.status(500).json({ message: "Search failed", error: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { pickupLocation, dropoffLocation, date, time, rideType, availableSeats } = req.body;

    const baseFare = 110.0;
    const taxesAndFees = 10.0;
    const totalFare = baseFare + taxesAndFees;

    const Driver = (await import("../models/driver.js")).default;
    const driver = await Driver.findById(req.user.id);
    
    const trip = await Trip.create({
      driver: req.user.id,
      driverModel: driver ? "Driver" : "User",
      pickupLocation,
      dropoffLocation,
      date,
      time,
      rideType,
      availableSeats,
      baseFare,
      taxesAndFees,
      totalFare,
    });

    res.status(201).json({ message: "Trip created successfully", trip });
  } catch (error) {
    res.status(500).json({ message: "Failed to create trip", error: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("driver", "name email phone")
      .populate("passengers", "name email");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.json({ trip });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch trip", error: error.message });
  }
});

router.post("/:id/book", authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const existingBooking = await Booking.findOne({
      user: req.user.id,
      trip: trip._id,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "You have already booked this trip" });
    }

    let fareAmount = trip.totalFare;
    if (trip.rideType === "pooling") {
      fareAmount = Math.round(trip.totalFare / 2);
    }

    const booking = await Booking.create({
      user: req.user.id,
      trip: trip._id,
      fareAmount,
      status: "confirmed",
      paymentStatus: "paid",
    });

    trip.availableSeats -= 1;
    trip.passengers.push(req.user.id);
    await trip.save();

    res.status(201).json({ message: "Booking confirmed", booking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

router.get("/:id/pool", authenticateToken, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate("passengers", "name");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const privateFare = trip.totalFare;
    const poolFare = Math.round(trip.totalFare / 2);
    const savings = privateFare - poolFare;

    res.json({
      coPassengers: trip.passengers,
      privateFare,
      poolFare,
      savings,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pool details", error: error.message });
  }
});

export default router;

