import SiteNav from "@/components/site/SiteNav";
import ServicesBrowser from "@/components/services/ServicesBrowser";
import { getServices } from "@/lib/services";

export default async function ServicesPage() {
  let services = [];
  try {
    services = await getServices();
  } catch (err) {
    // Firestore not configured/seeded yet — render the shell + empty state
    // rather than crashing the route.
    console.error("getServices failed:", err);
  }

  return (
    <>
      <div className="hero" style={{ paddingBottom: 0 }}>
        <SiteNav />
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
          <ServicesBrowser services={services} />
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
