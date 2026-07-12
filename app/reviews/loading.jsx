import SiteNav from "@/components/site/SiteNav";
import RatingSummary from "@/components/reviews/RatingSummary";
import { ReviewGridSkeleton } from "@/components/site/Skeletons";

// Prefetched instant fallback for the Reviews tab — see app/services/loading.jsx.
export default function Loading() {
  return (
    <>
      <SiteNav />
      <div className="hero" style={{ paddingBottom: 0 }}>
        <div
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
        </div>
      </div>

      <div className="wrap">
        <div className="section">
          <RatingSummary />
          <ReviewGridSkeleton />
        </div>
      </div>
    </>
  );
}
