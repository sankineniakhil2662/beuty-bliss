"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { BadgeCheck, Sparkles, Star } from "lucide-react";

const INTERVAL_MS = 3000;

// Auto-advancing fade carousel for the home hero. Only rendered when there's
// at least one active image (Hero.jsx falls back to the static logo
// otherwise) — a single image just renders statically, no dots/timer.
export default function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (images.length < 2 || paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length, paused]);

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((img, i) => (
        <div key={img.id} className={"hc-slide" + (i === index ? " active" : "")}>
          <Image
            src={img.imageUrl}
            alt={img.alt || "Beauty Bliss by Sruthi"}
            fill
            priority={i === 0}
            style={{ objectFit: "cover" }}
            sizes="(max-width: 580px) 520px, 380px"
          />
        </div>
      ))}

      <div className="hc-badge tl">
        <span className="hc-badge-ic gold">
          <BadgeCheck size={26} />
        </span>
        <span>
          <b>Nurse-Led</b>
          <small>Medical Aesthetics</small>
        </span>
      </div>

      <div className="hc-badge tr">
        <span className="hc-badge-ic rose">
          <Star size={14} fill="currentColor" strokeWidth={0} />
        </span>
        <span>
          <b>4.9★ Rating</b>
          <small>500+ Glowing Faces</small>
        </span>
      </div>

      <div className="hc-tag">
        <Sparkles size={12} /> Interactive
      </div>

      {images.length > 1 && (
        <div className="hc-dots">
          {images.map((img, i) => (
            <button
              key={img.id}
              className={i === index ? "active" : undefined}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
