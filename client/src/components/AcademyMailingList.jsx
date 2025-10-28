// File: src/components/MailingListSignup.jsx
/**
 * MailingListSignup
 *
 * - Tailwind-ready. Uses CSS variable --color-primary-500 for brand color.
 * - Accessible: labels, aria-live status, focus management.
 * - Robust: validation, offline handling, request timeout, retry guidance, honeypot, noscript fallback.
 *
 * Usage:
 * <MailingListSignup endpoint="/api/subscribe" timeout={8000} />
 */

import React, { useEffect, useRef, useState } from "react";

/** Simple, reasonable email regex (not perfect, suitable for client validation) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Helper: normalize email for submission */
function normalizeEmail(value) {
  return (value || "").trim().toLowerCase();
}

/** Helper: sleep for small backoff when retrying UI (not used for request retries automatically) */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AcademyMailingList({
  endpoint = "/api/subscribe",
  method = "POST",
  timeout = 8000, // milliseconds
}) {
  // form state
  const [email, setEmail] = useState(() => {
    // restore any in-progress from sessionStorage
    try {
      return sessionStorage.getItem("mls:email") || "";
    } catch {
      return "";
    }
  });
  const [error, setError] = useState("");
  const [info, setInfo] = useState(""); // friendly information (e.g., success)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [retryable, setRetryable] = useState(false);

  // refs for accessibility focus management
  const statusRef = useRef(null);
  const inputRef = useRef(null);

  // detect existing subscription (simple localStorage marker to avoid duplicates)
  useEffect(() => {
    try {
      const val = localStorage.getItem("mls:subscribedEmail");
      if (val) setAlreadySubscribed(true);
    } catch {
      /* ignore storage errors */
    }
  }, []);

  // Persist in-progress email to sessionStorage so accidental nav won't lose it
  useEffect(() => {
    try {
      if (email) sessionStorage.setItem("mls:email", email);
      else sessionStorage.removeItem("mls:email");
    } catch {
      // ignore
    }
  }, [email]);

  // focus status when messages change (announce to screen readers)
  useEffect(() => {
    if ((error || info) && statusRef.current) {
      try {
        statusRef.current.focus();
      } catch {}
    }
  }, [error, info]);

  // client-side validation
  function validateEmail(value) {
    const v = normalizeEmail(value);
    if (!v) return "Please enter your email address.";
    if (!EMAIL_RE.test(v)) return "Please enter a valid email address.";
    if (v.length > 254) return "Email looks too long.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (isSubmitting) return;
    setError("");
    setInfo("");
    setRetryable(false);

    // Honeypot check: if hidden field (bot) has value, bail silently
    const form = e.currentTarget;
    const honeypot = form.elements?.hp?.value;
    if (honeypot) {
      // silently succeed to bot
      setInfo("Thanks!");
      return;
    }

    // network offline
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setError(
        "You're currently offline. Please check your connection and try again."
      );
      setRetryable(true);
      return;
    }

    // validate
    const vErr = validateEmail(email);
    if (vErr) {
      setError(vErr);
      setRetryable(false);
      // ensure input receives focus
      try {
        inputRef.current?.focus();
      } catch {}
      return;
    }

    const normalized = normalizeEmail(email);

    // prevent duplicate quick resubmits if local marker present
    try {
      const prev = localStorage.getItem("mls:subscribedEmail");
      if (prev && prev === normalized) {
        setInfo("You're already subscribed with this email.");
        setAlreadySubscribed(true);
        return;
      }
    } catch {
      // ignore storage issues
    }

    setIsSubmitting(true);

    // Build request body. Keep safe: send only necessary data.
    const bodyData = { email: normalized };

    // use AbortController to implement timeout & cancellation
    const controller = new AbortController();
    const signal = controller.signal;
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
        signal,
      });

      // handle various response outcomes
      if (res.status === 200 || res.status === 201) {
        setInfo("Thanks — we've added you to our mailing list!");
        setError("");
        setRetryable(false);
        // store subscription marker
        try {
          localStorage.setItem("mls:subscribedEmail", normalized);
        } catch {}
        // clear in-progress and input
        setEmail("");
        try {
          sessionStorage.removeItem("mls:email");
        } catch {}
        setAlreadySubscribed(true);
      } else if (res.status === 429) {
        // rate limited
        setError("Too many requests. Please wait a moment and try again.");
        setRetryable(true);
      } else if (res.status === 422 || res.status === 400) {
        // validation error returned from server
        let json = {};
        try {
          json = await res.json();
        } catch {}
        setError(json?.message || "Invalid email. Please check and try again.");
        setRetryable(false);
        // keep email in input for correction
      } else if (res.status >= 500) {
        setError("Server error. Please try again later.");
        setRetryable(true);
      } else {
        // fallback generic
        let text = "";
        try {
          text = await res.text();
        } catch {}
        setError(text || `Unexpected response (${res.status}).`);
        setRetryable(true);
      }
    } catch (err) {
      // fetch can throw on abort or network error
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
        setRetryable(true);
      } else {
        setError("Unable to connect. Please check your network and try again.");
        setRetryable(true);
      }
    } finally {
      clearTimeout(timer);
      setIsSubmitting(false);
      // ensure status region receives focus for screen readers
      try {
        statusRef.current?.focus();
      } catch {}
    }
  }

  return (
    <div className="w-full bg-black">
      <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20 flex flex-col items-center">
        {/* Visual layout: left text + inline form to right on wide screens */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-4 flex-col sm:flex-row"
          aria-describedby="mls-status"
        >
          <div className="flex-1 min-w-0">
            <label htmlFor="mls-email" className="sr-only">
              Email address
            </label>
            <div className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-200">
              Get notified of upcoming trainings
            </div>
          </div>

          <div className="flex-shrink-0 w-full sm:w-auto flex gap-0 items-stretch">
            {/* Input */}
            <div className="relative">
              <input
                id="mls-email"
                name="email"
                type="email"
                ref={inputRef}
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="example@gmail.com"
                aria-invalid={error ? "true" : "false"}
                aria-describedby={error ? "mls-error" : "mls-status"}
                autoComplete="email"
                required
                className="w-[320px] max-w-full px-4 py-3 border border-white/60 rounded-l-md bg-transparent placeholder-gray-400 text-white focus:outline-none focus:ring-0 focus:ring-[var(--color-primary-200)]"
                // keyboard submits form by default on Enter
              />

              {/* Honeypot field - hidden from users */}
              <input
                aria-hidden="true"
                tabIndex={-1}
                name="hp"
                type="text"
                style={{ display: "none" }}
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting || alreadySubscribed}
              className={`px-6 py-3 rounded-r-md font-semibold text-white focus:outline-none transition transform
              ${
                isSubmitting
                  ? "opacity-70 cursor-wait"
                  : "hover:-translate-y-0.5"
              }
              bg-[var(--color-primary-500)]
              shadow-[0_6px_18px_rgba(236,28,36,0.18)]
              focus:ring-4 focus:ring-[var(--color-primary-200)]
              `}
              style={{
                // dynamic glow using CSS variable (ensures brand color used)
                boxShadow: isSubmitting
                  ? "0 6px 18px rgba(0,0,0,0.1)"
                  : `0 8px 24px rgba(236,28,36,0.22), 0 0 30px rgba(236,28,36,0.06)`,
              }}
              aria-disabled={isSubmitting || alreadySubscribed}
            >
              {alreadySubscribed
                ? "You're on the list"
                : isSubmitting
                ? "Joining..."
                : "Join our mailing list"}
            </button>
          </div>
        </form>

        {/* Status / error area - announced to AT */}
        <div
          id="mls-status"
          role="status"
          aria-live="polite"
          tabIndex={-1}
          ref={statusRef}
          className="mt-3 min-h-[24px] text-sm"
        >
          {error ? (
            <p id="mls-error" className="text-red-300" aria-atomic="true">
              {error}{" "}
              {retryable ? (
                <span className="font-medium">You can try again.</span>
              ) : null}
            </p>
          ) : info ? (
            <p className="text-green-200" aria-atomic="true">
              {info}
            </p>
          ) : null}
        </div>

        {/* Non-JS fallback: basic form that posts to the endpoint */}
        <noscript>
          <form
            action={endpoint}
            method={method === "GET" ? "GET" : "POST"}
            className="mt-3"
          >
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              required
            />
            <button type="submit">Join</button>
          </form>
        </noscript>
      </div>
    </div>
  );
}
