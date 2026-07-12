import SiteNav from "@/components/site/SiteNav";
import { ServiceGridSkeleton } from "@/components/site/Skeletons";

// Unlike the inline <Suspense> in page.jsx, this shell is prefetched by the
// router, so clicking "Services" paints immediately instead of sitting on the
// previous page while Firestore responds.
export default function Loading() {
  return (
    <>
      <SiteNav />
      <div className="hero" style={{ paddingBottom: 0 }}>
        <div
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
            Our Menu
          </span>
          <h1 style={{ fontSize: "clamp(36px,5vw,58px)" }}>
            Services &amp; <em>Pricing</em>
          </h1>
          <p className="lead" style={{ margin: "18px auto 0" }}>
            All prices in CAD. Pay in person after your treatment — no online
            payment needed.
          </p>
        </div>
      </div>

      <div className="wrap">
        <div className="section" style={{ paddingTop: 40 }}>
          <ServiceGridSkeleton />
        </div>
      </div>
    </>
  );
}
