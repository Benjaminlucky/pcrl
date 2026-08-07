import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { HeadProvider } from "react-head"; // ✅ SEO Provider
import TopNavigation from "./components/TopNavigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProctectedRoute";
import GlobalSEO from "./components/GlobalSeo";
import NotFound from "./components/NotFound";

// 🚀 Route-level code splitting — each page ships its own chunk instead of
// bloating the single initial bundle every visitor has to download.
const Home = lazy(() => import("./pages/home/Home"));
const Realtor = lazy(() => import("./pages/realtors/Realtor"));
const Developers = lazy(() => import("./pages/developers/Developers"));
const Academy = lazy(() => import("./pages/academy/Academy"));
const Blog = lazy(() => import("./pages/blog/Blog"));
const About = lazy(() => import("./pages/about/About"));
// import Services from "./pages/services/Services";
const Signup = lazy(() => import("./pages/signup/Signup"));
const Login = lazy(() => import("./pages/login/Login"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const AdminSignup = lazy(() => import("./pages/admin/AdminSignup"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));

function RouteLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );
}

function AppWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <>
      {/* ✅ Show navbar only if not on dashboard */}
      {!hideLayout && <TopNavigation />}

      {/* ✅ Main layout with overflow fix */}
      <main
        className={`${
          !hideLayout ? "" : ""
        } relative overflow-x-hidden bg-white`}
      >
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            {/* 🌍 Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/for-realtors" element={<Realtor />} />
            <Route path="/for-developers" element={<Developers />} />
            <Route path="/pcrg-training-academy" element={<Academy />} />
            <Route path="/blog-and-events" element={<Blog />} />
            <Route path="/about-us" element={<About />} />
            {/* <Route path="/services" element={<Services />} /> */}
            <Route path="/sign-up" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* 🔑 Password reset (public) */}
            <Route
              path="/forgot-password"
              element={<ForgotPassword type="realtor" />}
            />
            <Route
              path="/admin/forgot-password"
              element={<ForgotPassword type="admin" />}
            />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* 🔒 Protected Dashboard */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            {/* ❓ Fallback Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        {/* ✅ Show footer only on non-dashboard pages */}
        {!hideLayout && <Footer />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      {/* ✅ HeadProvider wraps the entire app for SEO meta support */}
      <HeadProvider>
        <GlobalSEO />
        <div className="relative overflow-x-hidden overflow-y-auto">
          <AppWrapper />
        </div>
      </HeadProvider>
    </Router>
  );
}
