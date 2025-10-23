import { useEffect, useState } from "react";
import axios from "axios";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Realtor&background=random&color=fff";

export default function RealtorDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

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

  if (loading) return <p>Loading Dashboard...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p>No dashboard data found</p>;

  const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="w-full p-5 md:p-10 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-medium mb-6">
        Welcome, <span className="font-semibold text-black">{fullName}</span>
      </h1>

      <div className="cards grid grid-cols-1 md:grid-cols-4 pt-8 gap-5">
        {/* Avatar */}
        <div className="bg-[#d8e8e8] rounded-xl h-[160px] w-full overflow-hidden flex items-center justify-center">
          <img
            src={data.avatar || defaultAvatar}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Stats */}
        <Stat value={data.downlines || 0} label="Downlines" />
        <Stat value={data.recruitedBy || "Not Assigned"} label="Recruited By" />

        {/* ✅ Referral Link Card */}
        <div
          className="bg-[#0f1f1f] text-white rounded-xl p-6 h-[160px] flex flex-col
          items-center justify-center cursor-pointer hover:bg-[#0b1515] transition relative"
          onClick={handleCopy}
        >
          <p className="text-sm text-center font-medium truncate w-full px-2">
            {data.referralLink || "Not Available"}
          </p>
          <p className="text-xs mt-2 opacity-90">Referral Link</p>

          {/* ✅ Copy Feedback */}
          {copied && (
            <span className="absolute bottom-3 bg-white text-black px-2 py-1 rounded text-xs font-semibold">
              ✅ Copied!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="bg-[#0f1f1f] text-white rounded-xl p-6 h-[160px] flex flex-col items-center justify-center">
      <p className="text-2xl font-bold text-center">{value}</p>
      <p className="text-sm mt-2 opacity-80 text-center">{label}</p>
    </div>
  );
}
