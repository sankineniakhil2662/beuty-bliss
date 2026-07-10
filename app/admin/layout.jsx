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
  const { user, loading, configured } = useAuth();
  const isLogin = pathname === "/admin/login";

  // Dev-only bypass: when Firebase Auth isn't configured (so login is
  // impossible anyway) AND we're not in a production build, let the admin
  // screens render without login. This self-disables the moment real Firebase
  // config is added (configured → true) and never applies in production.
  const devBypass =
    process.env.NODE_ENV !== "production" && !configured;

  useEffect(() => {
    if (devBypass) return;
    if (!loading && !user && !isLogin) router.replace("/admin/login");
  }, [devBypass, loading, user, isLogin, router]);

  // Login page renders standalone — no shell, no guard.
  if (isLogin) return children;

  if (devBypass) {
    return (
      <div className="admin">
        <AdminSidebar />
        <main className="admin-main">
          <div className="banner ok" style={{ fontSize: 12.5 }}>
            🛠 Dev preview — login bypassed (Firebase not configured). Screens
            show sample data.
          </div>
          {children}
        </main>
      </div>
    );
  }

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
