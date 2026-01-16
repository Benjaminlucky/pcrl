import { useEffect, useState, useRef } from "react";
import axios from "axios";
// Added Landmark to the imports here
import {
  Copy,
  Check,
  Camera,
  Users,
  ShieldCheck,
  Zap,
  Globe,
  Loader2,
  Smartphone,
  Mail,
  Calendar,
  Landmark,
} from "lucide-react";

const defaultAvatar =
  "https://ui-avatars.com/api/?name=Realtor&background=ec1c24&color=fff";

export default function RealtorDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [referralsLoading, setReferralsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // --- Logic ---
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
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (!data?.id) return;
    const fetchReferrals = async () => {
      try {
        setReferralsLoading(true);
        const token = localStorage.getItem("token");
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        const res = await axios.get(
          `${BASE_URL}/api/realtors/list?limit=100&recruitedBy=${data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReferrals(res.data.docs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setReferralsLoading(false);
      }
    };
    fetchReferrals();
  }, [data?.id]);

  const handleCopy = () => {
    if (!data?.referralLink) return;
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const token = localStorage.getItem("token");
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
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        savedUser.avatar = newAvatar;
        localStorage.setItem("user", JSON.stringify(savedUser));
      }
    } catch (err) {
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-primary-500/30">
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-primary-900/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-10">
        {/* Profile Header */}
        <section className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-white/10 group-hover:border-primary-500 transition-all duration-500 p-1 bg-black-800">
                <img
                  src={data.avatar || defaultAvatar}
                  className="w-full h-full object-cover rounded-[1.8rem]"
                  alt="Profile"
                />
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute -bottom-1 -right-1 bg-primary-500 p-2.5 rounded-2xl hover:scale-110 active:scale-95 transition-all shadow-xl"
              >
                {uploading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Camera size={16} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={onFileSelect}
              />
            </div>

            <div className="text-center md:text-left">
              <span className="px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-[10px] font-black uppercase tracking-widest">
                Realtor Profile
              </span>
              <h1 className="text-4xl md:text-5xl font-black mt-2 tracking-tight">
                {data.firstName}{" "}
                <span className="text-primary-500">{data.lastName}</span>
              </h1>
              <p className="text-black-400 font-mono text-sm mt-1">
                ID: {data.referralCode || "---"}
              </p>
            </div>
          </div>

          {/* Referral Link */}
          <div className="w-full lg:w-80 bg-white/[0.03] backdrop-blur-md border border-white/5 p-4 rounded-3xl">
            <p className="text-[10px] font-black text-black-500 uppercase tracking-widest mb-2">
              Invite Link
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-black-900/50 px-3 py-2.5 rounded-xl border border-white/5 text-xs text-black-300 truncate font-mono">
                {data.referralLink || "Link not found"}
              </div>
              <button
                onClick={handleCopy}
                className={`p-3 rounded-xl transition-all ${
                  copied ? "bg-green-500" : "bg-primary-500"
                }`}
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatBox
            label="Total Downlines"
            value={data.downlines || 0}
            icon={<Users className="text-primary-500" />}
          />
          <StatBox
            label="Direct Upline"
            value={data.recruitedBy || "Admin"}
            icon={<ShieldCheck className="text-primary-500" />}
          />
        </section>

        {/* Table Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Team Network{" "}
            <span className="text-sm font-black text-black-500">
              ({referrals.length})
            </span>
          </h2>

          <div className="bg-white/[0.02] backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden">
            {referralsLoading ? (
              <div className="py-20 flex justify-center">
                <Loader2 className="animate-spin text-primary-500" size={32} />
              </div>
            ) : referrals.length === 0 ? (
              <div className="py-20 text-center text-black-500">
                No referrals found in your network.
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 bg-white/[0.01]">
                        <th className="px-6 py-4 text-[10px] font-black text-black-500 uppercase">
                          Partner
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-black-500 uppercase">
                          Contact
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-black-500 uppercase">
                          Ref Code
                        </th>
                        <th className="px-6 py-4 text-[10px] font-black text-black-500 uppercase">
                          Bank Account
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {referrals.map((ref) => (
                        <tr
                          key={ref._id}
                          className="hover:bg-white/[0.01] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <p className="font-bold text-white">{ref.name}</p>
                            <p className="text-[10px] text-black-500 mt-1 flex items-center gap-1">
                              <Calendar size={10} /> Joined{" "}
                              {formatDate(ref.createdAt)}
                            </p>
                          </td>
                          <td className="px-6 py-4 space-y-1">
                            <p className="flex items-center gap-2 text-black-300">
                              <Mail size={12} className="text-primary-500" />{" "}
                              {ref.email}
                            </p>
                            <p className="flex items-center gap-2 text-black-300">
                              <Smartphone
                                size={12}
                                className="text-primary-500"
                              />{" "}
                              {ref.phone}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-[11px] bg-black-900 border border-white/10 px-2 py-1 rounded text-primary-400">
                              {ref.referralCode}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {ref.bank ? (
                              <div className="text-xs">
                                <p className="font-bold text-white flex items-center gap-1">
                                  <Landmark
                                    size={12}
                                    className="text-primary-500"
                                  />{" "}
                                  {ref.bank}
                                </p>
                                <p className="text-black-400 font-mono mt-1">
                                  {ref.accountNumber}
                                </p>
                              </div>
                            ) : (
                              <span className="text-black-600 italic">
                                None
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-white/5">
                  {referrals.map((ref) => (
                    <div key={ref._id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-lg">{ref.name}</p>
                          <p className="text-[10px] text-black-500 uppercase tracking-tighter">
                            Joined {formatDate(ref.createdAt)}
                          </p>
                        </div>
                        <span className="font-mono text-xs text-primary-400">
                          {ref.referralCode}
                        </span>
                      </div>
                      <div className="space-y-1 text-sm text-black-300">
                        <p className="flex items-center gap-2">
                          <Mail size={14} className="text-primary-500" />{" "}
                          {ref.email}
                        </p>
                        <p className="flex items-center gap-2">
                          <Smartphone size={14} className="text-primary-500" />{" "}
                          {ref.phone}
                        </p>
                      </div>
                      {ref.bank && (
                        <div className="bg-black-900/50 p-3 rounded-xl border border-white/5">
                          <p className="text-[10px] font-black text-black-500 uppercase mb-1">
                            Payment Info
                          </p>
                          <p className="text-xs font-bold">{ref.bank}</p>
                          <p className="text-xs font-mono text-black-400">
                            {ref.accountNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function StatBox({ label, value, icon }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex items-center gap-5">
      <div className="w-14 h-14 rounded-2xl bg-black-900 border border-white/5 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-3xl font-black tracking-tight">{value}</h3>
        <p className="text-xs font-bold text-black-400 uppercase tracking-widest">
          {label}
        </p>
      </div>
    </div>
  );
}
