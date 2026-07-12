import Link from "next/link";
import Hero from "@/components/site/Hero";
import Footer from "@/components/site/Footer";
import ServiceCard from "@/components/services/ServiceCard";
import StarRating from "@/components/reviews/StarRating";
import Reveal from "@/components/site/Reveal";
import { FEATURED_SERVICES } from "@/lib/services";

export default function Home() {
  const featured = FEATURED_SERVICES;

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
          <div className="svc-grid">
            {featured.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <ServiceCard service={s} withBook />
              </Reveal>
            ))}
          </div>
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
