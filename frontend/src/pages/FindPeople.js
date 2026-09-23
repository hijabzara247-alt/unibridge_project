import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import UserCard from "../components/UserCard";

export default function FindPeople() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("Senior"); // "Senior" | "Junior"
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPeople = async () => {
      setLoading(true);
      setError("");
      try {
        // Endpoint is scoped server-side to the logged-in user's university.
        const endpoint = activeTab === "Senior" ? "/users/seniors" : "/users/juniors";
        const res = await api.get(endpoint);
        setPeople(res.data.users);
      } catch (err) {
        setError("Could not load people. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-xl font-bold text-gray-900">Find People</h1>
      <p className="text-sm text-gray-500 mb-6">
        Students at <span className="font-medium">{user?.universityName}</span>
      </p>

      <div className="inline-flex bg-gray-100 rounded-lg p-1 mb-6">
        {["Senior", "Junior"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab ? "bg-white text-brand-700 shadow-sm" : "text-gray-500"
            }`}
          >
            Find {tab}s
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {!loading && !error && people.length === 0 && (
        <div className="card text-center py-12">
          <p className="text-gray-500">No {activeTab.toLowerCase()}s found at your university yet.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {people.map((person) => (
          <UserCard key={person._id} person={person} />
        ))}
      </div>
    </div>
  );
}
