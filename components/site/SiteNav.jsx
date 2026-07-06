import Link from "next/link";

export default function SiteNav() {
  return (
    <div className="site-nav">
      <div className="brand">
        <img src="/logo.jpeg" alt="Beauty Bliss by Sruthi" />
        <div className="bn">
          <b>Beauty Bliss</b>
          <span>by Sruthi</span>
        </div>
      </div>
      <div className="links">
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <Link href="/reviews">Reviews</Link>
        <a>About</a>
        <Link className="btn-book" href="/book">
          Book Now
        </Link>
      </div>
    </div>
  );
}
