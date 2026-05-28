import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function EyeIcon({ open }) {
  return open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export default function ResetPassword() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token") || "";
  const type = params.get("type") === "admin" ? "admin" : "realtor";
  const loginPath = type === "admin" ? "/admin/login" : "/login";

  // "checking" | "valid" | "invalid"
  const [tokenState, setTokenState] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Verify the token when the page loads so we can show a friendly state.
  useEffect(() => {
    let active = true;
    const verify = async () => {
      if (!token) {
        setTokenState("invalid");
        return;
      }
      try {
        const res = await fetch(
          `${BASE_URL}/api/auth/reset-password/verify?token=${encodeURIComponent(
            token,
          )}&type=${type}`,
        );
        const data = await res.json();
        if (active) setTokenState(data.valid ? "valid" : "invalid");
      } catch {
        if (active) setTokenState("invalid");
      }
    };
    verify();
    return () => {
      active = false;
    };
  }, [token, type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, type }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.code === "INVALID_TOKEN") setTokenState("invalid");
        setError(data.message || "Could not reset password.");
        setLoading(false);
        return;
      }

      setDone(true);
      setTimeout(() => {
        window.location.href = loginPath;
      }, 2500);
    } catch (err) {
      setError("We couldn't reach the server. Please try again.");
      setLoading(false);
    }
  };

  const shell = (children) => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(255,0,0,0.08)] via-transparent to-transparent pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.div>
    </div>
  );

  if (tokenState === "checking") {
    return shell(
      <div className="py-10 flex flex-col items-center gap-4">
        <span className="w-10 h-10 border-4 border-red-200 border-t-red-700 rounded-full animate-spin"></span>
        <p className="text-gray-500 text-sm">Checking your reset link…</p>
      </div>,
    );
  }

  if (tokenState === "invalid") {
    return shell(
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Link expired</h2>
        <div className="bg-red-100 text-red-700 p-4 rounded text-sm">
          This reset link is invalid or has expired. Reset links are valid for
          60 minutes and can only be used once.
        </div>
        <a
          href={
            type === "admin" ? "/admin/forgot-password" : "/forgot-password"
          }
          className="inline-block w-full text-center bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded-lg transition"
        >
          Request a new link
        </a>
        <a
          href={loginPath}
          className="block text-center text-red-700 font-semibold hover:underline text-sm"
        >
          ← Back to login
        </a>
      </div>,
    );
  }

  if (done) {
    return shell(
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Password reset ✅</h2>
        <p className="text-gray-600 text-sm">
          Your password has been updated. Redirecting you to login…
        </p>
        <a
          href={loginPath}
          className="inline-block text-red-700 font-semibold hover:underline text-sm"
        >
          Go to login now
        </a>
      </div>,
    );
  }

  // tokenState === "valid"
  return shell(
    <>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        Set a new password
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Choose a strong password you haven't used before.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</p>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New password
          </label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={show ? "Hide password" : "Show password"}
            >
              <EyeIcon open={show} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-red-400 cursor-not-allowed"
              : "bg-red-700 hover:bg-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
          }`}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </>,
  );
}
