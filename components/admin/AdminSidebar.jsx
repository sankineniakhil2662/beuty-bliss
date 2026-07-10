"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Badges are static (from the mockup) until wired to live counts in Part B.
const NAV = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/bookings", icon: "📅", label: "Bookings", badge: "5" },
  { href: "/admin/reviews", icon: "⭐", label: "Reviews", badge: "3" },
  { href: "/admin/services", icon: "🌸", label: "Services" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const initial = (user?.email?.[0] || "S").toUpperCase();
  const name = user?.email ? user.email.split("@")[0] : "Sruthi";

  return (
    <aside className="admin-side">
      <div className="a-brand">
        <img src="/logo.jpeg" alt="" className="logoSlot" style={{ height: 40 }} />
        <b>
          Beauty Bliss<span>Admin</span>
        </b>
      </div>

      <nav className="admin-nav">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : undefined}
            >
              <span className="ico">{item.icon}</span> {item.label}
              {item.badge && <span className="badge">{item.badge}</span>}
            </Link>
          );
        })}
        <a>
          <span className="ico">⚙️</span> Settings
        </a>
      </nav>

      <div className="a-user">
        <div className="av">{initial}</div>
        <div>
          <b>{name}</b>
          <span>Owner</span>
        </div>
        <a
          onClick={logout}
          style={{
            marginLeft: "auto",
            fontSize: 11,
            cursor: "pointer",
            color: "var(--gold-soft)",
          }}
        >
          Sign out
        </a>
      </div>
    </aside>
  );
}
