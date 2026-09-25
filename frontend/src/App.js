import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindPeople from "./pages/FindPeople";
import AskQuestion from "./pages/AskQuestion";
import QuestionDetail from "./pages/QuestionDetail";

/*
  Layout for all pages that require login.

  Navbar renders a FIXED sidebar (250px wide, desktop only) and a FIXED
  top header (64px tall). Fixed elements are taken out of normal page
  flow, so without this wrapper the page content renders underneath
  them instead of next to/below them. This adds the matching
  left margin (sidebar) and top padding (header) on desktop.
*/
function ProtectedPage({ children }) {
  return (
    <PrivateRoute>
      <main className="pt-16 lg:ml-[250px] min-h-screen bg-[#f7fbff] px-4 py-6 md:px-7">
        {children}
      </main>
    </PrivateRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedPage>
                  <Dashboard />
                </ProtectedPage>
              }
            />
            <Route
              path="/find-people"
              element={
                <ProtectedPage>
                  <FindPeople />
                </ProtectedPage>
              }
            />
            <Route
              path="/ask"
              element={
                <ProtectedPage>
                  <AskQuestion />
                </ProtectedPage>
              }
            />
            <Route
              path="/questions/:id"
              element={
                <ProtectedPage>
                  <QuestionDetail />
                </ProtectedPage>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
