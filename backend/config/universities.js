// Standardized list of university/college names used to populate the
// registration dropdown. This is the SAME list the frontend uses, so that
// "Govt Post Graduate College Mansehra" is always spelled and cased
// identically no matter who registers - this is what makes the
// university-based isolation work reliably (see User model: universityName
// is normalized + indexed, and every query filters on it).
//
// Users who don't find their institution in the list can choose "Other"
// and type it in manually (handled on the frontend); the raw text they type
// is then normalized the same way (trimmed + collapsed whitespace + title
// cased) before being saved, so near-duplicate typos still don't fully
// solve themselves - encourage users to pick from the list whenever possible.

const STANDARD_UNIVERSITIES = [
  "Govt Post Graduate College Mansehra",
  "University of Peshawar",
  "Quaid-i-Azam University",
  "Punjab University",
  "COMSATS University Islamabad",
  "National University of Sciences and Technology (NUST)",
  "University of the Punjab",
  "Lahore University of Management Sciences (LUMS)",
  "FAST National University (NUCES)",
  "University of Engineering and Technology (UET) Lahore",
  "University of Karachi",
  "Bahauddin Zakariya University",
  "Islamia College Peshawar",
  "Hazara University Mansehra",
  "Abdul Wali Khan University Mardan",
  "Other",
];

module.exports = { STANDARD_UNIVERSITIES };
