import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <TopNavigation />
      <main className="pt-16">
        {" "}
        {/* 👈 Pushes content below navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/for-realtors" element={<Realtor />} />
          <Route path="/for-developers" element={<Developers />} />
          <Route path="/pcrg-training-academy" element={<Academy />} />
          <Route path="/blog-and-events" element={<Blog />} />
          <Route path="/about-us" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/sign-up" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
        <Footer />
      </main>
    </Router>
  );
}

export default App;
