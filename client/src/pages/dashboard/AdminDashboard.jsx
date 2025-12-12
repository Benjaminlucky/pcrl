"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Users, Cake } from "lucide-react";
import useSWR from "swr";

// Capitalize helper
const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

// SWR fetcher
const fetcher = async (url, token) => {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to fetch");
  }

  return res.json();
};

export default function AdminDashboard() {
  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Pagination and filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");

  // Load Realtors
  const {
    data,
    error,
    mutate: reloadRealtors,
  } = useSWR(
    token
      ? `${API_URL}/api/realtors/list?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&sort=${sort}`
      : null,
    (url) => fetcher(url, token),
    { revalidateOnFocus: false }
  );

  // ✅ Load birthday notifications
  const { data: birthdayData, error: birthdayError } = useSWR(
    token ? `${API_URL}/api/admin/birthday-notifications` : null,
    (url) => fetcher(url, token),
    {
      revalidateOnFocus: false,
      refreshInterval: 300000, // Refresh every 5 minutes
    }
  );

  // ✅ DEBUG: Log the birthday data
  useEffect(() => {
    if (birthdayData) {
      console.log("✅ Birthday Data:", birthdayData);
      console.log("✅ Birthday Count:", birthdayData?.total);
    }
    if (birthdayError) {
      console.error("❌ Birthday Error:", birthdayError);
    }
  }, [birthdayData, birthdayError]);

  // ✅ Extract birthday info with proper fallbacks
  const birthdayCount = birthdayData?.total ?? 0;
  const birthdayList = birthdayData?.notifications ?? [];

  // Dashboard stats
  const total = data?.total || 0;
  const pages = data?.pages || 1;
  const realtors = data?.docs || [];
  const loading = !data && !error;

  // ✅ Enhanced stats with icons and types
  const stats = [
    {
      label: "Total Realtors",
      value: total,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      type: "default",
    },
    {
      label: "Upcoming Birthdays",
      value: birthdayCount,
      icon: Cake,
      color: "text-[#561010]",
      bgColor: "bg-red-50",
      type: "birthday",
      badge: birthdayCount > 0,
      badgeText: `${birthdayCount} ${
        birthdayCount === 1 ? "birthday" : "birthdays"
      }`,
    },
  ];

  // Helpers
  const goTo = (p) => {
    if (!data) return;
    if (p < 1 || p > pages || p === page) return;
    setPage(p);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    reloadRealtors();
  };

  const handleSortChange = (field) => {
    setSort((prev) => (prev === field ? `-${field}` : field));
    setPage(1);
  };

  return (
    <div className="space-y-6 mt-8">
      <h2 className="text-3xl font-bold text-gray-800">Admin Overview</h2>

      {/* Debug Info - REMOVE IN PRODUCTION
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-xs">
          <p className="font-bold mb-2">
            🐛 Debug Info (Remove in Production):
          </p>
          <p>
            Birthday Data:{" "}
            {birthdayData ? JSON.stringify(birthdayData) : "Not loaded"}
          </p>
          <p>Birthday Count: {birthdayCount}</p>
          <p>Birthday List Length: {birthdayList.length}</p>
          <p>Error: {birthdayError?.message || "None"}</p>
        </div>
      )} */}

      {/* ✅ ENHANCED Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-lg border border-gray-100   rounded-2xl hover:shadow-xl transition-shadow relative overflow-hidden">
              {/* Notification Badge */}
              {s.badge && s.value > 0 && (
                <div className="absolute top-4 right-4 ">
                  <div className="relative">
                    <Bell className="w-6 h-6 text-[#561010]" />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {s.value}
                    </span>
                  </div>
                </div>
              )}

              <CardContent className="p-6 min-h-[100px] flex flex-col items-center justify-center">
                {/* Icon */}
                <div
                  className={`${s.bgColor} w-16  rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <s.icon className={`w-8 h-8 ${s.color}`} />
                </div>

                {/* Value */}
                <p className={`text-4xl font-extrabold ${s.color} text-center`}>
                  {s.value}
                </p>

                {/* Label */}
                <p className="text-gray-600 mt-2 text-center font-medium">
                  {s.label}
                </p>

                {/* Badge Text for Birthday Card */}
                {s.type === "birthday" && s.value > 0 && (
                  <div className="mt-3 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#561010] text-white text-xs font-semibold rounded-full">
                      <Cake className="w-3 h-3" />
                      {s.badgeText} this week
                    </span>
                  </div>
                )}

                {/* Empty State for Birthday Card */}
                {s.type === "birthday" && s.value === 0 && (
                  <p className="mt-3 text-center text-xs text-gray-400">
                    No birthdays this week
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Birthday Countdown Section */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Upcoming Birthdays (Next 7 Days)
          </h3>
          {birthdayCount > 0 && (
            <span className="bg-[#561010] text-white text-xs font-bold px-3 py-1 rounded-full">
              {birthdayCount}
            </span>
          )}
        </div>

        {birthdayError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            Error loading birthdays: {birthdayError.message}
          </div>
        )}

        {birthdayList.length === 0 ? (
          <div className="text-center py-8">
            <Cake className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No upcoming birthdays in the next 7 days.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {birthdayList
              .sort((a, b) => a.daysBefore - b.daysBefore)
              .map((n, idx) => (
                <li
                  key={idx}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#561010] rounded-full flex items-center justify-center">
                      <Cake className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{n.message}</p>
                      <p className="text-gray-500 text-xs">
                        {n.firstName} {n.lastName}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      n.daysBefore === 0
                        ? "bg-green-100 text-green-700"
                        : "bg-[#561010] text-white"
                    }`}
                  >
                    {n.daysBefore === 0 ? "Today 🎉" : `${n.daysBefore}d`}
                  </span>
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by first name, last name, email, referral code"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch(e)}
          className="px-4 py-2 border rounded-md w-full sm:w-64"
        />

        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#561010] text-white rounded-md hover:bg-[#7a1a1a]"
          >
            Search
          </button>

          <select
            value={sort.replace("-", "")}
            onChange={(e) => handleSortChange(e.target.value)}
            className="px-4 py-2 border rounded-md"
          >
            <option value="createdAt">Created At</option>
            <option value="name">Name</option>
            <option value="referralCode">Referral Code</option>
            <option value="recruitedBy">Recruiter</option>
          </select>
        </div>
      </div>

      {/* Realtors table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Registered Realtors
          </h3>
          <div className="text-sm text-gray-500">
            {loading ? "Loading..." : `${total} total`}
          </div>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error.message}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  { label: "ID", key: "referralCode" },
                  { label: "Name", key: "name" },
                  { label: "Phone", key: "" },
                  { label: "Email", key: "" },
                  { label: "Recruiter", key: "recruitedBy" },
                  { label: "Created At", key: "createdAt" },
                ].map((col, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => col.key && handleSortChange(col.key)}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                    </td>
                  </tr>
                ))
              ) : realtors.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No realtors found.
                  </td>
                </tr>
              ) : (
                realtors.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 text-sm font-medium text-gray-700">
                      {r.referralCode || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {r.name
                        ? r.name
                            .split(" ")
                            .map((w) => capitalize(w))
                            .join(" ")
                        : "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {r.phone || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {r.email || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {r.recruitedByName || "-"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {page} of {pages} — {total} total
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page <= 1 || loading}
              className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Prev
            </button>

            <div className="hidden sm:flex items-center space-x-1">
              {Array.from({ length: Math.min(pages, 5) }).map((_, idx) => {
                const start = Math.max(1, Math.min(page - 2, pages - 4));
                const p = start + idx;
                return (
                  <button
                    key={p}
                    onClick={() => goTo(p)}
                    className={`px-3 py-1 rounded-md border ${
                      p === page
                        ? "bg-[#561010] text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
              {pages > 5 && <span className="px-2">…</span>}
            </div>

            <button
              onClick={() => goTo(page + 1)}
              disabled={page >= pages || loading}
              className="px-3 py-1 rounded-md border hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
