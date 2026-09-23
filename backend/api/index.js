// Vercel serverless entry point. Vercel finds any file under /api and
// turns it into a live endpoint. Because vercel.json (see below) routes
// every request here, this one file serves the whole Express app.
require("dotenv").config();
const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
