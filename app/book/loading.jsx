import { BookingSkeleton } from "@/components/site/Skeletons";

// Prefetched instant fallback for "Book now" — see app/services/loading.jsx.
export default function Loading() {
  return (
    <div className="wrap">
      <div className="section">
        <BookingSkeleton />
      </div>
    </div>
  );
}
