"use client";

const HEADER = {
  fontSize: 11,
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  color: "var(--rose-deep)",
  fontWeight: 700,
};

// Live selection summary (right column). Presentational — derives everything
// from props passed by BookingWizard.
export default function CartSummary({ lines, count, total }) {
  return (
    <div className="summary-side">
      <div className="card card-pad">
        <div
          style={{
            ...HEADER,
            marginBottom: 14,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>Your Selection</span>
          <span style={{ color: "var(--muted)" }}>
            {count} {count === 1 ? "item" : "items"}
          </span>
        </div>

        <div>
          {lines.length === 0 ? (
            <div className="cart-empty">
              No services added yet.
              <br />
              Pick from the list to get started.
            </div>
          ) : (
            lines.map((l) => (
              <div key={l.name} className="cart-line">
                <div className="cl-name">
                  {l.name}
                  <small>
                    CA${l.price} × {l.qty}
                  </small>
                </div>
                <div className="cl-price">CA${l.sub}</div>
              </div>
            ))
          )}
        </div>

        <div className="ss-line" style={{ marginTop: 14 }}>
          <span>Deposit today</span>
          <b style={{ color: "var(--ok)" }}>CA$0.00</b>
        </div>
        <div className="ss-total">
          <span>Pay after visit</span>
          <b>CA${total}</b>
        </div>
        <div className="pay-note" style={{ marginTop: 18 }}>
          ✨{" "}
          <div>
            You only pay once your treatment is complete and you&apos;re glowing.
          </div>
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 18 }}>
        <div style={{ ...HEADER, marginBottom: 12 }}>Studio</div>
        <p style={{ fontSize: 13.5, color: "#6f655c", lineHeight: 1.7 }}>
          📍 9216 187 Street NW
          <br />
          Edmonton, AB · T5T 1S3
          <br />
          📱 306-241-5599
        </p>
      </div>
    </div>
  );
}
