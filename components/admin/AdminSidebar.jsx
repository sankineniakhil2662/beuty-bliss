"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Badge counts are hardcoded to match the mockup exactly for now (the mockup
// itself hardcodes these independent of any data too). They become live
// Firestore-derived counts in the Phase 4 "Live counts" milestone.
const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/bookings", label: "Bookings", icon: "📅", badge: 5 },
  { href: "/admin/reviews", label: "Reviews", icon: "⭐", badge: 3 },
  { href: "/admin/services", label: "Services", icon: "🧴" },
];

// Temporarily hidden from the sidebar per request. The Settings link/markup
// below is left fully intact — flip this back to `true` to restore it.
const SHOW_SETTINGS = false;

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <div className="a-brand">
        <img src="/logo.jpeg" alt="Beauty Bliss by Sruthi" />
        <b>
          Beauty Bliss
          <span>Admin</span>
        </b>
      </div>

      <nav className="admin-nav">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={pathname === item.href ? "active" : undefined}
          >
            <span className="ico">{item.icon}</span> {item.label}
            {item.badge ? <span className="badge">{item.badge}</span> : null}
          </Link>
        ))}
        {SHOW_SETTINGS && (
          <a>
            <span className="ico">⚙️</span> Settings
          </a>
        )}
      </nav>

      <div className="a-user">
        <div className="av">S</div>
        <div>
          <b>Sruthi</b>
          <span>Owner</span>
        </div>
      </div>
    </>
  );
}
