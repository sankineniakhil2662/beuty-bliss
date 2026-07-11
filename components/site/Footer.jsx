import Link from "next/link";

export default function Footer() {
  return (
    <div className="foot">
      <div className="foot-inner">
        <div>
          <div className="brand" style={{ marginBottom: 16 }}>
            <img
              src="/BB.jpeg"
              alt="Beauty Bliss by Sruthi"
              style={{ height: 46, borderRadius: 7 }}
            />
            <div className="bn">
              <b style={{ color: "var(--cream)", fontSize: 20 }}>Beauty Bliss</b>
              <span>by Sruthi</span>
            </div>
          </div>
          <p style={{ maxWidth: 280 }}>
            Boutique esthetics studio in Edmonton. Personalised skincare, honest
            advice, visible results.
          </p>
        </div>
        <div>
          <h4>Visit</h4>
          <p>9216 187 Street NW</p>
          <p>Edmonton, AB · T5T 1S3</p>
          <p>📱 306-241-5599</p>
          <p>✉️ sruthi.vlcc@gmail.com</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/services">Services &amp; Pricing</Link>
          <Link href="/book">Book Appointment</Link>
          <Link href="/reviews">Client Reviews</Link>
          <a>Instagram</a>
          <a>Facebook</a>
        </div>
      </div>
      <div className="foot-bottom">
        © 2026 Beauty Bliss by Sruthi · Crafted with care
      </div>
    </div>
  );
}
