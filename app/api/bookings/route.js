import { createBooking } from "@/lib/bookings";

// POST /api/bookings — create a booking request. Returns { id, ref }.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { details, services, preferredDate } = body || {};
  if (
    !details?.name?.trim() ||
    !Array.isArray(services) ||
    services.length === 0 ||
    !preferredDate
  ) {
    return Response.json(
      { error: "Missing required booking fields" },
      { status: 400 }
    );
  }

  try {
    const result = await createBooking(body);
    return Response.json(result, { status: 201 });
  } catch (err) {
    console.error("POST /api/bookings failed:", err);
    return Response.json(
      { error: "Could not save your booking. Please try again." },
      { status: 500 }
    );
  }
}
