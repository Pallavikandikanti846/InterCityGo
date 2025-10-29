import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/user.js";
import Driver from "../models/driver.js";

const router = express.Router();

const verifyAdminToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

router.get("/test", async (req, res) => {
  try {
    console.log("=== ADMIN TEST ENDPOINT ===");
    console.log("Mongoose readyState:", mongoose.connection.readyState);
    
    if (mongoose.connection.readyState !== 1) {
      return res.json({ error: "Database not connected", readyState: mongoose.connection.readyState });
    }
    
    const AdminCollection = mongoose.connection.db.collection("admin");
    const allAdmins = await AdminCollection.find({}).toArray();
    
    console.log("Admin collection documents:", allAdmins.length);
    allAdmins.forEach((doc, idx) => {
      console.log(`Document ${idx + 1} FULL:`, JSON.stringify(doc, null, 2));
      console.log(`Document ${idx + 1} keys:`, Object.keys(doc));
    });
    
    res.json({
      message: "Admin collection test",
      count: allAdmins.length,
      documents: allAdmins.map(doc => {
        const data = (doc._id && typeof doc._id === 'object' && doc._id.email) ? doc._id : doc;
        return {
          _id: doc._id,
          email: data.email,
          name: data.name,
          role: data.role,
          hasPassword: !!data.password,
          passwordField: data.password ? "exists" : "missing",
          passwordPreview: data.password ? data.password.substring(0, 10) + "..." : null,
          allFields: Object.keys(doc),
          nestedFields: (doc._id && typeof doc._id === 'object') ? Object.keys(doc._id) : []
        };
      })
    });
  } catch (error) {
    console.error("Test error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  console.log("ADMIN LOGIN ROUTE HIT");
  console.log("Request body:", JSON.stringify(req.body, null, 2));
  
  try {
    const { email, password } = req.body;
    
    console.log("=== ADMIN LOGIN ATTEMPT ===");
    console.log("Email:", email);
    console.log("Password received:", password ? "*** (length: " + password.length + ")" : "missing");
    console.log("Mongoose connection state:", mongoose.connection.readyState);
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    let user = null;
    let userCollection = null;
    
    console.log("Checking users collection...");
    try {
      user = await User.findOne({ email, role: "admin" });
      if (user) {
        userCollection = User;
        console.log("Admin user found in users collection");
        console.log("User details:", { name: user.name, email: user.email, role: user.role, hasPassword: !!user.password });
      } else {
        const userByEmail = await User.findOne({ email });
        if (userByEmail) {
          console.log("User found but role is:", userByEmail.role);
        } else {
          console.log("No user found in users collection with email:", email);
        }
      }
    } catch (userError) {
      console.error("Error checking users collection:", userError);
    }
    
    if (!user) {
      console.log("Checking admin collection...");
      try {
        if (mongoose.connection.readyState !== 1) {
          console.error("MongoDB not connected. ReadyState:", mongoose.connection.readyState);
          return res.status(500).json({ message: "Database connection error" });
        }
        
        const AdminCollection = mongoose.connection.db.collection("admin");
        console.log("Admin collection accessed");
        
        let adminDoc = await AdminCollection.findOne({ email: email });
        
        if (!adminDoc) {
          console.log("Normal query failed, trying nested _id.email query...");
          adminDoc = await AdminCollection.findOne({ "_id.email": email });
        }
        
        if (!adminDoc) {
          console.log("Nested query failed, fetching all and filtering manually...");
          const allDocs = await AdminCollection.find({}).toArray();
          adminDoc = allDocs.find(doc => {
            if (doc.email === email || doc.email?.toLowerCase() === email.toLowerCase()) {
              return true;
            }
            if (doc._id && typeof doc._id === 'object' && doc._id.email) {
              return doc._id.email === email || doc._id.email?.toLowerCase() === email.toLowerCase();
            }
            return false;
          });
          console.log("Manual search result:", adminDoc ? "Found" : "Not found");
        }
        
        console.log("Query result:", adminDoc ? "Found document" : "No document found");
        
        if (adminDoc) {
          console.log("Admin document FULL:", JSON.stringify(adminDoc, null, 2));
          console.log("Admin document keys:", Object.keys(adminDoc));
          
          let adminData = adminDoc;
          if (adminDoc._id && typeof adminDoc._id === 'object' && adminDoc._id.email) {
            console.log("WARNING: Fields are nested inside _id! Fixing structure...");
            adminData = { ...adminDoc._id, _id: adminDoc._id.id || adminDoc._id._id || adminDoc._id };
          }
          
          console.log("Admin document found:", {
            email: adminData.email,
            name: adminData.name,
            role: adminData.role,
            hasPassword: !!adminData.password,
            passwordValue: adminData.password ? adminData.password.substring(0, 10) + "..." : "NULL/MISSING",
            passwordType: adminData.password ? (adminData.password.startsWith("$2") ? "hashed" : "plain") : "none"
          });
          
          if (adminData && (adminData.role === "admin" || !adminData.role)) {
            if (!adminData.password) {
              console.error("ERROR: Admin document found but password field is missing");
              console.error("Available fields:", Object.keys(adminData));
              return res.status(500).json({ 
                message: "Admin account configuration error: password field missing in database" 
              });
            }
            
            user = {
              _id: adminData._id || adminData.id || adminDoc._id,
              id: adminData.id || (adminData._id ? adminData._id.toString() : adminDoc._id.toString()),
              name: adminData.name,
              email: adminData.email,
              password: adminData.password,
              phone: adminData.phone,
              role: adminData.role || "admin"
            };
            userCollection = AdminCollection;
            console.log("Admin user found in admin collection");
          } else if (adminData) {
            console.log("User found but role is:", adminData.role);
          }
        }
      } catch (collectionError) {
        console.error("Error accessing admin collection:", collectionError);
        console.error("Error details:", collectionError.message, collectionError.stack);
      }
    }
    
    if (!user) {
      console.log("Admin user not found in any collection");
      return res.status(401).json({ message: "Invalid credentials or not an admin" });
    }

    console.log("Verifying password...");
    console.log("Stored password:", user.password ? (user.password.substring(0, 10) + "...") : "none");
    console.log("Stored password length:", user.password ? user.password.length : 0);
    
    const isHashed = user.password && (user.password.startsWith("$2a$") || user.password.startsWith("$2b$") || user.password.startsWith("$2y$"));
    console.log("Password is hashed:", isHashed);
    
    let isMatch = false;
    if (isHashed) {
      isMatch = await bcrypt.compare(password, user.password);
      console.log("Bcrypt compare result:", isMatch);
    } else {
      console.log("WARNING: Plain text password detected!");
      console.log("Comparing:", password, "===", user.password);
      console.log("Exact match:", password === user.password);
      console.log("Length match:", password.length === (user.password ? user.password.length : 0));
      
      const trimmedPassword = password.trim();
      const trimmedStored = (user.password || "").trim();
      isMatch = trimmedPassword === trimmedStored;
      
      console.log("Trimmed comparison result:", isMatch);
      
      if (isMatch && userCollection) {
        try {
          console.log("Hashing password for future use...");
          const hashedPassword = await bcrypt.hash(password, 10);
          if (userCollection === User) {
            await User.findByIdAndUpdate(user._id, { password: hashedPassword });
            console.log("Password hashed and updated in User model");
          } else {
            const updateResult = await mongoose.connection.db.collection("admin").updateOne(
              { _id: user._id },
              { $set: { password: hashedPassword } }
            );
            console.log("Password hashed and updated in admin collection. Modified:", updateResult.modifiedCount);
          }
        } catch (hashError) {
          console.error("Error hashing password:", hashError);
        }
      }
    }
    
    if (!isMatch) {
      console.log("Password mismatch");
      console.log("=== LOGIN FAILED ===");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role || "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Admin login successful:", user.email);
    console.log("=== LOGIN SUCCESS ===");
    res.json({
      message: "Admin login successful",
      token,
      user: { 
        _id: user._id,
        id: user._id.toString ? user._id.toString() : (user.id || user._id), 
        name: user.name, 
        email: user.email, 
        phone: user.phone || "", 
        role: user.role || "admin"
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ message: "Admin login failed", error: error.message });
  }
});

router.get("/users", verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      users: users.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        joined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : null,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

router.get("/drivers", verifyAdminToken, async (req, res) => {
  try {
    const drivers = await Driver.find({})
      .select("-password")
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      drivers: drivers.map(driver => ({
        _id: driver._id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone || "",
        role: driver.role,
        carModel: driver.carModel || "",
        carImage: driver.carImage || "",
        status: driver.isOnline ? "Online" : "Offline",
        totalEarnings: driver.totalEarnings || 0,
        createdAt: driver.createdAt
      }))
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Failed to fetch drivers", error: error.message });
  }
});

router.get("/disputes", verifyAdminToken, async (req, res) => {
  try {
    res.json({
      success: true,
      disputes: []
    });
  } catch (error) {
    console.error("Error fetching disputes:", error);
    res.status(500).json({ message: "Failed to fetch disputes", error: error.message });
  }
});

export default router;

