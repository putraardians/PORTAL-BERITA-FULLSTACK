import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import AdminHeader from "./components/AdminHeader";
import SidebarAdmin from "./components/SidebarAdmin";
import AdminRoute from "./components/AdminRoute";
import NotAuthorized from "./pages/NotAuthorized";

import AdminDashboard from "./pages/AdminDashboard";
import NewsList from "./pages/NewsAdmin";
import AddNews from "./pages/AddNews";
import EditNews from "./pages/EditNews";
import CommentSection from "./pages/CommentSection";

import UsersList from "./pages/UsersList";
import AddUser from "./pages/AddUser";
import EditUser from "./pages/EditUser";
import ProfileAdmin from "./pages/ProfileAdmin"; // ✅ dipisah dari users

import Analytics from "./pages/Analytics";

import "./styles/global.css";

function AdminApp() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="admin-container">
      <AdminHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <SidebarAdmin menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      <div className="admin-content">
        <Routes>
          {/* Dashboard */}
          <Route
            path=""
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />

          {/* Manage News */}
          <Route
            path="news/all"
            element={
              <AdminRoute>
                <NewsList />
              </AdminRoute>
            }
          />
          <Route
            path="news/add"
            element={
              <AdminRoute>
                <AddNews />
              </AdminRoute>
            }
          />
          <Route
            path="news/edit/:id"
            element={
              <AdminRoute>
                <EditNews />
              </AdminRoute>
            }
          />
          <Route
            path="news/comments"
            element={
              <AdminRoute>
                <CommentSection />
              </AdminRoute>
            }
          />

          {/* Manage Users */}
          <Route
            path="users/all"
            element={
              <AdminRoute>
                <UsersList />
              </AdminRoute>
            }
          />
          <Route
            path="users/add"
            element={
              <AdminRoute>
                <AddUser />
              </AdminRoute>
            }
          />
          <Route
            path="users/edit/:id"
            element={
              <AdminRoute>
                <EditUser />
              </AdminRoute>
            }
          />

          {/* Profile Admin (terpisah dari users) */}
          <Route
            path="profile"
            element={
              <AdminRoute>
                <ProfileAdmin />
              </AdminRoute>
            }
          />

          {/* Unauthorized page */}
          <Route path="/not-authorized" element={<NotAuthorized />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminApp;
