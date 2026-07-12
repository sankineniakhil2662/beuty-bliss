import { Suspense } from "react";
import SiteNav from "@/components/site/SiteNav";
import ServicesBrowser from "@/components/services/ServicesBrowser";
import Reveal from "@/components/site/Reveal";
import LoadError from "@/components/site/LoadError";
import { ServiceGridSkeleton } from "@/components/site/Skeletons";
import { getServices } from "@/lib/services";

// Services are admin-managed, so render per request: a price edit must show up
// without a rebuild, and a Firestore hiccup during `next build` must not bake a
// stale list (or an error page) into the deployed output.
export const dynamic = "force-dynamic";

// The only Firestore-dependent part. Suspended so the nav + hero render
// instantly on navigation, and a failure shows a real "connection problem"
// state instead of masquerading as "no services".
async function ServicesList() {
  try {
    const services = await getServices();
    return <ServicesBrowser services={services} />;
  } catch (err) {
    console.error("getServices failed:", err);
    return (
      <LoadError
        title="Couldn't load services"
        message="We couldn't reach the server. Check your internet connection and try again."
      />
    );
  }
}

export default function ServicesPage() {
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
            Our Menu
          </span>
          <h1 style={{ fontSize: "clamp(36px,5vw,58px)" }}>
            Services &amp; <em>Pricing</em>
          </h1>
          <p className="lead" style={{ margin: "18px auto 0" }}>
            All prices in CAD. Pay in person after your treatment — no online
            payment needed.
          </p>
        </Reveal>
      </div>

      <div className="wrap">
        <div className="section" style={{ paddingTop: 40 }}>
          <Suspense fallback={<ServiceGridSkeleton />}>
            <ServicesList />
          </Suspense>
        </div>
      </div>

      <div className="foot">
        <div className="foot-bottom" style={{ marginTop: 0, border: "none" }}>
          © 2026 Beauty Bliss by Sruthi · 9216 187 Street NW, Edmonton ·
          306-241-5599
        </div>
      </div>
    </>
  );
}
