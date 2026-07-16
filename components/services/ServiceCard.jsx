"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/lib/constants";
import Modal from "@/components/site/Modal";

export default function ServiceCard({ service, withBook = false }) {
  const s = service;
  const CatIcon = ICONS[s.cat];
  const [open, setOpen] = useState(false);
  const cardRef = useRef(null);
  const titleId = `svc-title-${s.id ?? s.n}`;
  const bookHref = `/book?service=${encodeURIComponent(s.n)}`;

  const thumb = (big) =>
    s.imageUrl ? (
      <Image
        src={s.imageUrl}
        alt={s.n}
        fill
        style={{ objectFit: "cover" }}
        sizes={
          big
            ? "(max-width: 620px) 90vw, 460px"
            : "(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
        }
      />
    ) : (
      <span className="ic">
        {CatIcon && <CatIcon size={big ? 54 : 40} strokeWidth={1.5} />}
      </span>
    );

  return (
    <>
      {/* The whole card opens the details popup. It's a div (not a button) so
          the "Book this" link can live inside it; keyboard users get the same
          via role/tabindex + Enter/Space. */}
      <div
        className="svc-card"
        ref={cardRef}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-label={`View details for ${s.n}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <div className="svc-thumb">
          {thumb(false)}
          {s.deal && <span className="deal">{s.deal}</span>}
          <span className="pricepill">CA${s.price}</span>
        </div>
        <div className="svc-body">
          <h3>{s.n}</h3>
          <div className="meta">
            <span>{s.dur} min</span>
            <span className="dot"></span>
            <span>{s.cat}</span>
          </div>
          <p className="desc">{s.d}</p>
          <div className="price-row">
            <span className="now">CA${s.price}</span>
            {s.was && <span className="was">CA${s.was}</span>}
          </div>
          {withBook && (
            <Link
              className="book-mini"
              href={bookHref}
              onClick={(e) => e.stopPropagation()}
            >
              Book this
            </Link>
          )}
        </div>
      </div>

      {open && (
        <Modal
          onClose={() => setOpen(false)}
          labelledBy={titleId}
          returnFocusRef={cardRef}
          dialogClassName="review-modal--on-image"
        >
          <div className="svc-modal">
            <div className="svc-modal-thumb">
              {thumb(true)}
              {s.deal && <span className="deal">{s.deal}</span>}
            </div>
            <div className="svc-modal-body">
              <h3 id={titleId}>{s.n}</h3>
              <div className="meta">
                <span>{s.dur} min</span>
                <span className="dot"></span>
                <span>{s.cat}</span>
              </div>
              <p className="svc-modal-desc">{s.d}</p>
              <div className="price-row">
                <span className="now">CA${s.price}</span>
                {s.was && <span className="was">CA${s.was}</span>}
              </div>
              <Link className="btn-gold svc-modal-book" href={bookHref}>
                Book This
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
