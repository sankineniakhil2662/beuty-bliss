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

// One fixed bar that condenses as you scroll. The condense is *scrubbed* to the
// scroll position via a --nav-progress custom property (0→1), which CSS uses to
// interpolate the logo scale and the bar height — so it shrinks gradually with
// the scroll rather than snapping. Because the bar is position:fixed over a
// constant-height spacer, its height change relayouts only its own handful of
// nodes (never the page), and the logo shrinks via a GPU transform: smooth 60fps
// both directions, no reflow, no cross-fade ghosting, and always locked to the
// top. The scroll listener is rAF-throttled and only writes the property.
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RANGE = 130; // px of scroll over which it fully condenses
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / RANGE));
      root.style.setProperty("--nav-progress", p);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile drawer UX: tapping outside the open menu, or pressing Escape, closes it.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
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
    <div ref={rootRef} className="site-nav-root">
      <div className="site-nav">
        <div className="site-nav-inner">
          <div className="brand">
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
      {/* Reserves the (expanded) bar's footprint — the bar is fixed, so it takes
          no space in flow. */}
      <div className="site-nav-spacer" aria-hidden="true" />
    </div>
  );
}
