const express = require("express");
const router = express.Router();
const { STANDARD_UNIVERSITIES } = require("../config/universities");

// GET /api/meta/universities - public, used to populate the registration
// dropdown on the frontend.
router.get("/universities", (req, res) => {
  res.status(200).json({ universities: STANDARD_UNIVERSITIES });
});

module.exports = router;
