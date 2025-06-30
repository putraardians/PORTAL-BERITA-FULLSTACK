import { useState } from "react";
import AdminHeader from "./AdminHeader";
import SidebarAdmin from "./SidebarAdmin";

export default function AdminLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <AdminHeader menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <SidebarAdmin menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="admin-content">{children}</main>
    </>
  );
}
