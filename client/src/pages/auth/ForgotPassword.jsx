import React, { useState } from "react";
import { motion } from "framer-motion";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Reusable forgot-password page.
 * @param {"realtor"|"admin"} type - which account type this page is for.
 */
export default function ForgotPassword({ type = "realtor" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const loginPath = type === "admin" ? "/admin/login" : "/login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type }),
      });
      // The server always returns a generic 200 to prevent account enumeration.
      // We mirror that: show the same confirmation regardless.
      if (!res.ok && res.status >= 500) {
        throw new Error("Server error");
      }
      setSent(true);
    } catch (err) {
      setError(
        "We couldn't process that right now. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Forgot password{type === "admin" ? " (Admin)" : ""}?
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Enter the email linked to your account and we'll send you a link to
          reset your password.
        </p>

        {sent ? (
          <div className="space-y-4">
            <div className="bg-green-100 text-green-700 p-4 rounded text-sm">
              If an account exists for <strong>{email}</strong>, a password
              reset link is on its way. The link expires in 60 minutes.
            </div>
            <p className="text-sm text-gray-600">
              Didn't get it? Check your spam folder, or{" "}
              <button
                type="button"
                onClick={() => setSent(false)}
                className="text-red-700 font-semibold hover:underline"
              >
                try again
              </button>
              .
            </p>
            <a
              href={loginPath}
              className="inline-block text-red-700 font-semibold hover:underline text-sm"
            >
              ← Back to login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {error && (
              <p className="bg-red-100 text-red-700 p-3 rounded text-sm">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-lg text-white font-semibold transition ${
                loading || !email
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
              }`}
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Sending..." : "Send reset link"}
            </button>

            <a
              href={loginPath}
              className="block text-center text-red-700 font-semibold hover:underline text-sm"
            >
              ← Back to login
            </a>
          </form>
        )}
      </motion.div>
    </div>
  );
}
