import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  MessageCircle,
  Pencil,
  Users,
  UserRound,
  HelpCircle,
  User,
  ShieldCheck,
  Clock,
} from "lucide-react";

import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/RoleBadge";

function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function timeAgo(dateString) {
  if (!dateString) return "recently";

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(dateString)) / 1000)
  );

  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];

  for (const [label, size] of units) {
    const count = Math.floor(seconds / size);

    if (count >= 1) {
      return `${count} ${label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
}

function StatCard({ icon: Icon, value, label, href, iconBox, linkColor }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md transition">
      <div
        className={`h-11 w-11 rounded-xl flex items-center justify-center ${iconBox}`}
      >
        <Icon size={23} />
      </div>

      <div className="mt-4">
        <p className="text-3xl font-extrabold text-[#12345b]">{value}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
      </div>

      <Link
        to={href}
        className={`mt-5 inline-flex items-center gap-1 text-xs font-bold ${linkColor}`}
      >
        View {label === "Questions" ? "All" : label}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, description, className }) {
  return (
    <Link
      to={to}
      className={`rounded-2xl p-5 min-h-[145px] flex flex-col justify-center items-center text-center transition hover:-translate-y-1 hover:shadow-lg ${className}`}
    >
      <Icon size={32} />

      <h3 className="mt-3 font-extrabold text-base">{title}</h3>

      <p className="mt-2 text-xs leading-5 opacity-90 max-w-[170px]">
        {description}
      </p>
    </Link>
  );
}

function MiniMember({ person }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-blue-50 last:border-0">
      <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 text-white flex items-center justify-center text-xs font-extrabold">
        {initials(person.fullName)}
      </div>

      <div className="min-w-0">
        <p className="font-bold text-sm text-[#17395f] truncate">
          {person.fullName}
        </p>

        <p className="text-[11px] text-slate-500 truncate">
          {person.department || "Student"}{" "}
          {person.yearOfStudy ? `• ${person.yearOfStudy}` : ""}
        </p>
      </div>
    </div>
  );
}

function RecentQuestion({ question }) {
  const answers = question.answers?.length || 0;

  return (
    <Link
      to={`/questions/${question._id}`}
      className="block rounded-2xl border border-blue-100 bg-white p-4 hover:border-blue-200 hover:shadow-md transition"
    >
      <div className="flex gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <HelpCircle size={21} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-extrabold text-[#17395f] leading-snug">
              {question.title}
            </h3>

            <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
              {answers} {answers === 1 ? "Answer" : "Answers"}
            </span>
          </div>

          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {question.description}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-[9px] font-bold">
              {initials(question.askedByName)}
            </div>

            <b className="text-slate-700">{question.askedByName}</b>

            <RoleBadge role={question.askedByRole} />

            <span>•</span>

            <span className="flex items-center gap-1">
              <Clock size={12} />
              {timeAgo(question.createdAt)}
            </span>

            <span className="ml-auto flex items-center gap-1">
              <MessageCircle size={14} />
              {answers}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user, isVisitor } = useAuth();

  const [questions, setQuestions] = useState([]);
  const [seniors, setSeniors] = useState([]);
  const [juniors, setJuniors] = useState([]);

  const [memberTab, setMemberTab] = useState("Senior");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const [questionsRes, seniorsRes, juniorsRes] = await Promise.all([
          api.get("/questions"),
          api.get("/users/seniors"),
          api.get("/users/juniors"),
        ]);

        if (!mounted) return;

        setQuestions(questionsRes.data.questions || []);
        setSeniors(seniorsRes.data.users || []);
        setJuniors(juniorsRes.data.users || []);
      } catch (err) {
        console.error("Dashboard error:", err);

        if (mounted) {
          setError(
            err.response?.data?.message ||
              "Could not load dashboard data. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    if (user) {
      fetchDashboardData();
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  const members = useMemo(() => {
    return memberTab === "Senior" ? seniors : juniors;
  }, [memberTab, seniors, juniors]);

  const recentQuestions = questions.slice(0, 3);

  if (loading) {
    return (
      <div className="max-w-[1250px] mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1250px] mx-auto space-y-6">
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =========================
          WELCOME HERO
      ========================== */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#dcecff] via-[#e8f3ff] to-[#cfe5ff] border border-blue-100 min-h-[185px]">
        <div className="relative z-10 p-7 md:p-8 max-w-[650px]">
          <p className="text-2xl md:text-3xl font-extrabold text-[#12345b]">
            Welcome back, {user?.fullName?.split(" ")[0] || "Student"}! 👋
          </p>

          <p className="mt-2 text-base text-[#365779]">
            Your university, Your seniors, Your guide.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-white px-4 py-2 text-sm font-semibold text-blue-700">
              <Building2 size={17} />
              <span>{user?.universityName}</span>
            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
              {isVisitor ? "Visitor" : user?.role}
            </span>
          </div>
        </div>

        {/* Decorative student area */}
        <div className="absolute right-4 bottom-0 hidden md:flex items-end gap-2">
          <div className="h-28 w-20 rounded-t-[45%] bg-blue-500/20 flex items-center justify-center">
            <span className="text-5xl">👩🏻‍🎓</span>
          </div>

          <div className="h-36 w-24 rounded-t-[45%] bg-white/40 flex items-center justify-center">
            <span className="text-6xl">🧑🏻‍🎓</span>
          </div>

          <div className="h-32 w-20 rounded-t-[45%] bg-blue-500/15 flex items-center justify-center">
            <span className="text-5xl">👨🏻‍🎓</span>
          </div>
        </div>

        <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/30" />
        <div className="absolute right-48 bottom-5 h-10 w-10 rounded-full bg-white/50" />
      </section>

      {/* =========================
          STAT CARDS
      ========================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          value={seniors.length}
          label="Seniors"
          href="/find-people?role=Senior"
          iconBox="bg-blue-50 text-blue-600"
          linkColor="text-blue-600"
        />

        <StatCard
          icon={UserRound}
          value={juniors.length}
          label="Juniors"
          href="/find-people?role=Junior"
          iconBox="bg-teal-50 text-teal-600"
          linkColor="text-teal-600"
        />

        <StatCard
          icon={HelpCircle}
          value={questions.length}
          label="Questions"
          href="/community"
          iconBox="bg-purple-50 text-purple-600"
          linkColor="text-purple-600"
        />

        <StatCard
          icon={Building2}
          value="1"
          label="Universities"
          href="/find-people"
          iconBox="bg-orange-50 text-orange-500"
          linkColor="text-orange-500"
        />
      </section>

      {/* =========================
          MAIN + RIGHT SIDEBAR
      ========================== */}
      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_285px] gap-6">
        {/* MAIN COLUMN */}
        <div className="space-y-6">
          {/* QUICK ACTIONS */}
          <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#12345b]">
                  Quick Actions
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Quickly access the things you use most.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <QuickAction
                to="/ask"
                icon={Pencil}
                title="Ask a Question"
                description="Get help from seniors and peers"
                className="bg-blue-600 text-white"
              />

              <QuickAction
                to="/find-people?role=Senior"
                icon={Users}
                title="Find Seniors"
                description="Connect with seniors from your university"
                className="bg-teal-500 text-white"
              />

              <QuickAction
                to="/find-people?role=Junior"
                icon={UserRound}
                title="Find Juniors"
                description="Guide and support new students"
                className="bg-purple-600 text-white"
              />

              <QuickAction
                to="/profile"
                icon={User}
                title="Update Profile"
                description="Keep your information up to date"
                className="bg-blue-50 text-blue-800"
              />
            </div>
          </section>

          {/* RECENT QUESTIONS */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-lg font-extrabold text-[#12345b]">
                  Recent Questions
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Latest questions from your university.
                </p>
              </div>

              <Link
                to="/community"
                className="text-xs font-bold text-blue-600 flex items-center gap-1"
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            {recentQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-blue-200 bg-white p-10 text-center">
                <HelpCircle
                  size={35}
                  className="mx-auto text-blue-300"
                />

                <p className="mt-3 text-sm text-slate-500">
                  No questions yet at your university.
                </p>

                <Link
                  to="/ask"
                  className="mt-3 inline-block text-sm font-bold text-blue-600 hover:underline"
                >
                  Be the first to ask one
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentQuestions.map((question) => (
                  <RecentQuestion
                    key={question._id}
                    question={question}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-5">
          {/* UNIVERSITY INFORMATION */}
          <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Building2 size={20} className="text-blue-700" />

              <h2 className="font-extrabold text-[#12345b]">
                University Information
              </h2>
            </div>

            <div className="mt-4 h-28 rounded-xl bg-gradient-to-br from-blue-100 via-sky-100 to-blue-200 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <GraduationCap
                  size={52}
                  className="mx-auto text-blue-700"
                />
                <p className="text-[10px] font-bold text-blue-700 mt-1">
                  UNIVERSITY
                </p>
              </div>
            </div>

            <h3 className="mt-4 font-extrabold text-[#17395f] leading-snug">
              {user?.universityName}
            </h3>

            <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
              📍 Mansehra, KPK
            </p>
          </section>

          {/* QUICK STATS */}
          <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <h2 className="font-extrabold text-[#12345b]">
              Quick Stats
            </h2>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-3">
                <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Users size={20} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">
                    Total Seniors
                  </p>

                  <p className="font-extrabold text-[#12345b]">
                    {seniors.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-teal-50 p-3">
                <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                  <UserRound size={20} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">
                    Total Juniors
                  </p>

                  <p className="font-extrabold text-[#12345b]">
                    {juniors.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-purple-50 p-3">
                <div className="h-10 w-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <HelpCircle size={20} />
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">
                    Total Questions
                  </p>

                  <p className="font-extrabold text-[#12345b]">
                    {questions.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* LATEST MEMBERS */}
          <section className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-[#12345b]">
                Latest Members
              </h2>

              <Link
                to="/find-people"
                className="text-xs font-bold text-blue-600"
              >
                View All →
              </Link>
            </div>

            <div className="mt-4 flex rounded-full bg-blue-50 p-1 text-xs font-bold">
              <button
                onClick={() => setMemberTab("Senior")}
                className={`flex-1 rounded-full py-2 transition ${
                  memberTab === "Senior"
                    ? "bg-blue-600 text-white"
                    : "text-blue-700"
                }`}
              >
                Seniors
              </button>

              <button
                onClick={() => setMemberTab("Junior")}
                className={`flex-1 rounded-full py-2 transition ${
                  memberTab === "Junior"
                    ? "bg-blue-600 text-white"
                    : "text-blue-700"
                }`}
              >
                Juniors
              </button>
            </div>

            <div className="mt-2">
              {members.slice(0, 4).map((person) => (
                <MiniMember
                  key={person._id}
                  person={person}
                />
              ))}

              {members.length === 0 && (
                <p className="py-5 text-center text-xs text-slate-500">
                  No {memberTab.toLowerCase()}s yet.
                </p>
              )}
            </div>
          </section>

          {/* TOGETHER WE GROW */}
          <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="text-3xl">💡</div>

              <div>
                <h3 className="font-extrabold text-[#12345b]">
                  Together we grow!
                </h3>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Ask, share, guide and build a stronger university
                  community.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </section>

      {/* UNIVERSITY SECURITY MESSAGE */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pb-4">
        <ShieldCheck size={14} />
        <span>
          You are viewing content from{" "}
          <b className="text-slate-500">{user?.universityName}</b> only.
        </span>
      </div>
    </div>
  );
}
