import { MessageCircle } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import RatingSummary from "@/components/reviews/RatingSummary";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import Reveal from "@/components/site/Reveal";
import { getApprovedReviews } from "@/lib/reviews";

export default async function ReviewsPage() {
  let reviews = [];
  try {
    reviews = await getApprovedReviews();
  } catch (err) {
    console.error("getApprovedReviews failed:", err);
  }

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

          {reviews.length ? (
            <div className="rev-grid">
              {reviews.map((r, i) => (
                <Reveal key={r.id ?? r.nm} delay={i * 0.08}>
                  <ReviewCard review={r} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty">
              <div className="ic">
                <MessageCircle size={48} strokeWidth={1.5} />
              </div>
              <h3>No reviews yet</h3>
              <p>
                Verified reviews appear here after clients complete a treatment.
              </p>
            </div>
          )}

          <Reveal
            style={{
              marginTop: 50,
              maxWidth: 560,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <ReviewForm />
          </Reveal>
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
