import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    universityName: "",
    customUniversity: "",
    department: "",
    role: "Junior",
    yearOfStudy: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Load the standardized dropdown list from the backend so it always
  // matches the same normalization the server uses.
  useEffect(() => {
    api
      .get("/meta/universities")
      .then((res) => setUniversities(res.data.universities))
      .catch(() => setUniversities(["Other"]));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalUniversityName =
      form.universityName === "Other" ? form.customUniversity.trim() : form.universityName;

    if (!finalUniversityName) {
      setError("Please select or enter your university/college name.");
      return;
    }

    setSubmitting(true);
    try {
      await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        universityName: finalUniversityName,
        department: form.department,
        role: form.role,
        yearOfStudy: form.yearOfStudy,
      });
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-brand-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Your university, Your seniors, Your guide.</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              required
              value={form.fullName}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Hijab Zara"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="input-field"
              placeholder="At least 6 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University / College Name
            </label>
            <select
              name="universityName"
              required
              value={form.universityName}
              onChange={handleChange}
              className="input-field"
            >
              <option value="" disabled>
                Select your institution
              </option>
              {universities.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          {form.universityName === "Other" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter your university/college name
              </label>
              <input
                type="text"
                name="customUniversity"
                required
                value={form.customUniversity}
                onChange={handleChange}
                className="input-field"
                placeholder="Type your institution's full name"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input
              type="text"
              name="department"
              required
              value={form.department}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g. Artificial Intelligence"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="input-field">
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
              <select
                name="yearOfStudy"
                required
                value={form.yearOfStudy}
                onChange={handleChange}
                className="input-field"
              >
                <option value="" disabled>
                  Select
                </option>
                {YEAR_OPTIONS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-600 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
