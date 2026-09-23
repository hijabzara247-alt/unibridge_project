const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signs a JWT containing just the user's id. Kept short-lived-ish via
// JWT_EXPIRES_IN in .env (default 7 days).
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, password, universityName, department, role, yearOfStudy } = req.body;

    if (!fullName || !email || !password || !universityName || !department || !role || !yearOfStudy) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      universityName,
      department,
      role,
      yearOfStudy,
    });

    const token = signToken(user._id);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // password has `select: false` on the schema, so it must be explicitly requested
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// GET /api/auth/me  (requires auth) - used by the frontend to restore a
// session on page refresh from the stored token.
const getMe = async (req, res) => {
  res.status(200).json({ user: req.user.toSafeObject() });
};

module.exports = { register, login, getMe };
