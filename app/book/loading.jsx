import Link from "next/link";
import Image from "next/image";
import { BookingSkeleton } from "@/components/site/Skeletons";

// Prefetched instant fallback for "Book now" — see app/services/loading.jsx.
export default function Loading() {
  return (
    <>
      <div className="site-nav">
        <div
          className="site-nav-inner"
          style={{
            paddingTop: 6,
            paddingBottom: 6,
            flexWrap: "wrap",
            rowGap: 10,
          }}
        >
          <div className="brand">
            <Image
              src="/logo.jpeg"
              alt="Beauty Bliss by Sruthi"
              width={162}
              height={108}
              style={{ height: 44, width: "auto" }}
            />
            <div className="bn">
              <b style={{ color: "var(--cream)", fontSize: 19 }}>Beauty Bliss</b>
              <span>by Sruthi</span>
            </div>
          </div>
          <Link
            className="btn-ghost"
            href="/services"
            style={{ fontSize: 12, padding: "9px 18px" }}
          >
            ← Back to services
          </Link>
        </div>
      </div>

      <div className="wrap">
        <div className="section">
          <BookingSkeleton />
        </div>
      </div>
    </>
  );
}
