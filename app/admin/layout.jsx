import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="admin">
      <aside className="admin-side">
        <AdminSidebar />
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
