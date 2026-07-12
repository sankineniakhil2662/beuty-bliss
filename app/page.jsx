import { Suspense } from "react";
import Link from "next/link";
import Hero from "@/components/site/Hero";
import Footer from "@/components/site/Footer";
import ServiceCard from "@/components/services/ServiceCard";
import StarRating from "@/components/reviews/StarRating";
import Reveal from "@/components/site/Reveal";
import { ServiceGridSkeleton } from "@/components/site/Skeletons";
import { FEATURED_SERVICES, getFeaturedServices } from "@/lib/services";

// The hero carousel and the featured cards are both admin-managed, so render
// per request — otherwise this page is a build-time snapshot and nothing Sruthi
// changes ever reaches the live site. See app/services/page.jsx.
export const dynamic = "force-dynamic";

// Unlike /services, a failure here falls back to static cards rather than an
// error panel: the landing page should always look intact, and these three
// cards are marketing, not the source of truth.
async function FeaturedGrid() {
  let featured;
  try {
    featured = await getFeaturedServices();
  } catch (err) {
    console.error("getFeaturedServices failed:", err);
    featured = FEATURED_SERVICES;
  }

  return (
    <div className="svc-grid">
      {featured.map((s, i) => (
        <Reveal key={s.id ?? s.n} delay={i * 0.1}>
          <ServiceCard service={s} withBook />
        </Reveal>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <div className="wrap">
        <div className="section">
          <Reveal className="section-head">
            <span className="eyebrow">Signature Treatments</span>
            <h2>Loved by our clients</h2>
            <p>
              A few of our most-booked services. Every treatment is customised
              after a quick skin consultation.
            </p>
          </Reveal>
          <Suspense fallback={<ServiceGridSkeleton count={3} filters={false} />}>
            <FeaturedGrid />
          </Suspense>
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <Link
              className="btn-prev"
              href="/services"
              style={{ display: "inline-block" }}
            >
              See all 15 services →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ background: "var(--charcoal)" }}>
        <div className="wrap">
          <div className="section">
            <div className="rating-summary">
              <Reveal x={-30} y={0}>
                <div>
                  <div className="big" style={{ color: "var(--gold-light)" }}>
                    4.9
                  </div>
                  <div className="rs-stars">
                    <StarRating rating={5} size={20} />
                  </div>
                </div>
              </Reveal>
              <Reveal x={30} y={0} delay={0.1} style={{ maxWidth: 340 }}>
                <h2
                  className="serif"
                  style={{
                    color: "var(--cream)",
                    fontSize: 34,
                    lineHeight: 1.1,
                    marginBottom: 8,
                  }}
                >
                  What our clients say
                </h2>
                <p style={{ color: "#bdb0a4", fontSize: 14 }}>
                  Real reviews from verified clients who completed a treatment
                  with us.
                </p>
                <Link
                  className="btn-ghost"
                  href="/reviews"
                  style={{ marginTop: 18, display: "inline-block" }}
                >
                  Read all reviews
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
