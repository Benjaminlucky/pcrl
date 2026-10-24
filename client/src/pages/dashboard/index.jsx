import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Earnings from "./Earnings";
import Recruits from "./Recruits";
import Reports from "./Reports";
import DashboardLayout from "./Layout";
import RealtorDashboard from "./RealtorDashboard";
import AdminDashboard from "./AdminDashboard";
import ManageRealtors from "./ManageRealtors";
import MailingListSubscribers from "./MailingListSubscribers";
import { useAuth } from "../../context/AuthContext";
import { staffPermissions } from "./site/cmsApi";

// Website CMS screens — loaded only when a staff member opens them.
const SiteContent = lazy(() => import("./site/SiteContent"));
const PageEditor = lazy(() => import("./site/PageEditor"));
const MenuEditor = lazy(() => import("./site/MenuEditor"));
const SettingsEditor = lazy(() => import("./site/SettingsEditor"));
const MediaLibrary = lazy(() => import("./site/MediaLibrary"));
const CollectionList = lazy(() => import("./site/CollectionList"));
const CollectionEditor = lazy(() => import("./site/CollectionEditor"));

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<RoleBasedDashboard />} />
        <Route path="/realtors" element={<ManageRealtors />} />
        <Route path="/mailing-list" element={<MailingListSubscribers />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="recruits" element={<Recruits />} />
        <Route path="reports" element={<Reports />} />

        <Route path="site" element={<StaffOnly><SiteContent /></StaffOnly>} />
        <Route path="site/page/:key" element={<StaffOnly><PageEditor /></StaffOnly>} />
        <Route path="site/menu/:key" element={<StaffOnly><MenuEditor /></StaffOnly>} />
        <Route path="site/settings" element={<StaffOnly><SettingsEditor /></StaffOnly>} />
        <Route path="media" element={<StaffOnly><MediaLibrary /></StaffOnly>} />
        <Route path="blog" element={<StaffOnly><CollectionList key="blog" collection="blog" /></StaffOnly>} />
        <Route path="blog/:id" element={<StaffOnly><CollectionEditor key="blog" collection="blog" /></StaffOnly>} />
        <Route path="events" element={<StaffOnly><CollectionList key="events" collection="events" /></StaffOnly>} />
        <Route path="events/:id" element={<StaffOnly><CollectionEditor key="events" collection="events" /></StaffOnly>} />
      </Routes>
    </DashboardLayout>
  );
}

function StaffOnly({ children }) {
  const { user } = useAuth();
  if (!staffPermissions(user).isStaff) return <Navigate to="/dashboard" replace />;
  return (
    <Suspense
      fallback={
        <div className="py-24 flex justify-center">
          <div className="w-8 h-8 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

function RoleBasedDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return null;
  if (user.role === "admin") return <AdminDashboard />;
  // CMS editors/publishers have no realtor data — send them to the website editor.
  if (staffPermissions(user).isStaff) return <Navigate to="/dashboard/site" replace />;
  return <RealtorDashboard />;
}
