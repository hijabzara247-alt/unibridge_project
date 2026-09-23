const mongoose = require("mongoose");

// Connects to MongoDB using the URI from .env / environment variables.
// Reuses an existing connection if one is already open - important on
// Vercel, where a new "cold start" can otherwise open a fresh connection
// on every request and quickly exhaust MongoDB Atlas's connection limit.
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    // On long-running hosts (local, Railway, Render) there's no point
    // running a server that can't reach its data store, so exit.
    // On Vercel this file is never reached without going through
    // api/index.js, which handles the error per-request instead.
    if (require.main === module) process.exit(1);
    throw err;
  }
};

module.exports = connectDB;
