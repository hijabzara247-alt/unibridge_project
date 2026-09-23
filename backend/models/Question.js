const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, "Answer text is required"],
      trim: true,
      maxlength: 3000,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Denormalized snapshot of the answerer's name/role at the time of
    // posting, so the feed can render without an extra populate/join.
    postedByName: { type: String, required: true },
    postedByRole: { type: String, enum: ["Senior", "Junior"], required: true },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: [true, "Question description is required"],
      trim: true,
      maxlength: 5000,
    },
    askedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    askedByName: { type: String, required: true },
    askedByRole: { type: String, enum: ["Senior", "Junior"], required: true },
    // Same normalization as User.universityKey - this is what scopes every
    // question to a single university's feed.
    universityKey: {
      type: String,
      required: true,
      index: true,
    },
    answers: [answerSchema],
  },
  { timestamps: true }
);

// Feed queries are "all questions for this university, newest first".
questionSchema.index({ universityKey: 1, createdAt: -1 });

module.exports = mongoose.model("Question", questionSchema);
