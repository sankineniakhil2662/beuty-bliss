import Link from "next/link";
import { Award, Mail, MapPin, Phone, Stethoscope } from "lucide-react";
import SiteNav from "@/components/site/SiteNav";
import Footer from "@/components/site/Footer";
import Reveal from "@/components/site/Reveal";

const MAP_QUERY = "9216 187 Street NW, Edmonton, AB T5T 1S3";

export default function AboutPage() {
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
            Edmonton · Medical Aesthetics Studio
          </span>
          <h1 style={{ fontSize: "clamp(36px,5vw,58px)" }}>
            About <em>Beauty Bliss</em>
          </h1>
          <p className="lead" style={{ margin: "18px auto 0" }}>
            A boutique studio where medical knowledge meets advanced skincare —
            for healthy, radiant, confident skin.
          </p>
        </Reveal>
      </div>

      <div className="wrap">
        <div className="section" style={{ paddingTop: 56 }}>
          <Reveal className="about-story">
            <div className="about-creds">
              <span>
                <Stethoscope size={15} /> Licensed Practical Nurse (LPN)
              </span>
              <span>
                <Award size={15} /> Certified Medical Esthetician
              </span>
            </div>

            <p>
              Welcome to Beauty Bliss by Sruthi, a boutique medical aesthetics
              studio in Edmonton dedicated to helping you achieve healthy,
              radiant, and confident skin.
            </p>
            <p>
              Founded by Sruthi, a Licensed Practical Nurse and Certified Medical
              Esthetician, Beauty Bliss combines medical knowledge with advanced
              aesthetic techniques to provide personalized skincare treatments
              with honest advice and visible results.
            </p>
            <p>
              Every client receives a customized approach based on their unique
              skin concerns and goals. From advanced facials and skin
              rejuvenation to PRP, microneedling, peels, and modern aesthetic
              therapies, our focus is on safe, effective, and results-driven
              care.
            </p>
            <p>
              At Beauty Bliss, we believe beautiful skin begins with
              understanding your skin — not following trends. Your journey to
              healthier, glowing skin starts here.
            </p>

            <blockquote className="about-quote">
              Where medical expertise meets advanced skincare for natural,
              confident results.
            </blockquote>
          </Reveal>
        </div>

        <div className="section" style={{ paddingTop: 8 }}>
          <div className="about-grid">
            <Reveal x={-30} y={0}>
              <div className="card card-pad">
                <h3 className="serif" style={{ fontSize: 22, marginBottom: 16 }}>
                  Visit the studio
                </h3>
                <p style={{ color: "#6f655c", fontSize: 14.5, lineHeight: 1.9 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <MapPin size={15} /> 9216 187 Street NW
                  </span>
                  <span style={{ display: "block", marginLeft: 23 }}>
                    Edmonton, AB · T5T 1S3
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Phone size={15} /> 306-241-5599
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Mail size={15} /> sruthi.vlcc@gmail.com
                  </span>
                </p>
                <Link
                  className="btn-gold"
                  href="/book"
                  style={{ marginTop: 24, display: "inline-block" }}
                >
                  Book an Appointment
                </Link>
              </div>
            </Reveal>

            <Reveal x={30} y={0} delay={0.1} className="card about-map">
              <iframe
                title="Beauty Bliss by Sruthi — studio location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
