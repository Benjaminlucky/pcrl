"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Trash2,
  Download,
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url, token) =>
  fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then(async (res) => {
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to fetch");
    }
    return res.json();
  });

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function MailingListSubscribers() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);

  const { data, error, mutate } = useSWR(
    token
      ? `${API_URL}/api/mailing-list/subscribers?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      : null,
    (url) => fetcher(url, token),
    { revalidateOnFocus: false },
  );

  const loading = !data && !error;
  const subscribers = data?.docs || [];
  const total = data?.total || 0;
  const pages = data?.pages || 1;

  const goTo = (p) => {
    if (p < 1 || p > pages || p === page) return;
    setPage(p);
  };

  const handleSearch = () => {
    setPage(1);
    mutate();
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${API_URL}/api/mailing-list/subscribers/${deleteModal._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Failed to delete");
      setDeleteModal(null);
      mutate();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleExportEmails = () => {
    const emails = subscribers.map((s) => s.email).join(", ");
    navigator.clipboard.writeText(emails);
    alert("Emails copied to clipboard!");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

        .mls-root {
          font-family: 'DM Sans', sans-serif;
          background: #0c0c0e;
          min-height: 100vh;
          padding: 2.5rem 2rem 4rem;
          color: #e8e6e1;
        }

        .mls-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: clamp(1.75rem, 3vw, 2.4rem);
          letter-spacing: -0.02em;
          color: #f5f3ef;
        }

        .mls-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6b6869;
        }

        /* Stat card */
        .stat-card {
          background: linear-gradient(135deg, #161618 0%, #111113 100%);
          border: 1px solid #242426;
          border-radius: 20px;
          padding: 2rem 2.2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          position: relative;
          overflow: hidden;
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220,38,38,0.5), transparent);
        }
        .stat-icon {
          width: 56px; height: 56px;
          border-radius: 14px;
          background: rgba(220,38,38,0.12);
          border: 1px solid rgba(220,38,38,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .stat-value {
          font-family: 'Syne', sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          color: #f5f3ef;
          line-height: 1;
        }
        .stat-sublabel {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #6b6869;
          margin-top: 4px;
        }

        /* Search bar */
        .search-wrap {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .search-input-wrap {
          position: relative;
          flex: 1;
          max-width: 420px;
        }
        .search-input-wrap svg {
          position: absolute;
          left: 14px; top: 50%;
          transform: translateY(-50%);
          color: #4a4849;
          pointer-events: none;
        }
        .search-input {
          width: 100%;
          background: #111113;
          border: 1px solid #242426;
          border-radius: 10px;
          padding: 0.65rem 1rem 0.65rem 2.75rem;
          color: #e8e6e1;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input::placeholder { color: #4a4849; }
        .search-input:focus {
          border-color: rgba(220,38,38,0.5);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
        }

        /* Buttons */
        .btn-primary {
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex; align-items: center; gap: 0.5rem;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-primary:hover { background: #b91c1c; transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0); }

        .btn-ghost {
          background: #161618;
          color: #e8e6e1;
          border: 1px solid #242426;
          border-radius: 10px;
          padding: 0.65rem 1.25rem;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          display: flex; align-items: center; gap: 0.5rem;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
          white-space: nowrap;
        }
        .btn-ghost:hover { border-color: #3a3839; background: #1c1c1e; transform: translateY(-1px); }
        .btn-ghost:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

        /* Table panel */
        .table-panel {
          background: #111113;
          border: 1px solid #1e1e20;
          border-radius: 20px;
          overflow: hidden;
        }
        .table-panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.4rem 1.75rem;
          border-bottom: 1px solid #1e1e20;
        }
        .table-panel-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: #f5f3ef;
        }
        .badge {
          font-family: 'DM Mono', monospace;
          font-size: 0.68rem;
          background: rgba(220,38,38,0.12);
          color: #dc2626;
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 20px;
          padding: 3px 10px;
          letter-spacing: 0.06em;
        }

        /* Table */
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: #0c0c0e; }
        thead th {
          padding: 0.85rem 1.25rem;
          text-align: left;
          font-family: 'DM Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #4a4849;
          font-weight: 400;
          border-bottom: 1px solid #1e1e20;
        }
        tbody tr {
          border-bottom: 1px solid #161618;
          transition: background 0.15s;
        }
        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: #161618; }
        tbody td {
          padding: 1rem 1.25rem;
          font-size: 0.875rem;
          color: #c8c6c2;
          vertical-align: middle;
        }
        .td-index {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #4a4849;
        }
        .td-email {
          font-family: 'DM Mono', monospace;
          font-size: 0.82rem;
          color: #e8e6e1;
        }
        .td-date { font-size: 0.82rem; color: #6b6869; }

        .status-pill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.06em;
          font-weight: 500;
        }
        .status-pill.active {
          background: rgba(16,185,129,0.1);
          color: #10b981;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .status-pill.inactive {
          background: rgba(107,104,105,0.1);
          color: #6b6869;
          border: 1px solid rgba(107,104,105,0.15);
        }
        .status-dot {
          width: 5px; height: 5px; border-radius: 50%;
        }
        .status-dot.active { background: #10b981; }
        .status-dot.inactive { background: #4a4849; }

        .delete-btn {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid transparent;
          color: #4a4849;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .delete-btn:hover {
          background: rgba(220,38,38,0.1);
          border-color: rgba(220,38,38,0.2);
          color: #dc2626;
        }

        /* Skeleton rows */
        .skeleton-line {
          height: 14px;
          border-radius: 4px;
          background: linear-gradient(90deg, #1a1a1c 25%, #212123 50%, #1a1a1c 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Pagination */
        .pagination-wrap {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 1.75rem;
          border-top: 1px solid #1e1e20;
        }
        .pagination-info {
          font-family: 'DM Mono', monospace;
          font-size: 0.7rem;
          color: #4a4849;
          letter-spacing: 0.05em;
        }
        .pagination-btns { display: flex; gap: 0.5rem; }
        .page-btn {
          width: 34px; height: 34px;
          border-radius: 8px;
          background: #161618;
          border: 1px solid #242426;
          color: #c8c6c2;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .page-btn:hover:not(:disabled) { border-color: #dc2626; color: #dc2626; }
        .page-btn:disabled { opacity: 0.3; cursor: not-allowed; }

        /* Error banner */
        .error-banner {
          background: rgba(220,38,38,0.08);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 10px;
          padding: 0.75rem 1rem;
          display: flex; align-items: center; gap: 0.6rem;
          color: #f87171;
          font-size: 0.85rem;
          margin: 0 1.75rem 1rem;
        }

        /* Modal */
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 999;
          padding: 1rem;
        }
        .modal-box {
          background: #111113;
          border: 1px solid #242426;
          border-radius: 24px;
          max-width: 420px;
          width: 100%;
          padding: 2.25rem;
          position: relative;
        }
        .modal-box::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(220,38,38,0.4), transparent);
          border-radius: 24px 24px 0 0;
        }
        .modal-icon {
          width: 54px; height: 54px;
          background: rgba(220,38,38,0.1);
          border: 1px solid rgba(220,38,38,0.2);
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
        }
        .modal-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: #f5f3ef;
          text-align: center;
          margin-bottom: 0.6rem;
        }
        .modal-body {
          text-align: center;
          color: #6b6869;
          font-size: 0.875rem;
          line-height: 1.6;
          margin-bottom: 1.75rem;
        }
        .modal-email {
          color: #dc2626;
          font-family: 'DM Mono', monospace;
          font-size: 0.82rem;
        }
        .modal-actions { display: flex; gap: 0.75rem; }
        .btn-cancel {
          flex: 1;
          padding: 0.7rem;
          border-radius: 10px;
          background: transparent;
          border: 1px solid #242426;
          color: #c8c6c2;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-cancel:hover { border-color: #3a3839; background: #161618; }
        .btn-danger {
          flex: 1;
          padding: 0.7rem;
          border-radius: 10px;
          background: #dc2626;
          border: none;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-danger:hover { background: #b91c1c; }

        @media (max-width: 640px) {
          .mls-root { padding: 1.5rem 1rem 3rem; }
          .top-bar { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .search-wrap { flex-direction: column; align-items: stretch; }
          .search-input-wrap { max-width: 100%; }
        }
      `}</style>

      <div className="mls-root">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}
        >
          {/* ── Top Bar ── */}
          <motion.div
            variants={fadeUp}
            className="top-bar"
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <p className="mls-label" style={{ marginBottom: "0.35rem" }}>
                Admin Panel
              </p>
              <h1 className="mls-heading">Mailing List</h1>
            </div>
            <button className="btn-primary" onClick={handleExportEmails}>
              <Download size={15} />
              Export Emails
            </button>
          </motion.div>

          {/* ── Stat Card ── */}
          <motion.div variants={fadeUp}>
            <div className="stat-card" style={{ maxWidth: 340 }}>
              <div className="stat-icon">
                <Users size={22} color="#dc2626" />
              </div>
              <div>
                <div className="stat-value">
                  {loading ? "—" : total.toLocaleString()}
                </div>
                <div className="stat-sublabel">Total Subscribers</div>
              </div>
              {/* decorative mail icon */}
              <Mail
                size={80}
                style={{
                  position: "absolute",
                  right: "1.5rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(220,38,38,0.05)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </motion.div>

          {/* ── Search ── */}
          <motion.div variants={fadeUp} className="search-wrap">
            <div className="search-input-wrap">
              <Search size={15} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by email address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button className="btn-ghost" onClick={handleSearch}>
              Search
            </button>
          </motion.div>

          {/* ── Table Panel ── */}
          <motion.div variants={fadeUp} className="table-panel">
            <div className="table-panel-header">
              <span className="table-panel-title">Subscribers</span>
              {!loading && (
                <span className="badge">{total.toLocaleString()} total</span>
              )}
            </div>

            {error && (
              <div className="error-banner">
                <AlertTriangle size={15} />
                {error.message}
              </div>
            )}

            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 48 }}>#</th>
                    <th>Email Address</th>
                    <th>Subscribed</th>
                    <th>Status</th>
                    <th style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 7 }).map((_, i) => (
                      <tr key={i}>
                        <td>
                          <div
                            className="skeleton-line"
                            style={{ width: 24 }}
                          />
                        </td>
                        <td>
                          <div
                            className="skeleton-line"
                            style={{ width: `${160 + (i % 3) * 40}px` }}
                          />
                        </td>
                        <td>
                          <div
                            className="skeleton-line"
                            style={{ width: 80 }}
                          />
                        </td>
                        <td>
                          <div
                            className="skeleton-line"
                            style={{ width: 60 }}
                          />
                        </td>
                        <td>
                          <div
                            className="skeleton-line"
                            style={{ width: 28 }}
                          />
                        </td>
                      </tr>
                    ))
                  ) : subscribers.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          padding: "3.5rem 1rem",
                          color: "#4a4849",
                        }}
                      >
                        <Mail
                          size={32}
                          style={{
                            margin: "0 auto 0.75rem",
                            display: "block",
                            opacity: 0.3,
                          }}
                        />
                        <span
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: "0.78rem",
                            letterSpacing: "0.08em",
                          }}
                        >
                          NO SUBSCRIBERS FOUND
                        </span>
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((s, idx) => (
                      <motion.tr
                        key={s._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                      >
                        <td className="td-index">
                          {(page - 1) * limit + idx + 1}
                        </td>
                        <td className="td-email">{s.email}</td>
                        <td className="td-date">
                          {s.createdAt
                            ? new Date(s.createdAt).toLocaleDateString(
                                "en-NG",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                        <td>
                          <span
                            className={`status-pill ${s.isActive ? "active" : "inactive"}`}
                          >
                            <span
                              className={`status-dot ${s.isActive ? "active" : "inactive"}`}
                            />
                            {s.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() => setDeleteModal(s)}
                            title="Remove subscriber"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-wrap">
              <span className="pagination-info">
                PAGE {page} / {pages} &nbsp;·&nbsp; {total.toLocaleString()}{" "}
                ENTRIES
              </span>
              <div className="pagination-btns">
                <button
                  className="page-btn"
                  onClick={() => goTo(page - 1)}
                  disabled={page <= 1 || loading}
                  title="Previous"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  className="page-btn"
                  onClick={() => goTo(page + 1)}
                  disabled={page >= pages || loading}
                  title="Next"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Delete Modal ── */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDeleteModal(null)}
          >
            <motion.div
              className="modal-box"
              initial={{ scale: 0.92, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 16 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-icon">
                <Trash2 size={22} color="#dc2626" />
              </div>
              <p className="modal-title">Remove Subscriber?</p>
              <p className="modal-body">
                You're about to permanently remove{" "}
                <span className="modal-email">{deleteModal.email}</span> from
                the mailing list. This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setDeleteModal(null)}
                >
                  Cancel
                </button>
                <button className="btn-danger" onClick={handleDelete}>
                  Remove
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
