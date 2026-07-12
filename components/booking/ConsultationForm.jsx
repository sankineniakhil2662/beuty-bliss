"use client";

import { ClipboardList, Flower2, Leaf, Lock, Stethoscope, Target } from "lucide-react";

const CONCERNS = [
  "Acne / breakouts",
  "Acne scars",
  "Pigmentation / dark spots",
  "Fine lines & wrinkles",
  "Dryness / dehydration",
  "Redness / sensitivity",
  "Enlarged pores",
  "Dull skin",
  "Uneven skin tone",
  "Other",
];

const SUNSCREEN = ["Daily", "Sometimes", "Rarely", "Never"];

const specifyStyle = {
  marginTop: 10,
  padding: "11px 14px",
  border: "1.5px solid var(--line)",
  borderRadius: 10,
  fontFamily: "inherit",
  fontSize: 13.5,
};

function YesNo({ value, onSet }) {
  return (
    <div className="yesno">
      <button
        className={"yes" + (value === "yes" ? " on" : "")}
        onClick={() => onSet("yes")}
      >
        Yes
      </button>
      <button
        className={"no" + (value === "no" ? " on" : "")}
        onClick={() => onSet("no")}
      >
        No
      </button>
    </div>
  );
}

// The full facial consultation form. All values live in BookingWizard and are
// passed via `value`; `onChange(field, val)` and `onToggleConcern(name)` mutate.
export default function ConsultationForm({ value: c, onChange, onToggleConcern }) {
  return (
    <div className="consult">
      {/* skin concerns */}
      <div className="cgroup">
        <div className="ctitle">
          <Flower2 size={14} /> Skin Concerns{" "}
          <span
            style={{
              textTransform: "none",
              letterSpacing: 0,
              color: "var(--muted)",
              fontWeight: 400,
            }}
          >
            (check all that apply)
          </span>
        </div>
        <div className="chk-grid">
          {CONCERNS.map((concern) => {
            const on = c.concerns.includes(concern);
            return (
              <label key={concern} className={"chk" + (on ? " on" : "")}>
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => onToggleConcern(concern)}
                />{" "}
                {concern}
              </label>
            );
          })}
        </div>
        <input
          className={"specify" + (c.concerns.includes("Other") ? " show" : "")}
          placeholder="Other concern — please specify"
          style={specifyStyle}
          value={c.concernOther}
          onChange={(e) => onChange("concernOther", e.target.value)}
        />
      </div>

      {/* medical history */}
      <div className="cgroup">
        <div className="ctitle">
          <Stethoscope size={14} /> Medical History
        </div>

        <div className="qa">
          <div className="qtext">Are you pregnant or breastfeeding?</div>
          <YesNo value={c.preg} onSet={(v) => onChange("preg", v)} />
        </div>

        <div className="qa">
          <div className="qtext">Do you have any allergies?</div>
          <YesNo value={c.allergy} onSet={(v) => onChange("allergy", v)} />
        </div>
        <input
          className={"specify" + (c.allergy === "yes" ? " show" : "")}
          placeholder="Please specify your allergies"
          value={c.allergySpec}
          onChange={(e) => onChange("allergySpec", e.target.value)}
        />

        <div className="qa">
          <div className="qtext">Do you have any medical conditions?</div>
          <YesNo value={c.cond} onSet={(v) => onChange("cond", v)} />
        </div>
        <input
          className={"specify" + (c.cond === "yes" ? " show" : "")}
          placeholder="Please specify your medical conditions"
          value={c.condSpec}
          onChange={(e) => onChange("condSpec", e.target.value)}
        />

        <div className="qa">
          <div className="qtext">
            Are you taking any medications (incl. acne medications)?
          </div>
          <YesNo value={c.meds} onSet={(v) => onChange("meds", v)} />
        </div>
        <input
          className={"specify" + (c.meds === "yes" ? " show" : "")}
          placeholder="Please list your medications"
          value={c.medsSpec}
          onChange={(e) => onChange("medsSpec", e.target.value)}
        />
      </div>

      {/* skin history */}
      <div className="cgroup">
        <div className="ctitle">
          <ClipboardList size={14} /> Skin History
        </div>
        <div className="qa">
          <div className="qtext">
            <span className="qn">5.</span>Used isotretinoin (Accutane) in the
            last 6 months?
          </div>
          <YesNo value={c.accutane} onSet={(v) => onChange("accutane", v)} />
        </div>
        <div className="qa">
          <div className="qtext">
            <span className="qn">6.</span>Botox, fillers, or facial surgery in
            the last 2 weeks?
          </div>
          <YesNo value={c.botox} onSet={(v) => onChange("botox", v)} />
        </div>
        <div className="qa">
          <div className="qtext">
            <span className="qn">7.</span>Chemical peels, microneedling, or laser
            in the last month?
          </div>
          <YesNo value={c.peel} onSet={(v) => onChange("peel", v)} />
        </div>
        <div className="qa">
          <div className="qtext">
            <span className="qn">8.</span>Currently using retinol, tretinoin, or
            exfoliating acids?
          </div>
          <YesNo value={c.retinol} onSet={(v) => onChange("retinol", v)} />
        </div>
        <div className="qa">
          <div className="qtext">
            <span className="qn">9.</span>Do you experience cold sores?
          </div>
          <YesNo value={c.coldsore} onSet={(v) => onChange("coldsore", v)} />
        </div>
      </div>

      {/* lifestyle */}
      <div className="cgroup">
        <div className="ctitle">
          <Leaf size={14} /> Lifestyle
        </div>
        <div className="qa" style={{ borderBottom: "1px solid #f1ebe1" }}>
          <div className="qtext">
            <span className="qn">10.</span>How much water do you drink daily?
          </div>
          <input
            style={{
              width: 140,
              padding: "8px 12px",
              border: "1.5px solid var(--line)",
              borderRadius: 10,
              fontFamily: "inherit",
              fontSize: 13,
            }}
            placeholder="e.g. 2 litres"
            value={c.water}
            onChange={(e) => onChange("water", e.target.value)}
          />
        </div>
        <div className="qa">
          <div className="qtext">
            <span className="qn">11.</span>Do you smoke?
          </div>
          <YesNo value={c.smoke} onSet={(v) => onChange("smoke", v)} />
        </div>
        <div style={{ paddingTop: 12 }}>
          <div className="qtext" style={{ marginBottom: 10 }}>
            <span className="qn">12.</span>How often do you wear sunscreen?
          </div>
          <div className="pill-choice">
            {SUNSCREEN.map((opt) => (
              <button
                key={opt}
                className={c.sunscreen === opt ? "on" : undefined}
                onClick={() => onChange("sunscreen", opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* goals */}
      <div className="cgroup" style={{ marginBottom: 6 }}>
        <div className="ctitle">
          <Target size={14} /> Goals
        </div>
        <div className="qtext" style={{ marginBottom: 10 }}>
          <span className="qn">13.</span>What would you like to achieve from
          today&apos;s treatment?
        </div>
        <textarea
          rows="2"
          placeholder="e.g. brighter, even-toned skin and fewer breakouts"
          style={{
            width: "100%",
            padding: "11px 14px",
            border: "1.5px solid var(--line)",
            borderRadius: 10,
            fontFamily: "inherit",
            fontSize: 13.5,
          }}
          value={c.goals}
          onChange={(e) => onChange("goals", e.target.value)}
        />
      </div>
      <p
        className="hint"
        style={{
          marginBottom: 6,
          display: "flex",
          alignItems: "flex-start",
          gap: 6,
        }}
      >
        <Lock size={13} style={{ flexShrink: 0, marginTop: 2 }} /> By continuing
        you confirm the information is true. Results vary from person to
        person. You&apos;ll sign the consent at your visit.
      </p>
    </div>
  );
}
