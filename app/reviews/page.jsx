import { Suspense } from "react";
import { MessageCircle } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import RatingSummary from "@/components/reviews/RatingSummary";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewFormModal from "@/components/reviews/ReviewFormModal";
import Reveal from "@/components/site/Reveal";
import LoadError from "@/components/site/LoadError";
import { ReviewGridSkeleton } from "@/components/site/Skeletons";
import { getApprovedReviews } from "@/lib/reviews";

// Approving a review in the admin must publish it immediately, so this renders
// per request rather than being frozen at build time. See app/services/page.jsx.
export const dynamic = "force-dynamic";

// Only the reviews grid depends on Firestore — the hero, rating summary and
// "leave a review" form render instantly while this streams in. A failed read
// shows a real "connection problem" state instead of a misleading "no reviews".
async function ReviewsGrid() {
  let reviews;
  try {
    reviews = await getApprovedReviews();
  } catch (err) {
    console.error("getApprovedReviews failed:", err);
    return (
      <LoadError
        title="Couldn't load reviews"
        message="We couldn't reach the server. Check your internet connection and try again."
      />
    );
  }

  if (!reviews.length) {
    return (
      <div className="empty">
        <div className="ic">
          <MessageCircle size={48} strokeWidth={1.5} />
        </div>
        <h3>No reviews yet</h3>
        <p>Verified reviews appear here after clients complete a treatment.</p>
      </div>
    );
  }

  return (
    <div className="rev-grid">
      {reviews.map((r, i) => (
        <Reveal key={r.id ?? r.nm} delay={i * 0.08}>
          <ReviewCard review={r} />
        </Reveal>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <SiteNav />
      <div className="hero" style={{ paddingBottom: 0 }}>
        <Reveal
          style={{
            maxWidth: 1180,
            margin: "0 auto",
            padding: "30px 22px 56px",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <span
            className="eyebrow"
            style={{ justifyContent: "center", display: "inline-flex" }}
          >
            Verified Reviews
          </span>
          <h1 style={{ fontSize: "clamp(36px,5vw,58px)" }}>
            Glowing <em>words</em>
          </h1>
          <p className="lead" style={{ margin: "18px auto 0" }}>
            Only clients who completed a treatment can leave a review — so every
            word here is real.
          </p>
        </Reveal>
      </div>

      <div className="wrap">
        <div className="section">
          <Reveal>
            <RatingSummary />
          </Reveal>
          <Reveal
            style={{
              marginTop: 50,
              marginBottom: 50,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <ReviewFormModal />
          </Reveal>
          <Suspense fallback={<ReviewGridSkeleton />}>
            <ReviewsGrid />
          </Suspense>

          
        </div>
      </div>

      <div className="foot">
        <div className="foot-bottom" style={{ marginTop: 0, border: "none" }}>
          © 2026 Beauty Bliss by Sruthi
        </div>
      </div>
    </>
  );
}
