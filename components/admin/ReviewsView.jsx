"use client";

import { useState } from "react";
import AdminTopBar from "./AdminTopBar";
import ReviewModeration from "./ReviewModeration";
import TabPills from "./TabPills";
import Banner from "./Banner";
import { MOCK_REVIEWS } from "@/lib/mock/reviews";

const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "hidden", label: "Hidden" },
];

const ACTION_MESSAGE = {
  Approve: (name) => `${name}'s review approved and published.`,
  Hide: (name) => `${name}'s review hidden from the public site.`,
  Remove: (name) => `${name}'s review removed.`,
};

const NEXT_STATUS = {
  Approve: "approved",
  Hide: "hidden",
};

// `reviews` defaults to the shared mock dataset so this component can be
// swapped to real Firestore data in Phase 4 by simply passing a real prop
// (same convention as BookingsView).
export default function ReviewsView({ reviews: initialReviews = MOCK_REVIEWS }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [activeTab, setActiveTab] = useState("all");
  const [banner, setBanner] = useState(null);

  const handleAction = (review, actionLabel) => {
    if (actionLabel === "Remove") {
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
    } else {
      const nextStatus = NEXT_STATUS[actionLabel];
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r))
      );
    }
    setBanner(
      ACTION_MESSAGE[actionLabel]?.(review.name) ?? `${actionLabel} — ${review.name}`
    );
  };

  const visible =
    activeTab === "all" ? reviews : reviews.filter((r) => r.status === activeTab);

  return (
    <div>
      <AdminTopBar
        title="Reviews"
        subtitle="Approve reviews before they appear on your site"
        searchPlaceholder="Search reviews, clients…"
      />

      <Banner type="ok" message={banner} onDismiss={() => setBanner(null)} />

      <div className="panel">
        <div className="panel-head">
          <TabPills tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>
        <ReviewModeration reviews={visible} onAction={handleAction} />
      </div>
    </div>
  );
}
