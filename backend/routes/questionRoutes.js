const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  addAnswer,
  toggleUpvote,
} = require("../controllers/questionController");
const { protect } = require("../middleware/auth");

router.get("/", protect, getQuestions);
router.post("/", protect, createQuestion);
router.get("/:id", protect, getQuestionById);
router.post("/:id/answers", protect, addAnswer);
router.patch("/:questionId/answers/:answerId/upvote", protect, toggleUpvote);

module.exports = router;
