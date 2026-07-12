import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import BookingWizard from "@/components/booking/BookingWizard";
import { getServices } from "@/lib/services";

// `searchParams` carries `?service=<name>` when arriving via a service
// card's "Book this" button, so the wizard can pre-select it instead of
// making the user find it again in the list.
export default async function BookPage({ searchParams }) {
  let services = [];
  try {
    services = await getServices();
  } catch (err) {
    console.error("getServices failed:", err);
  }
  const { service } = await searchParams;

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
          <BookingWizard services={services} preselectService={service} />
        </div>
      </div>
    </>
  );
}
