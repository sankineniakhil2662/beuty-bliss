"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "./AdminTopBar";
import ReviewModeration from "./ReviewModeration";
import TabPills from "./TabPills";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import {
  fetchAllReviewsForAdmin,
  removeReview,
  setReviewStatus,
} from "@/lib/reviews";

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

export default function ReviewsView() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetchAllReviewsForAdmin()
      .then(setReviews)
      .catch(() => setBanner("Couldn't load reviews — check you're signed in as admin."))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (review, actionLabel) => {
    const snapshot = reviews;
    try {
      if (actionLabel === "Remove") {
        setReviews((prev) => prev.filter((r) => r.id !== review.id));
        await removeReview(review.id);
      } else {
        const nextStatus = NEXT_STATUS[actionLabel];
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, status: nextStatus } : r))
        );
        await setReviewStatus(review.id, nextStatus);
      }
    } catch {
      setReviews(snapshot); // revert
      setBanner("Update failed — please try again.");
      return;
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
        {loading ? (
          <EmptyState icon="⏳" title="Loading reviews…" message="One moment." />
        ) : (
          <ReviewModeration reviews={visible} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}
