"use client";
import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ JSON objects for Nigerian states and banks
const states = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const banks = [
  "Access Bank",
  "Citibank",
  "Ecobank",
  "Fidelity Bank",
  "First Bank",
  "FCMB",
  "GTBank",
  "Heritage Bank",
  "Keystone Bank",
  "Polaris Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "Union Bank",
  "UBA",
  "Unity Bank",
  "Wema Bank",
  "Zenith Bank",
];

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    state: "",
    bank: "",
    accountName: "",
    accountNumber: "",
    phone: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Animation controls and in-view logic
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  // ✅ Input handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ✅ Validation logic
  const validateForm = () => {
    let newErrors = {};
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Valid email is required";
    if (!phoneRegex.test(formData.phone))
      newErrors.phone = "Enter a valid Nigerian phone number";
    if (!formData.state) newErrors.state = "Select your state";
    if (!formData.bank) newErrors.bank = "Select your bank";
    if (!formData.accountName.trim())
      newErrors.accountName = "Account name is required";
    if (!/^\d{10}$/.test(formData.accountNumber))
      newErrors.accountNumber = "Account number must be 10 digits";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.birthDate) newErrors.birthDate = "Date of birth is required";

    return newErrors;
  };

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setLoading(false);
      return;
    }

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        state: formData.state,
        bank: formData.bank,
        accountName: formData.accountName,
        accountNumber: formData.accountNumber,
        password: formData.password,
        birthDate: formData.birthDate,
      };

      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref");
      if (ref) payload.ref = ref;

      const res = await fetch(`${BASE_URL}/api/realtors/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Signup failed");

      setSuccess("Account created successfully!");
      console.log("✅ Created Realtor:", data);

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        state: "",
        bank: "",
        accountName: "",
        accountNumber: "",
        phone: "",
        password: "",
        confirmPassword: "",
        birthDate: "",
      });

      setTimeout(() => setSuccess(""), 4000);
    } catch (error) {
      console.error("Signup Error:", error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="py-24 flex items-center justify-center bg-gray-50 relative overflow-hidden"
    >
      {/* 🔴 Cinematic Red Sweep Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[rgba(255,0,0,0.1)] via-transparent to-transparent pointer-events-none z-0"
        initial={{ x: "-100%" }}
        animate={inView ? { x: ["-100%", "100%"] } : {}}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* 🌫️ Soft Background Zoom/Pan (Breathe Effect) */}
      <motion.div
        className="absolute inset-0 bg-gray-100"
        initial={{ scale: 1 }}
        animate={inView ? { scale: [1, 1.03, 1], x: [0, -15, 0] } : {}}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="bg-white rounded-2xl flex flex-col md:flex-row w-full max-w-11/12 overflow-hidden relative z-10">
        {/* LEFT SECTION */}
        <motion.div
          className="bg-red-900 text-white md:w-1/2 p-10 lg:p-24 flex flex-col justify-between"
          variants={{
            hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.8, ease: "easeOut" },
            },
          }}
          initial="hidden"
          animate={controls}
        >
          <div>
            <h2 className="text-3xl lg:text-6xl lg:leading-tight font-bold mb-4">
              Join PCRG and <br /> Unlock Endless Possibilities!
            </h2>
            <p className="text-sm lg:text-lg leading-relaxed text-gray-200">
              At PCRG, we see real estate as more than property—it's about
              vision, transformation, and lasting impact. Guided by Dr. Mrs.
              Vivian Okiche, we stand for innovation, integrity, and growth.
            </p>
            <p className="text-sm mt-4 text-gray-200">
              We empower investors with confidence and realtors with opportunity
              — together, we're shaping the future of real estate.
            </p>
          </div>
        </motion.div>

        {/* RIGHT SECTION (Animated Form) */}
        <motion.div
          className="md:w-1/2 p-10"
          variants={{
            hidden: { opacity: 0, x: 60, filter: "blur(10px)" },
            visible: {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
              transition: { duration: 1, delay: 0.4 },
            },
          }}
          initial="hidden"
          animate={controls}
        >
          <div className="mb-8 flex justify-between">
            <h2 className="text-4xl font-bold text-gray-900">
              Sign up to <span className="text-primary-700">PCRG</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm">
              Already a member?{" "}
              <a
                href="/login"
                className="text-primary-700 font-semibold hover:underline"
              >
                Log in here
              </a>
            </p>
          </div>

          {success && (
            <p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-sm">
              {success}
            </p>
          )}

          {errors.general && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm">
              {errors.general}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 py-8">
            {/* Names */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <input
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Birthday */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              {errors.birthDate && (
                <p className="text-xs text-red-500">{errors.birthDate}</p>
              )}
            </div>

            {/* State & Bank */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
                >
                  <option value="">Select State</option>
                  {states.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-xs text-red-500">{errors.state}</p>
                )}
              </div>

              <div>
                <select
                  name="bank"
                  value={formData.bank}
                  onChange={handleChange}
                  className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
                >
                  <option value="">Select Bank</option>
                  {banks.map((bk) => (
                    <option key={bk} value={bk}>
                      {bk}
                    </option>
                  ))}
                </select>
                {errors.bank && (
                  <p className="text-xs text-red-500">{errors.bank}</p>
                )}
              </div>
            </div>

            {/* Account Info */}
            <div>
              <input
                name="accountName"
                placeholder="Account Name"
                value={formData.accountName}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              {errors.accountName && (
                <p className="text-xs text-red-500">{errors.accountName}</p>
              )}
            </div>

            <div>
              <input
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              {errors.accountNumber && (
                <p className="text-xs text-red-500">{errors.accountNumber}</p>
              )}
            </div>

            {/* Password with Toggle */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 pr-12 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
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
                )}
              </button>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password with Toggle */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-400 rounded-sm p-3 pr-12 ring-0 outline-0 focus:ring-3 focus:ring-red-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
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
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2 text-sm">
              <input type="checkbox" required />
              <label>
                By signing up, you agree to our{" "}
                <a href="#" className="text-red-700 font-semibold">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-red-700 font-semibold">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center gap-2 py-3 rounded-md text-white transition ${
                loading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800 hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
              }`}
            >
              {loading && (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
}
