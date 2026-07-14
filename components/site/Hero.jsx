import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import SiteNav from "./SiteNav";
import HeroCarousel from "./HeroCarousel";
import Reveal from "./Reveal";
import CountUp from "./CountUp";
import { getCarouselImages } from "@/lib/carousel";

export default async function Hero() {
  let carouselImages = [];
  try {
    carouselImages = await getCarouselImages();
  } catch (err) {
    // Firestore not configured/seeded yet — fall back to the static logo
    // below rather than crashing the home page.
    console.error("getCarouselImages failed:", err);
  }

  return (
    <>
      <SiteNav />
      <div className="hero">
        <div className="hero-inner">
        <div>
          <Reveal>
            <span className="eyebrow">Edmonton • Esthetics Studio</span>
            <h1>
              Nurse-Led Medical
              <br />
              Aesthetics & <em>Advanced Facials</em>.
            </h1>
            <p className="lead">
             Personalized treatments to help you achieve healthy, glowing, confident skin.
            </p>
            <div className="cta-row">
              <Link className="btn-gold" href="/book">
                Book an Appointment
              </Link>
              <Link className="btn-ghost" href="/services">
                View Services
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15} y={16}>
            <div className="hero-stats">
              <div className="st">
                <div className="st-val">
                  <span className="st-num">
                    <CountUp value={15} suffix="+" />
                  </span>
                </div>
                <span className="st-lbl">Treatments</span>
              </div>
              <div className="st">
                <div className="st-val">
                  <span className="st-num">
                    <CountUp value={4.9} decimals={1} />
                  </span>
                  <Star
                    className="st-star"
                    size={22}
                    fill="currentColor"
                    strokeWidth={0}
                  />
                </div>
                <span className="st-lbl">Client Rating</span>
              </div>
              <div className="st">
                <div className="st-val">
                  <span className="st-num">
                    <CountUp value={500} suffix="+" />
                  </span>
                </div>
                <span className="st-lbl">Glowing Faces</span>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.2} x={40} y={0}>
          <div className="hero-logo">
            {carouselImages.length ? (
              <HeroCarousel images={carouselImages} />
            ) : (
              <Image
                src="/images/logo.png"
                alt="Beauty Bliss by Sruthi"
                width={430}
                height={287}
                priority
                sizes="(max-width: 980px) 300px, 430px"
              />
            )}
          </div>
        </Reveal>
        </div>
      </div>
    </>
  );
}
