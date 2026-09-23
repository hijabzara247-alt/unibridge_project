const express = require("express");
const router = express.Router();
const { findSeniors, findJuniors } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.get("/seniors", protect, findSeniors);
router.get("/juniors", protect, findJuniors);

module.exports = router;
