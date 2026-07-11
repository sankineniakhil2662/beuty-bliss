"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
];

// Nav items are always in the DOM and always visible on desktop — nothing
// here depends on :hover to be shown. Below 620px they collapse into a
// toggled dropdown instead of disappearing entirely (see globals.css).
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="site-nav">
      <div className="brand">
        <Image src="/logo.jpeg" alt="Beauty Bliss by Sruthi" width={162} height={108} />
        <div className="bn">
          <b>Beauty Bliss</b>
          <span>by Sruthi</span>
        </div>
      </div>

      <button
        type="button"
        className="nav-toggle"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "✕" : "☰"}
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
        <a>About</a>
        <Link className="btn-book" href="/book" onClick={close}>
          Book Now
        </Link>
      </div>
    </div>
  );
}
