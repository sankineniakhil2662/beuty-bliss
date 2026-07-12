// Suspense fallbacks for the Firestore-backed parts of each page. The static
// shell (nav, hero, form) streams instantly; only these areas show a skeleton
// while data loads — so navigating between tabs never looks frozen.

// `filters` is off for the Home page's featured grid, which has no filter row.
export function ServiceGridSkeleton({ count = 6, filters = true }) {
  return (
    <>
      {filters && (
        <div className="filters">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton sk-pill" />
          ))}
        </div>
      )}
      <div className="svc-grid">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton sk-card" />
        ))}
      </div>
    </>
  );
}

export function ReviewGridSkeleton({ count = 3 }) {
  return (
    <div className="rev-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton sk-rev" />
      ))}
    </div>
  );
}

export function BookingSkeleton() {
  return (
    <div className="book-shell">
      <div>
        <div className="card card-pad">
          <div
            className="skeleton sk-line"
            style={{ width: "55%", height: 24, marginBottom: 22 }}
          />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 74, borderRadius: 14, marginBottom: 10 }}
            />
          ))}
        </div>
      </div>
      <div className="summary-side">
        <div className="card card-pad">
          <div
            className="skeleton sk-line"
            style={{ width: "50%", marginBottom: 16 }}
          />
          <div className="skeleton" style={{ height: 130, borderRadius: 12 }} />
        </div>
      </div>
    </div>
  );
}
