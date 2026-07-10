"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import AdminSidebar from "@/components/admin/AdminSidebar";

// Client-side auth guard for /admin/*. The login route is exempt (it lives
// under /admin too). Admin *data* is additionally protected server-side by
// Firestore rules / the Admin SDK in Part B.
export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLogin) router.replace("/admin/login");
  }, [loading, user, isLogin, router]);

  // Login page renders standalone — no shell, no guard.
  if (isLogin) return children;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--muted)",
        }}
      >
        Loading…
      </div>
    );
  }

  if (!user) return null; // redirecting to /admin/login

  return (
    <div className="admin">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
