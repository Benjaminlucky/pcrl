"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const BookCallModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) setSubmitted(false);
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/enquiry/book-call`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      setSubmitted(true);
      toast.success("Call booked! We'll confirm shortly.");
      setForm({
        name: "",
        email: "",
        phone: "",
        preferredDate: "",
        preferredTime: "",
        notes: "",
      });
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.94, filter: "blur(12px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
    exit: {
      opacity: 0,
      y: 40,
      scale: 0.96,
      filter: "blur(8px)",
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  const fieldVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.15 + i * 0.08, duration: 0.45, ease: "easeOut" },
    }),
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1.5px solid #e5e7eb",
    background: "#ffffff",
    color: "#111827",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontSize: "10px",
    fontWeight: 700,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  };

  const onFocus = (e) => {
    e.target.style.borderColor = "#dc2626";
    e.target.style.boxShadow = "0 0 0 3px rgba(220,38,38,0.1)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "#e5e7eb";
    e.target.style.boxShadow = "none";
  };

  const successScreen = (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
      }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.25 } }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "56px 32px",
        textAlign: "center",
        background: "#f9fafb",
        borderRadius: "0 0 16px 16px",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{
          scale: 1,
          transition: {
            delay: 0.15,
            type: "spring",
            stiffness: 260,
            damping: 18,
          },
        }}
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #b91c1c, #ef4444)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          boxShadow: "0 8px 32px rgba(185,28,28,0.35)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <motion.path
            d="M5 13l4 4L19 7"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: 1,
              transition: { delay: 0.35, duration: 0.5, ease: "easeOut" },
            }}
          />
        </svg>
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.3, duration: 0.4 },
        }}
        style={{
          color: "#111827",
          fontSize: "22px",
          fontWeight: 700,
          margin: "0 0 8px",
        }}
      >
        Call Booked!
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.4, duration: 0.4 },
        }}
        style={{
          color: "#6b7280",
          fontSize: "14px",
          lineHeight: 1.6,
          maxWidth: "320px",
          margin: "0 0 32px",
        }}
      >
        Thanks! The PCRG team will confirm your strategy call within{" "}
        <strong style={{ color: "#111827" }}>24 hours</strong>.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { delay: 0.5, duration: 0.4 },
        }}
        onClick={onClose}
        whileHover={{ scale: 1.02, boxShadow: "0 0 24px rgba(220,38,38,0.4)" }}
        whileTap={{ scale: 0.98 }}
        style={{
          padding: "12px 32px",
          borderRadius: "8px",
          background: "#b91c1c",
          color: "#fff",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.04em",
          border: "none",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Close
      </motion.button>
    </motion.div>
  );

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99998,
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.4, ease: "easeInOut", delay: 0.1 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              pointerEvents: "none",
              background:
                "linear-gradient(90deg, transparent, rgba(220,38,38,0.18), transparent)",
            }}
          />

          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100000,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "520px",
                maxHeight: "90vh",
                overflowY: "auto",
                borderRadius: "16px",
                backgroundColor: "#f9fafb",
                boxShadow:
                  "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
                scrollbarWidth: "none",
              }}
            >
              {/* Header */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#0a0a0a",
                  padding: "24px 32px",
                  borderRadius: "16px 16px 0 0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0.08,
                    pointerEvents: "none",
                    backgroundImage:
                      "repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
                    backgroundSize: "12px 12px",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background:
                      "linear-gradient(90deg, transparent, #dc2626, transparent)",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        color: "#ef4444",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        margin: 0,
                      }}
                    >
                      Strategy Session
                    </p>
                    <h2
                      style={{
                        color: "#ffffff",
                        fontSize: "22px",
                        fontWeight: 700,
                        lineHeight: 1.3,
                        margin: "4px 0 0",
                      }}
                    >
                      {submitted ? "You're All Set" : "Book a Strategy Call"}
                    </h2>
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: "13px",
                        marginTop: "4px",
                        marginBottom: 0,
                      }}
                    >
                      {submitted
                        ? "Your call request has been sent."
                        : "Pick a time and we'll make it happen."}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    style={{
                      flexShrink: 0,
                      width: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "transparent",
                      color: "rgba(255,255,255,0.6)",
                      cursor: "pointer",
                      fontSize: "14px",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#fff";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                      e.currentTarget.style.borderColor =
                        "rgba(255,255,255,0.2)";
                    }}
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body */}
              <AnimatePresence mode="wait">
                {submitted ? (
                  successScreen
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    style={{ padding: "28px 32px 32px", background: "#f9fafb" }}
                  >
                    <form
                      onSubmit={handleSubmit}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {/* Name + Email */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "14px",
                        }}
                      >
                        {[
                          {
                            label: "Full Name",
                            name: "name",
                            type: "text",
                            placeholder: "e.g. Chidi Okafor",
                            required: true,
                          },
                          {
                            label: "Email Address",
                            name: "email",
                            type: "email",
                            placeholder: "you@company.com",
                            required: true,
                          },
                        ].map((field, i) => (
                          <motion.div
                            key={field.name}
                            custom={i}
                            variants={fieldVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <label htmlFor={field.name} style={labelStyle}>
                              {field.label}{" "}
                              {field.required && (
                                <span style={{ color: "#ef4444" }}>*</span>
                              )}
                            </label>
                            <input
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              required={field.required}
                              placeholder={field.placeholder}
                              value={form[field.name]}
                              onChange={handleChange}
                              style={inputStyle}
                              onFocus={onFocus}
                              onBlur={onBlur}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Phone */}
                      <motion.div
                        custom={2}
                        variants={fieldVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <label htmlFor="phone" style={labelStyle}>
                          Phone Number{" "}
                          <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          placeholder="+234 800 000 0000"
                          value={form.phone}
                          onChange={handleChange}
                          style={inputStyle}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </motion.div>

                      {/* Date + Time */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "14px",
                        }}
                      >
                        {[
                          {
                            label: "Preferred Date",
                            name: "preferredDate",
                            type: "date",
                          },
                          {
                            label: "Preferred Time",
                            name: "preferredTime",
                            type: "time",
                          },
                        ].map((field, i) => (
                          <motion.div
                            key={field.name}
                            custom={3 + i}
                            variants={fieldVariants}
                            initial="hidden"
                            animate="visible"
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <label htmlFor={field.name} style={labelStyle}>
                              {field.label}
                            </label>
                            <input
                              id={field.name}
                              name={field.name}
                              type={field.type}
                              value={form[field.name]}
                              onChange={handleChange}
                              style={inputStyle}
                              onFocus={onFocus}
                              onBlur={onBlur}
                            />
                          </motion.div>
                        ))}
                      </div>

                      {/* Notes */}
                      <motion.div
                        custom={5}
                        variants={fieldVariants}
                        initial="hidden"
                        animate="visible"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        <label htmlFor="notes" style={labelStyle}>
                          Additional Notes
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          placeholder="Any specifics you'd like to discuss on the call..."
                          value={form.notes}
                          onChange={handleChange}
                          style={{ ...inputStyle, resize: "none" }}
                          onFocus={onFocus}
                          onBlur={onBlur}
                        />
                      </motion.div>

                      {/* Submit */}
                      <motion.div
                        custom={6}
                        variants={fieldVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={
                            !loading
                              ? {
                                  scale: 1.02,
                                  boxShadow: "0 0 28px rgba(220,38,38,0.5)",
                                }
                              : {}
                          }
                          whileTap={!loading ? { scale: 0.98 } : {}}
                          transition={{
                            type: "spring",
                            stiffness: 280,
                            damping: 14,
                          }}
                          style={{
                            width: "100%",
                            padding: "13px",
                            borderRadius: "8px",
                            background: loading ? "#9ca3af" : "#b91c1c",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "15px",
                            letterSpacing: "0.04em",
                            border: "none",
                            cursor: loading ? "not-allowed" : "pointer",
                            fontFamily: "inherit",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "background 0.2s",
                          }}
                        >
                          {loading ? (
                            <>
                              <svg
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  animation: "spin 1s linear infinite",
                                }}
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  opacity="0.25"
                                />
                                <path
                                  fill="currentColor"
                                  opacity="0.75"
                                  d="M4 12a8 8 0 018-8v8z"
                                />
                              </svg>
                              Booking Call…
                            </>
                          ) : (
                            "Book My Call"
                          )}
                        </motion.button>
                        <p
                          style={{
                            textAlign: "center",
                            fontSize: "12px",
                            color: "#9ca3af",
                            marginTop: "10px",
                            marginBottom: 0,
                          }}
                        >
                          We'll confirm your slot within 24 hours.
                        </p>
                      </motion.div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default BookCallModal;
