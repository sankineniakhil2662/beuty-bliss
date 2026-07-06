"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
export default function BookingWizard({ services }) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [cart, setCart] = useState({}); // { serviceName: qty }
  const [details, setDetails] = useState({ name: "", email: "", phone: "", age: "" });
  const [consultation, setConsultation] = useState(INITIAL_CONSULT);
  const [consultOpen, setConsultOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [agree, setAgree] = useState(false);
  const [bookingRef, setBookingRef] = useState(null);

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
  const lines = Object.keys(cart).map((n) => ({
    name: n,
    price: byName[n].price,
    qty: cart[n],
    sub: byName[n].price * cart[n],
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

  const submit = () => {
    if (!agree) {
      setShowAgreeErr(true);
      return;
    }
    setShowAgreeErr(false);
    // Placeholder ref until the Firestore write returns a real one (next phase).
    setBookingRef("#BB-2026-" + String(Math.floor(1000 + Math.random() * 9000)));
    setStep(5);
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
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
                setShowDayErr(false);
              }}
              showError={showDayErr}
              onBack={() => setStep(2)}
              onReview={reviewFromDay}
            />
          )}

          {step === 4 && (
            <StepConfirm
              details={details}
              lines={lines}
              total={total}
              selectedDate={selectedDate}
              agree={agree}
              onAgreeChange={setAgree}
              showError={showAgreeErr}
              onBack={() => setStep(3)}
              onSubmit={submit}
            />
          )}

          {step === 5 && (
            <BookingSuccess
              firstName={firstName}
              email={details.email}
              bookingRef={bookingRef}
              onBackHome={() => router.push("/")}
            />
          )}
        </div>
      </div>

      {step !== 5 && <CartSummary lines={lines} count={count} total={total} />}
    </div>
  );
}
