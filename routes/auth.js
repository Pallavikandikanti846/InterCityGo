// server/src/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import url from "url";
import fs from "fs";
import User from "../models/user.js";
import Driver from "../models/driver.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../public/uploads/cars");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "car-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// POST /api/auth/signup
router.post("/signup", upload.single("carImage"), async (req, res) => {
  try {
    const { name, email, password, phone, role, carModel } = req.body;

    console.log("Signup request received:", { 
      name, 
      email, 
      role, 
      phone: phone ? "provided" : "not provided",
      carModel: carModel ? "provided" : "not provided",
      carImage: req.file ? "uploaded" : "not uploaded"
    });

    // Validate driver required fields
    if (role === "driver") {
      if (!name || !email || !password || !phone || !carModel || !req.file) {
        // Delete uploaded file if validation fails
        if (req.file) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (deleteError) {
            console.error("Error deleting file:", deleteError);
          }
        }
        return res.status(400).json({ 
          message: "All fields are required for driver registration: name, email, password, phone, car model, and car image" 
        });
      }
    }

    // Check if user exists in either collection
    const existingUser = await User.findOne({ email });
    const existingDriver = await Driver.findOne({ email });
    if (existingUser || existingDriver) {
      // Delete uploaded file if user exists
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (deleteError) {
          console.error("Error deleting file:", deleteError);
        }
      }
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to appropriate collection based on role
    if (role === "driver") {
      console.log("Creating driver in Drivers collection...");
      try {
        const carImageUrl = `/uploads/cars/${req.file.filename}`;
        
        const driverData = { 
          name, 
          email, 
          password: hashedPassword, 
          phone: phone.trim(),
          carModel: carModel.trim(),
          carImage: carImageUrl,
          role: "driver" 
        };
        
        const driver = await Driver.create(driverData);
        console.log("Driver created successfully:", driver._id);
        res.status(201).json({
          message: "Driver registered successfully. Please login.",
          success: true,
        });
      } catch (driverError) {
        console.error("Error creating driver:", driverError);
        // Delete uploaded file if creation fails
        if (req.file) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (deleteError) {
            console.error("Error deleting file:", deleteError);
          }
        }
        res.status(500).json({ 
          message: "Driver signup failed", 
          error: driverError.message,
          details: driverError.errors || driverError
        });
        return;
      }
    } else {
      console.log("Creating user in Users collection...");
      try {
        const userData = { 
          name, 
          email, 
          password: hashedPassword, 
          phone: phone && phone.trim() !== "" ? phone.trim() : undefined,
          role: role || "passenger" 
        };
        
        const user = await User.create(userData);
        console.log("User created successfully:", user._id);
        res.status(201).json({
          message: "User registered successfully. Please login.",
          success: true,
        });
      } catch (userError) {
        console.error("Error creating user:", userError);
        res.status(500).json({ 
          message: "User signup failed", 
          error: userError.message,
          details: userError.errors || userError
        });
        return;
      }
    }
  } catch (error) {
    console.error("Signup error:", error);
    // Delete uploaded file if error occurs
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (deleteError) {
        console.error("Error deleting file:", deleteError);
      }
    }
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check in both User and Driver collections
    let user = await User.findOne({ email });
    let isDriver = false;
    
    if (!user) {
      user = await Driver.findOne({ email });
      isDriver = true;
    }

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role,
        ...(isDriver && { carModel: user.carModel, carImage: user.carImage })
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET /api/auth/profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    // Check in both User and Driver collections
    let user = await User.findById(req.userId).select("-password");
    
    if (!user) {
      user = await Driver.findById(req.userId).select("-password");
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        phone: user.phone, 
        role: user.role,
        ...(user.role === "driver" && { carModel: user.carModel, carImage: user.carImage })
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch profile", error: error.message });
  }
});

// PUT /api/auth/profile
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Check in both User and Driver collections
    let user = await User.findByIdAndUpdate(
      req.userId,
      { name, phone },
      { new: true, runValidators: true }
    );

    if (!user) {
      user = await Driver.findByIdAndUpdate(
        req.userId,
        { name, phone },
        { new: true, runValidators: true }
      );
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      message: "Profile updated successfully",
      user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
});

export default router;
