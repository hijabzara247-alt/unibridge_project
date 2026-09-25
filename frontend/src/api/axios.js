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
import Community from "./pages/Community";
import Profile from "./pages/Profile";

/*
  Layout for all pages that require login.

  The sidebar and top header are already inside Navbar.
  The left margin below gives the page content enough space
  so it does not go underneath the desktop sidebar.
*/
function ProtectedPage({ children }) {
  return (
    <PrivateRoute>
      <main className="lg:ml-[250px] min-h-[calc(100vh-72px)] bg-[#f7fbff] px-4 py-6 md:px-7">
        {children}
      </main>
    </PrivateRoute>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#f7fbff]">
          
          {/* Top header + sidebar */}
          <Navbar />

          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected pages */}
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
              path="/community"
              element={
                <ProtectedPage>
                  <Community />
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

            <Route
              path="/profile"
              element={
                <ProtectedPage>
                  <Profile />
                </ProtectedPage>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
