import Link from "next/link";
import Image from "next/image";
import SiteNav from "./SiteNav";

export default function Hero() {
  return (
    <div className="hero">
      <SiteNav />
      <div className="hero-inner">
        <div>
          <span className="eyebrow">Edmonton • Esthetics Studio</span>
          <h1>
            Skin that glows,
            <br />
            care that <em>feels personal</em>.
          </h1>
          <p className="lead">
            Advanced facials, microneedling, and bespoke skin treatments —
            tailored to you by Sruthi. Book your day, and we&apos;ll take care of
            the rest.
          </p>
          <div className="cta-row">
            <Link className="btn-gold" href="/book">
              Book an Appointment
            </Link>
            <Link className="btn-ghost" href="/services">
              View Services
            </Link>
          </div>
          <div className="hero-stats">
            <div className="st">
              <b>15+</b>
              <span>Treatments</span>
            </div>
            <div className="st">
              <b>4.9★</b>
              <span>Client Rating</span>
            </div>
            <div className="st">
              <b>500+</b>
              <span>Glowing Faces</span>
            </div>
          </div>
        </div>
        <div className="hero-logo">
          <Image
            src="/BB.jpeg"
            alt="Beauty Bliss by Sruthi"
            width={430}
            height={287}
            priority
            sizes="(max-width: 980px) 300px, 430px"
          />
        </div>
      </div>
    </div>
  );
}
