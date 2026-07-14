"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Calendar, Flower2, Images, LayoutDashboard, Settings, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdminCounts } from "@/hooks/useAdminCounts";

// `count` names which live figure the badge shows: bookings still "requested"
// and reviews still "pending" — i.e. the things waiting on Sruthi.
const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/bookings", icon: Calendar, label: "Bookings", count: "bookings" },
  { href: "/admin/reviews", icon: Star, label: "Reviews", count: "reviews" },
  { href: "/admin/services", icon: Flower2, label: "Services" },
  { href: "/admin/carousel", icon: Images, label: "Carousel" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const counts = useAdminCounts();
  const initial = (user?.email?.[0] || "S").toUpperCase();
  const name = user?.email ? user.email.split("@")[0] : "Sruthi";

  return (
    <aside className="admin-side">
      <div className="a-brand">
        <Image
          src="/images/logo.png"
          alt=""
          className="logoSlot"
          width={162}
          height={108}
          style={{ height: 40, width: "auto" }}
        />
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
          // Nothing outstanding → no badge at all. A "0" pill reads as an
          // alert that turns out to be empty.
          const count = item.count ? counts[item.count] : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : undefined}
            >
              <span className="ico">
                <item.icon size={16} strokeWidth={1.75} />
              </span>{" "}
              {item.label}
              {count > 0 && (
                <span
                  className="badge"
                  aria-label={`${count} awaiting your attention`}
                >
                  {count}
                </span>
              )}
            </Link>
          );
        })}
        <a>
          <span className="ico">
            <Settings size={16} strokeWidth={1.75} />
          </span>{" "}
          Settings
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
