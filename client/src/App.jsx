import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Home from "./pages/home/Home";
import Realtor from "./pages/realtors/Realtor";
import Developers from "./pages/developers/Developers";
import Academy from "./pages/academy/Academy";
import Blog from "./pages/blog/Blog";
import About from "./pages/about/About";
import Services from "./pages/services/Services";
import Signup from "./pages/signup/Signup";
import Login from "./pages/login/Login";
import TopNavigation from "./components/TopNavigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProctectedRoute";
import Dashboard from "./pages/dashboard";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminLogin from "./pages/admin/AdminLogin";

function AppWrapper() {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/dashboard");

  return (
    <>
      {!hideLayout && <TopNavigation />}
      <main className={!hideLayout ? "pt-16" : ""}>
        <Routes>
          {/* 🌍 Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/for-realtors" element={<Realtor />} />
          <Route path="/for-developers" element={<Developers />} />
          <Route path="/pcrg-training-academy" element={<Academy />} />
          <Route path="/blog-and-events" element={<Blog />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 🔒 Protected Dashboard Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        {!hideLayout && <Footer />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
