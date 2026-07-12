"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import StepServices from "./StepServices";
import StepDetails from "./StepDetails";
import StepDay from "./StepDay";
import StepConfirm from "./StepConfirm";
import BookingSuccess from "./BookingSuccess";
import CartSummary from "./CartSummary";

const STEPS = [
  { n: 1, label: "Services" },
  { n: 2, label: "Details" },
  { n: 3, label: "Pick a Day" },
  { n: 4, label: "Confirm" },
];

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const INITIAL_CONSULT = {
  concerns: [],
  concernOther: "",
  preg: null,
  allergy: null,
  allergySpec: "",
  cond: null,
  condSpec: "",
  meds: null,
  medsSpec: "",
  accutane: null,
  botox: null,
  peel: null,
  retinol: null,
  coldsore: null,
  water: "",
  smoke: null,
  sunscreen: null,
  goals: "",
};

// The booking wizard owns ALL state for the flow. Step components are
// presentational and receive state + callbacks as props.
// `preselectService` (a service name from a "Book this" link's ?service=
// query param) seeds the cart so the user doesn't have to find it again in
// the list — only applied if it actually matches a real service.
export default function BookingWizard({ services, preselectService }) {
  const router = useRouter();

  const [step, setStep] = useState(1);

  // Step changes are internal state, not route navigations, so Next.js's
  // scroll-to-top-on-navigate behavior never fires for them. Reset scroll
  // manually whenever the wizard moves to a new step.
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  const [cart, setCart] = useState(() =>
    preselectService && services.some((s) => s.n === preselectService)
      ? { [preselectService]: 1 }
      : {}
  ); // { serviceName: qty }
  const [details, setDetails] = useState({ name: "", email: "", phone: "", age: "" });
  console.log("=======", details);
  const [consultation, setConsultation] = useState(INITIAL_CONSULT);
  const [consultOpen, setConsultOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [agree, setAgree] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Booking calendar: defaults to the real current month (previously
  // hardcoded to July 2026, which would have silently broken every booking
  // after that month), but the user can page forward/back with the
  // chevrons. `now` is computed once per mount as the floor for navigation
  // — you can't book into a month that's already passed.
  const now = useMemo(() => new Date(), []);
  const [bookingYear, setBookingYear] = useState(now.getFullYear());
  const [bookingMonth, setBookingMonth] = useState(now.getMonth());
  const isEarliestMonth =
    bookingYear === now.getFullYear() && bookingMonth === now.getMonth();

  const changeMonth = (delta) => {
    const next = new Date(bookingYear, bookingMonth + delta, 1);
    if (
      next.getFullYear() < now.getFullYear() ||
      (next.getFullYear() === now.getFullYear() && next.getMonth() < now.getMonth())
    ) {
      return;
    }
    setBookingYear(next.getFullYear());
    setBookingMonth(next.getMonth());
    // The previously selected day belongs to the month being left; carrying
    // its number over would silently point at a different date.
    setSelectedDate(null);
    setShowDayErr(false);
  };

  // validation display flags
  const [showSvcErr, setShowSvcErr] = useState(false);
  const [fieldState, setFieldState] = useState({ name: null, email: null, phone: null });
  const [showDayErr, setShowDayErr] = useState(false);
  const [showAgreeErr, setShowAgreeErr] = useState(false);

  // ---- derived cart data (single source: cart + services) ----
  const byName = useMemo(
    () => Object.fromEntries(services.map((s) => [s.n, s])),
    [services]
  );
  // `imageUrl` is for the summary thumbnails only — the booking written to
  // Firestore picks its fields explicitly (see the submit handler below).
  const lines = Object.keys(cart).map((n) => ({
    name: n,
    price: byName[n].price,
    qty: cart[n],
    sub: byName[n].price * cart[n],
    imageUrl: byName[n].imageUrl ?? null,
  }));
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const total = lines.reduce((a, l) => a + l.sub, 0);

  // ---- cart handlers ----
  const addSvc = (n) => {
    setCart((c) => ({ ...c, [n]: (c[n] || 0) + 1 }));
    setShowSvcErr(false);
  };
  const incSvc = (n) => setCart((c) => ({ ...c, [n]: c[n] + 1 }));
  const decSvc = (n) =>
    setCart((c) => {
      const q = (c[n] || 0) - 1;
      const next = { ...c };
      if (q <= 0) delete next[n];
      else next[n] = q;
      return next;
    });

  // ---- details + consultation handlers ----
  const setDetail = (field, value) => setDetails((d) => ({ ...d, [field]: value }));
  const setConsult = (field, value) =>
    setConsultation((c) => ({ ...c, [field]: value }));
  const toggleConcern = (name) =>
    setConsultation((c) => ({
      ...c,
      concerns: c.concerns.includes(name)
        ? c.concerns.filter((x) => x !== name)
        : [...c.concerns, name],
    }));

  // ---- step machine + validation gates ----
  const continueFromServices = () => {
    if (Object.keys(cart).length === 0) {
      setShowSvcErr(true);
      return;
    }
    setShowSvcErr(false);
    setStep(2);
  };

  const continueFromDetails = () => {
    const okName = details.name.trim().length > 0;
    const okEmail = EMAIL_RE.test(details.email.trim());
    const okPhone = details.phone.replace(/\D/g, "").length >= 7;
    setFieldState({
      name: okName ? "ok" : "error",
      email: okEmail ? "ok" : "error",
      phone: okPhone ? "ok" : "error",
    });
    if (okName && okEmail && okPhone) setStep(3);
  };

  const reviewFromDay = () => {
    if (selectedDate == null) {
      setShowDayErr(true);
      return;
    }
    setShowDayErr(false);
    setStep(4);
  };

  const submit = async () => {
    if (!agree) {
      setShowAgreeErr(true);
      return;
    }
    setShowAgreeErr(false);
    setSubmitError(null);
    setSubmitting(true);
    try {
      const preferredDate = `${bookingYear}-${String(bookingMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}`;
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          services: lines.map((l) => ({
            name: l.name,
            price: l.price,
            qty: l.qty,
          })),
          total,
          details,
          consultation,
          preferredDate,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Request failed");
      }
      const { ref } = await res.json();
      setBookingRef(ref);
      setStep(5);
    } catch (err) {
      setSubmitError(
        err.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = details.name.trim().split(" ")[0] || "there";

  return (
    <div className="book-shell">
      <div>
        <div className="card card-pad">
          <div className="form-step-bar">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className={
                  "stp" + (step > s.n ? " done" : step === s.n ? " active" : "")
                }
              >
                <div className="n">{s.n}</div>
                <span>{s.label}</span>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 1 && (
                <StepServices
                  services={services}
                  cart={cart}
                  onAdd={addSvc}
                  onInc={incSvc}
                  onDec={decSvc}
                  showError={showSvcErr}
                  onContinue={continueFromServices}
                />
              )}

              {step === 2 && (
                <StepDetails
                  details={details}
                  onDetailChange={setDetail}
                  fieldState={fieldState}
                  consultation={consultation}
                  onConsultChange={setConsult}
                  onToggleConcern={toggleConcern}
                  consultOpen={consultOpen}
                  onToggleConsult={() => setConsultOpen((o) => !o)}
                  onBack={() => setStep(1)}
                  onContinue={continueFromDetails}
                />
              )}

              {step === 3 && (
                <StepDay
                  year={bookingYear}
                  month={bookingMonth}
                  selectedDate={selectedDate}
                  onSelectDate={(d) => {
                    setSelectedDate(d);
                    setShowDayErr(false);
                  }}
                  onPrevMonth={() => changeMonth(-1)}
                  onNextMonth={() => changeMonth(1)}
                  canGoPrevMonth={!isEarliestMonth}
                  showError={showDayErr}
                  onBack={() => setStep(2)}
                  onReview={reviewFromDay}
                />
              )}

              {step === 4 && (
                <StepConfirm
                  year={bookingYear}
                  month={bookingMonth}
                  details={details}
                  lines={lines}
                  total={total}
                  selectedDate={selectedDate}
                  agree={agree}
                  onAgreeChange={setAgree}
                  showError={showAgreeErr}
                  submitting={submitting}
                  submitError={submitError}
                  onBack={() => setStep(3)}
                  onSubmit={submit}
                />
              )}

              {step === 5 && (
                <BookingSuccess
                  phone={details.phone}
                  firstName={firstName}
                  bookingRef={bookingRef}
                  onBackHome={() => router.push("/")}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {step !== 5 && <CartSummary lines={lines} count={count} total={total} />}
    </div>
  );
}
