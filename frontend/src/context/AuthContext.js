import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

// Wraps the whole app (see App.js) and gives every component access to
// the logged-in user, plus login/register/logout helpers, via useAuth().
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, try to restore the session from a saved token.
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("unibridge_token");
      const savedUser = localStorage.getItem("unibridge_user");

      if (token && savedUser) {
        try {
          // Verify the token is still valid and get the freshest user data.
          const res = await api.get("/auth/me");
          setUser(res.data.user);
        } catch (err) {
          localStorage.removeItem("unibridge_token");
          localStorage.removeItem("unibridge_user");
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("unibridge_token", res.data.token);
    localStorage.setItem("unibridge_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (formData) => {
    const res = await api.post("/auth/register", formData);
    localStorage.setItem("unibridge_token", res.data.token);
    localStorage.setItem("unibridge_user", JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem("unibridge_token");
    localStorage.removeItem("unibridge_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
