const User = require("../models/User");

// GET /api/users/seniors  (requires auth)
// GET /api/users/juniors  (requires auth)
// Both are scoped to req.user.universityKey - this is the enforcement point
// for "Find People" only ever showing people from the SAME university.
const findByRole = (role) => async (req, res) => {
  try {
    const users = await User.find({
      universityKey: req.user.universityKey, // <-- university isolation
      role,
      _id: { $ne: req.user._id }, // don't show the logged-in user to themselves
    })
      .select("fullName department yearOfStudy role")
      .sort({ createdAt: -1 });

    res.status(200).json({ users });
  } catch (err) {
    console.error("Find users error:", err);
    res.status(500).json({ message: "Server error while fetching users" });
  }
};

module.exports = {
  findSeniors: findByRole("Senior"),
  findJuniors: findByRole("Junior"),
};
