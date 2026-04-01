"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";

const EngageModal = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    projectDetails: "",
  });
  const [loading, setLoading] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
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
    setLoading(true);
    try {
      await axios.post("/api/enquiry/developer", form);
      toast.success("Enquiry sent! We'll be in touch shortly.");
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        projectDetails: "",
      });
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(msg);
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

  const fields = [
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
    {
      label: "Phone Number",
      name: "phone",
      type: "tel",
      placeholder: "+234 800 000 0000",
      required: true,
    },
    {
      label: "Company / Organization",
      name: "company",
      type: "text",
      placeholder: "Optional",
      required: false,
    },
  ];

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
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

          {/* Cinematic red sweep */}
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

          {/* Centering wrapper */}
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
            {/* Modal panel */}
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
                {/* Diagonal stripe accent */}
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
                {/* Red glow line */}
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
                        marginBottom: "4px",
                        margin: 0,
                      }}
                    >
                      Partnership Enquiry
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
                      Engage PCRG Today
                    </h2>
                    <p
                      style={{
                        color: "#9ca3af",
                        fontSize: "13px",
                        marginTop: "4px",
                        marginBottom: 0,
                      }}
                    >
                      Tell us about your project — we'll take it from there.
                    </p>
                  </div>

                  {/* Close button */}
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

              {/* Form body */}
              <div style={{ padding: "28px 32px 32px", background: "#f9fafb" }}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* 2-col grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "14px",
                    }}
                  >
                    {fields.map((field, i) => (
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
                        <label
                          htmlFor={field.name}
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                          }}
                        >
                          {field.label}
                          {field.required && (
                            <span
                              style={{ color: "#ef4444", marginLeft: "2px" }}
                            >
                              *
                            </span>
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
                          style={{
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
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#dc2626";
                            e.target.style.boxShadow =
                              "0 0 0 3px rgba(220,38,38,0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Project Details */}
                  <motion.div
                    custom={4}
                    variants={fieldVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label
                      htmlFor="projectDetails"
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                      }}
                    >
                      Project Details{" "}
                      <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <textarea
                      id="projectDetails"
                      name="projectDetails"
                      required
                      rows={4}
                      placeholder="Briefly describe your development project — location, type, number of units, current stage, etc."
                      value={form.projectDetails}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        border: "1.5px solid #e5e7eb",
                        background: "#ffffff",
                        color: "#111827",
                        fontSize: "14px",
                        outline: "none",
                        resize: "none",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#dc2626";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(220,38,38,0.1)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </motion.div>

                  {/* Submit */}
                  <motion.div
                    custom={5}
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
                          Sending Enquiry…
                        </>
                      ) : (
                        "Send Enquiry"
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
                      We typically respond within 24 hours.
                    </p>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  // Renders directly into document.body — escapes ALL CSS stacking contexts
  return createPortal(modalContent, document.body);
};

export default EngageModal;
