const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tenant = require("../models/Tenant");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, phone, password, role, companyName } = req.body;

    // Check if user exists
    const exists = await User.findOne({ phone });
    if (exists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    let tenantId = null;

    // Handle tenant creation/assignment
    if (role === "customer") {
      // Customer creates new company
      if (!companyName) {
        return res.status(400).json({ message: "Company name required" });
      }

      const tenant = await Tenant.create({
        name: companyName,
        plan: "free",
        isActive: true
      });
      tenantId = tenant._id;
    } 
    else if (role === "driver") {
      // Driver joins existing company
      if (!companyName) {
        return res.status(400).json({ message: "Company name required" });
      }

      const tenant = await Tenant.findOne({ name: companyName });
      if (!tenant) {
        return res.status(400).json({ 
          message: "Company not found. Ask your admin to register first." 
        });
      }

      tenantId = tenant._id;
    }

    // Create user
    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      name,
      phone,
      password: hashed,
      role,
      companyName,
      tenant: tenantId,
      isVerified: true,
      authProvider: "local",
    });

    res.json({ message: "Registration successful" });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await User.findOne({ phone }).populate("tenant");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if company is active
    if (user.tenant && !user.tenant.isActive) {
      return res.status(403).json({ message: "Your company is inactive" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        tenantId: user.tenant?._id 
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken: token,
      role: user.role
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

module.exports = router;