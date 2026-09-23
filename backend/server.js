require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// This file is the entry point for "normal" hosting (your own computer,
// Railway, Render, etc.) where the process stays running and listens on
// a port. Vercel does NOT use this file - see api/index.js instead.
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`UniBridge API running on http://localhost:${PORT}`);
  });
});
