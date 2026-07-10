import Link from "next/link";
import { ICONS } from "@/lib/constants";

export default function ServiceCard({ service, withBook = false }) {
  const s = service;
  return (
    <div className="svc-card">
      <div className="svc-thumb">
        {s.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={s.imageUrl}
            alt={s.n}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span className="ic">{ICONS[s.cat]}</span>
        )}
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
          <Link className="book-mini" href="/book">
            Book this
          </Link>
        )}
      </div>
    </div>
  );
}
