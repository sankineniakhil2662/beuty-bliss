import Link from "next/link";
import Image from "next/image";
import { ICONS } from "@/lib/constants";

export default function ServiceCard({ service, withBook = false }) {
  const s = service;
  const CatIcon = ICONS[s.cat];
  return (
    <div className="svc-card">
      <div className="svc-thumb">
        {s.imageUrl ? (
          <Image
            src={s.imageUrl}
            alt={s.n}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 620px) 100vw, (max-width: 980px) 50vw, 33vw"
          />
        ) : (
          <span className="ic">{CatIcon && <CatIcon size={40} strokeWidth={1.5} />}</span>
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
          <Link
            className="book-mini"
            href={`/book?service=${encodeURIComponent(s.n)}`}
          >
            Book this
          </Link>
        )}
      </div>
    </div>
  );
}
