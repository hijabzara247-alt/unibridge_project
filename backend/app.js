// The Express app itself (routes + middleware), with no app.listen() call.
// server.js uses this for local/Railway/Render style hosting.
// api/index.js uses this for Vercel serverless hosting.
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const questionRoutes = require("./routes/questionRoutes");
const metaRoutes = require("./routes/metaRoutes");

const app = express();

// --- Middleware ---
const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(",");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/meta", metaRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "UniBridge API" });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Generic error handler (catches anything thrown/passed to next())
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
