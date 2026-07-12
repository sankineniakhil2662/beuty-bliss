import { Suspense } from "react";
import BookingWizard from "@/components/booking/BookingWizard";
import LoadError from "@/components/site/LoadError";
import { BookingSkeleton } from "@/components/site/Skeletons";
import { getServices } from "@/lib/services";

// The wizard can't start without the service list, so it's suspended on its own.
// A failed read shows a retryable connection error rather than an empty wizard
// the user could never complete.
async function Wizard({ preselectService }) {
  try {
    const services = await getServices();
    return (
      <BookingWizard services={services} preselectService={preselectService} />
    );
  } catch (err) {
    console.error("getServices failed:", err);
    return (
      <LoadError
        title="Couldn't load the booking form"
        message="We couldn't reach the server. Check your internet connection and try again."
      />
    );
  }
}

// `searchParams` carries `?service=<name>` when arriving via a service
// card's "Book this" button, so the wizard can pre-select it instead of
// making the user find it again in the list.
export default async function BookPage({ searchParams }) {
  const { service } = await searchParams;

  return (
    <div className="wrap">
      <div className="section">
        <Suspense fallback={<BookingSkeleton />}>
          <Wizard preselectService={service} />
        </Suspense>
      </div>
    </div>
  );
}
