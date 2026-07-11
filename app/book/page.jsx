import Link from "next/link";
import Image from "next/image";
import BookingWizard from "@/components/booking/BookingWizard";
import { getServices } from "@/lib/services";

export default async function BookPage() {
  let services = [];
  try {
    services = await getServices();
  } catch (err) {
    console.error("getServices failed:", err);
  }

  return (
    <>
      <div style={{ background: "var(--charcoal)", padding: "16px 0" }}>
        <div className="site-nav" style={{ paddingTop: 6, paddingBottom: 6 }}>
          <div className="brand">
            <Image
              src="/BB.jpeg"
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
          <BookingWizard services={services} />
        </div>
      </div>
    </>
  );
}
