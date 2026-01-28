const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true, sparse: true },
    phone: String,
    password: String,
    role: {
      type: String,
      enum: ["customer", "driver", "admin","superadmin"],
      default: "customer",
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: { type: String },
    companyName: String,
    tenant:{
      type: mongoose.Schema.Types.ObjectId,
      ref : "Tenant",
      default: null
    },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
  
);

module.exports = mongoose.model("User", userSchema);
