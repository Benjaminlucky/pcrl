"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // `verifying` = we have a token and are confirming it with the server.
  // Start true only if a token exists, so gated routes can wait for the check.
  const [verifying, setVerifying] = useState(
    () => !!localStorage.getItem("token"),
  );

  const logout = () => {
    const role = user?.role;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = role === "admin" ? "/admin/login" : "/login";
  };

  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setVerifying(false);
        return;
      }

      try {
        // FIX (Blocker 2): this endpoint now exists on the server and
        // actually verifies the JWT. The returned user is the source of truth.
        const res = await axios.get(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const verified = res.data.user;
        setUser(verified);
        localStorage.setItem("user", JSON.stringify(verified));
      } catch (err) {
        // Token invalid/expired — clear session silently (no redirect loop).
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setVerifying(false);
      }
    };

    verify();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, verifying }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
