import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
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

  Navbar's sidebar is still `fixed` (250px wide, desktop only), so this
  wrapper needs the matching left margin. But the top Header is now
  `sticky`, not `fixed` — it's rendered here, inside this same wrapper,
  so it naturally sits in the flow above `children`. No pt-16 needed:
  the header just pushes the content below it, always in sync.
*/
function ProtectedPage({ children }) {
  return (
    <PrivateRoute>
      <div className="lg:ml-[250px] min-h-screen bg-[#f7fbff]">
        <Header />
        <main className="px-4 py-6 md:px-7">{children}</main>
      </div>
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
