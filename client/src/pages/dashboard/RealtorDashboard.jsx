import { useEffect, useState, useRef } from "react";
import axios from "axios";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Realtor&background=random&color=fff";

export default function RealtorDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(`${BASE_URL}/api/realtors/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!data?.referralCode) return;

      try {
        setReferralsLoading(true);
        const token = localStorage.getItem("token");
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;

        // Fetch all realtors and filter by current user's referral code
        const res = await axios.get(
          `${BASE_URL}/api/realtors/list?limit=100&search=${data.referralCode}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Filter to only include realtors recruited by this user
        const myReferrals = res.data.docs.filter(
          (realtor) => realtor.recruitedByCode === data.referralCode
        );

        setReferrals(myReferrals);
      } catch (err) {
        console.error("Failed to load referrals:", err);
      } finally {
        setReferralsLoading(false);
      }
    };

    fetchReferrals();
  }, [data?.referralCode]);

  if (loading) return <p>Loading Dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>No dashboard data found</p>;

  const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const onFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Not authenticated");
      return;
    }

    try {
      setUploading(true);
      const BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await axios.put(`${BASE_URL}/api/realtors/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newAvatar = res.data?.avatar;
      if (newAvatar) {
        setData((prev) => ({ ...prev, avatar: newAvatar }));

        const savedUserRaw = localStorage.getItem("user");
        if (savedUserRaw) {
          try {
            const savedUser = JSON.parse(savedUserRaw);
            savedUser.avatar = newAvatar;
            localStorage.setItem("user", JSON.stringify(savedUser));
          } catch (err) {
            // ignore parse errors
          }
        }
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload avatar. Try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerFile = () => {
    fileInputRef.current?.click();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full p-5 md:p-10 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-medium mb-6">
        Welcome,{" "}
        <span className="font-semibold text-black uppercase">{fullName}</span>
      </h1>

      <div className="cards grid grid-cols-1 md:grid-cols-4 pt-8 gap-5">
        {/* Avatar */}
        <div className="bg-[#d8e8e8] rounded-xl h-[250px] w-full overflow-hidden flex items-center justify-center relative">
          <img
            src={data.avatar || defaultAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />

          <div
            className="absolute top-2 right-2 bg-white/90 rounded-md px-2 py-1 text-xs cursor-pointer hover:opacity-90 flex items-center gap-2"
            onClick={triggerFile}
            title="Change profile image"
            role="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M4 13v3a1 1 0 001 1h3l9-9-4-4-9 9z" />
            </svg>
            <span>{uploading ? "Uploading..." : "Change"}</span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
            name="avatar"
          />
        </div>

        {/* Stats */}
        <Stat value={data.downlines || 0} label="Downlines" />
        <Stat value={data.recruitedBy || "Admin"} label="Recruited By" />

        {/* Referral Link Card */}
        <div
          className="bg-[#0f1f1f] text-white rounded-xl p-6 h-[250px] flex flex-col
          items-center justify-center cursor-pointer hover:bg-[#0b1515] transition relative"
          onClick={handleCopy}
        >
          <p className="text-sm text-center font-medium truncate w-full px-2">
            {data.referralLink || "Not Available"}
          </p>
          <p className="text-xs mt-2 opacity-90">Referral Link</p>

          {copied && (
            <span className="absolute bottom-3 bg-white text-black px-2 py-1 rounded text-xs font-semibold">
              ✅ Copied!
            </span>
          )}
        </div>
      </div>

      {/* Referrals Table */}
      <div className="mt-10">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          My Referrals ({referrals.length})
        </h2>

        {referralsLoading ? (
          <p className="text-gray-600">Loading referrals...</p>
        ) : referrals.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <p className="text-gray-600">
              You haven't referred any realtors yet. Share your referral link to
              start building your network!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0f1f1f] text-white">
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Referral Code
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Date Joined
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    Bank Details
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr
                    key={referral._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 text-sm">{referral.name}</td>
                    <td className="px-4 py-3 text-sm">{referral.email}</td>
                    <td className="px-4 py-3 text-sm">{referral.phone}</td>
                    <td className="px-4 py-3 text-sm font-mono">
                      {referral.referralCode}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(referral.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {referral.bank && referral.accountNumber ? (
                        <div className="text-xs">
                          <div className="font-medium">{referral.bank}</div>
                          <div className="text-gray-600">
                            {referral.accountNumber}
                          </div>
                          <div className="text-gray-500">
                            {referral.accountName}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-[#0f1f1f] text-white rounded-xl p-6 h-[250px] flex flex-col items-center justify-center">
      <p className="text-2xl font-bold text-center">{value}</p>
      <p className="text-sm mt-2 opacity-80 text-center">{label}</p>
    </div>
  );
}
