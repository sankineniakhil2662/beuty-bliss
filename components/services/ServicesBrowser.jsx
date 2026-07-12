"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SearchX } from "lucide-react";
import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import { CATEGORIES } from "@/lib/constants";

// Stagger container/item pair — replays whenever `active` changes (the grid
// is keyed by it below), so switching category filters re-triggers the
// cascade instead of only animating on first mount.
const gridVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

// Client wrapper that owns the active-category state and renders the filter
// pills + service grid + empty state. Services are fetched on the server and
// passed in as a prop so the list is present in the initial HTML.
export default function ServicesBrowser({ services }) {
  const [active, setActive] = useState("All");
  const categories = ["All", ...CATEGORIES];

  const list =
    active === "All" ? services : services.filter((s) => s.cat === active);

  return (
    <>
      <ServiceFilters
        categories={categories}
        active={active}
        onSelect={setActive}
      />
      {list.length ? (
        <motion.div
          key={active}
          className="svc-grid"
          variants={gridVariants}
          initial="hidden"
          animate="show"
        >
          {list.map((s) => (
            <motion.div key={s.id ?? s.n} variants={cardVariants}>
              <ServiceCard service={s} withBook />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="empty" style={{ gridColumn: "1/-1" }}>
          <div className="ic">
            <SearchX size={48} strokeWidth={1.5} />
          </div>
          <h3>No services here yet</h3>
          <p>Try another category — new treatments are added often.</p>
        </div>
      )}
    </>
  );
}
