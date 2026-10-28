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
import { can, isStaff, staffHome } from "../../context/permissions";

// Staff screens — loaded only when opened.
const SiteContent = lazy(() => import("./site/SiteContent"));
const PageEditor = lazy(() => import("./site/PageEditor"));
const MenuEditor = lazy(() => import("./site/MenuEditor"));
const SettingsEditor = lazy(() => import("./site/SettingsEditor"));
const MediaLibrary = lazy(() => import("./site/MediaLibrary"));
const CollectionList = lazy(() => import("./site/CollectionList"));
const CollectionEditor = lazy(() => import("./site/CollectionEditor"));
const TeamPage = lazy(() => import("./team/TeamPage"));
const RolesPage = lazy(() => import("./team/RolesPage"));
const ActivityPage = lazy(() => import("./team/ActivityPage"));

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<RoleBasedDashboard />} />
        <Route path="/realtors" element={<Guard perm="realtors.view"><ManageRealtors /></Guard>} />
        <Route path="/mailing-list" element={<Guard perm="mailing.view"><MailingListSubscribers /></Guard>} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="recruits" element={<Recruits />} />
        <Route path="reports" element={<Reports />} />

        <Route path="site" element={<Guard perm="site.view"><SiteContent /></Guard>} />
        <Route path="site/page/:key" element={<Guard perm="site.view"><PageEditor /></Guard>} />
        <Route path="site/menu/:key" element={<Guard perm="site.view"><MenuEditor /></Guard>} />
        <Route path="site/settings" element={<Guard perm="site.view"><SettingsEditor /></Guard>} />
        <Route path="media" element={<Guard perm="media.upload"><MediaLibrary /></Guard>} />
        <Route path="blog" element={<Guard perm="blog.edit"><CollectionList key="blog" collection="blog" /></Guard>} />
        <Route path="blog/:id" element={<Guard perm="blog.edit"><CollectionEditor key="blog" collection="blog" /></Guard>} />
        <Route path="events" element={<Guard perm="events.edit"><CollectionList key="events" collection="events" /></Guard>} />
        <Route path="events/:id" element={<Guard perm="events.edit"><CollectionEditor key="events" collection="events" /></Guard>} />

        <Route path="team" element={<Guard perm="staff.view"><TeamPage /></Guard>} />
        <Route path="roles" element={<Guard perm={["staff.view", "roles.manage"]}><RolesPage /></Guard>} />
        <Route path="activity" element={<Guard perm="audit.view"><ActivityPage /></Guard>} />
      </Routes>
    </DashboardLayout>
  );
}

// Shows the page only to staff holding `perm` (or any of a list).
function Guard({ perm, children }) {
  const { user } = useAuth();
  const perms = Array.isArray(perm) ? perm : [perm];
  if (!isStaff(user) || !can(user, ...perms)) {
    return (
      <div className="pt-24 text-center text-gray-400">
        <p className="text-lg text-white mb-2">You don't have access to this page.</p>
        <p className="text-sm">Ask an administrator if you need it.</p>
      </div>
    );
  }
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
  const { user } = useAuth();
  if (!user) return null;
  if (!isStaff(user)) return <RealtorDashboard />;
  // The overview shows realtors + birthdays; others go to their first area.
  if (can(user, "realtors.view")) return <AdminDashboard />;
  const home = staffHome(user);
  if (home && home !== "/dashboard") return <Navigate to={home} replace />;
  return (
    <div className="pt-24 text-center text-gray-400">
      <p className="text-lg text-white mb-2">Your account doesn't have access to any areas yet.</p>
      <p className="text-sm">Ask an administrator to give your role some permissions.</p>
    </div>
  );
}
