"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

// Nav items are always in the DOM and always visible on desktop — nothing
// here depends on :hover to be shown. Below 620px they collapse into a
// toggled dropdown instead of disappearing entirely (see globals.css).
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const navRef = useRef(null);

  // Mobile drawer UX: tapping outside the open menu, or pressing Escape,
  // closes it — same expectation as any native dropdown/drawer.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) close();
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="site-nav" ref={navRef}>
      <div className="site-nav-inner">
        {/* No wordmark alongside it: the logo art already reads "Beauty Bliss
            by Sruthi". The alt text carries the name for screen readers and SEO. */}
        <div className="brand">
          {/* Intrinsic size must match how big it actually renders (375x250 at
              the 250px CSS height, 3:2) — declaring 162x108 made Next serve a
              small optimized file that looked soft when blown up. */}
          <Image
            src="/images/logo.png"
            alt="Beauty Bliss by Sruthi"
            width={375}
            height={250}
            priority
          />
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className={"links" + (open ? " open" : "")}>
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={pathname === l.href ? "active" : undefined}
              onClick={close}
            >
              {l.label}
            </Link>
          ))}
          <Link className="btn-book" href="/book" onClick={close}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
