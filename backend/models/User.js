const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Turns any user-entered university string into one consistent form so that
// "Govt Post Graduate College Mansehra", "govt post graduate college
// mansehra " and "GOVT POST GRADUATE COLLEGE MANSEHRA" all collapse to the
// same value. This is the core of the university-based isolation: every
// list/query in the app filters by this normalized value.
function normalizeUniversityName(name) {
  return name
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // never return the password hash by default
    },
    // The raw, human-readable name shown on the UI (e.g. in the navbar).
    universityName: {
      type: String,
      required: [true, "University/College name is required"],
      trim: true,
    },
    // The normalized form used for filtering/matching. This is what every
    // "same university" query actually compares against.
    universityKey: {
      type: String,
      required: true,
      index: true, // queried on almost every request, so this is indexed
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: {
        values: ["Senior", "Junior"],
        message: "Role must be either Senior or Junior",
      },
      required: [true, "Role is required"],
    },
    yearOfStudy: {
      type: String,
      required: [true, "Year of study is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

// Compound index: most "find people at my university" queries filter by
// university + role, so index them together for fast lookups.
userSchema.index({ universityKey: 1, role: 1 });

// Keep universityKey in sync any time universityName is set or changed.
userSchema.pre("validate", function (next) {
  if (this.universityName) {
    this.universityKey = normalizeUniversityName(this.universityName);
  }
  next();
});

// Hash the password before saving, but only if it was actually modified
// (avoids re-hashing an already-hashed password on unrelated updates).
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method used by the login controller to check a plaintext
// password against the stored hash.
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Strip sensitive/internal fields whenever a user document is sent as JSON.
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    universityName: this.universityName,
    department: this.department,
    role: this.role,
    yearOfStudy: this.yearOfStudy,
    createdAt: this.createdAt,
  };
};

userSchema.statics.normalizeUniversityName = normalizeUniversityName;

module.exports = mongoose.model("User", userSchema);
