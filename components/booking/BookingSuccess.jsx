"use client";

import { CheckCircle2 } from "lucide-react";

// Step 5: confirmation screen. `bookingRef` is minted client-side in
// BookingWizard's submit handler (before the WhatsApp redirect), then reused
// as-is for the background Firestore write — this screen never waits on it.
export default function BookingSuccess({ firstName, bookingRef, onBackHome,phone }) {
  return (
    <div className="success-box">
      <div className="circle">
        <CheckCircle2 size={44} strokeWidth={1.5} />
      </div>
      <h2>Request received!</h2>
      <p>
        Thank you, <b>{firstName}</b>. Your appointment request has been sent to
        Sruthi.
      </p>
      <div className="ref">
        Booking Ref: <b>{bookingRef}</b>
      </div>
      <div className="next-steps">
        <div className="nh">What happens next</div>
        <div className="ns">
          <div className="num">1</div>
          <div>
            <b>We&apos;ll reach out</b>Sruthi will call or message you within 24
            hours to confirm your time.
          </div>
        </div>
        <div className="ns">
          <div className="num">2</div>
          <div>
            <b>Check your inbox</b>A confirmation SMS is on its way to{" "}
            <span>{phone}</span>.

          </div>
        </div>
        <div className="ns">
          <div className="num">3</div>
          <div>
            <b>Pay after your visit</b>No payment now — settle in person once your
            treatment is done.
          </div>
        </div>
      </div>
      <button className="btn-gold" style={{ marginTop: 24 }} onClick={onBackHome}>
        Back to Home
      </button>
    </div>
  );
}
