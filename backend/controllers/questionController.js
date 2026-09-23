const Question = require("../models/Question");

// GET /api/questions  (requires auth)
// Returns only questions posted by users at the SAME university as the
// logged-in user - the core "university-based isolation" rule for the feed.
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      universityKey: req.user.universityKey, // <-- university isolation
    }).sort({ createdAt: -1 });

    res.status(200).json({ questions });
  } catch (err) {
    console.error("Get questions error:", err);
    res.status(500).json({ message: "Server error while fetching questions" });
  }
};

// GET /api/questions/:id  (requires auth)
// A user can only fetch a single question if it belongs to their own
// university, even if they somehow have the ID of one from elsewhere.
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findOne({
      _id: req.params.id,
      universityKey: req.user.universityKey, // <-- university isolation
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ question });
  } catch (err) {
    console.error("Get question error:", err);
    res.status(500).json({ message: "Server error while fetching question" });
  }
};

// POST /api/questions  (requires auth)
const createQuestion = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const question = await Question.create({
      title,
      description,
      askedBy: req.user._id,
      askedByName: req.user.fullName,
      askedByRole: req.user.role,
      universityKey: req.user.universityKey,
    });

    res.status(201).json({ message: "Question posted", question });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    console.error("Create question error:", err);
    res.status(500).json({ message: "Server error while posting question" });
  }
};

// POST /api/questions/:id/answers  (requires auth)
const addAnswer = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: "Answer text is required" });
    }

    // Only allow answering questions from the user's own university.
    const question = await Question.findOne({
      _id: req.params.id,
      universityKey: req.user.universityKey, // <-- university isolation
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.answers.push({
      text,
      postedBy: req.user._id,
      postedByName: req.user.fullName,
      postedByRole: req.user.role,
      upvotes: [],
    });

    await question.save();

    res.status(201).json({ message: "Answer posted", question });
  } catch (err) {
    console.error("Add answer error:", err);
    res.status(500).json({ message: "Server error while posting answer" });
  }
};

// PATCH /api/questions/:questionId/answers/:answerId/upvote  (requires auth)
// Toggles the current user's upvote on an answer (upvote / remove upvote).
const toggleUpvote = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;

    const question = await Question.findOne({
      _id: questionId,
      universityKey: req.user.universityKey, // <-- university isolation
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = question.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    const userId = req.user._id.toString();
    const alreadyUpvoted = answer.upvotes.some((id) => id.toString() === userId);

    if (alreadyUpvoted) {
      answer.upvotes = answer.upvotes.filter((id) => id.toString() !== userId);
    } else {
      answer.upvotes.push(req.user._id);
    }

    await question.save();

    res.status(200).json({ question });
  } catch (err) {
    console.error("Upvote error:", err);
    res.status(500).json({ message: "Server error while updating upvote" });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  addAnswer,
  toggleUpvote,
};
