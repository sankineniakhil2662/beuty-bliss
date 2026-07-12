"use client";

import Image from "next/image";
import { ICONS } from "@/lib/constants";

// One selectable service row. Shows "+ Add" until added, then a +/- stepper.
export default function ServicePickRow({ service, qty, onAdd, onInc, onDec }) {
  const s = service;
  const CatIcon = ICONS[s.cat];
  return (
    <div className={"svc-pick-row" + (qty > 0 ? " on" : "")}>
      {/* The service's own photo, same one the Services page shows. Falls back
          to the category icon for a service added without an image. */}
      <div className="sp-ic">
        {s.imageUrl ? (
          <Image
            src={s.imageUrl}
            alt=""
            fill
            sizes="52px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          CatIcon && <CatIcon size={20} strokeWidth={1.5} />
        )}
      </div>
      <div className="sp-info">
        <b>{s.n}</b>
        <span>
          {s.dur} min · {s.cat}
        </span>
      </div>
      <div className="sp-price">CA${s.price}</div>
      <div>
        {qty > 0 ? (
          <div className="stepper">
            <button onClick={() => onDec(s.n)}>−</button>
            <span className="qty">{qty}</span>
            <button onClick={() => onInc(s.n)}>+</button>
          </div>
        ) : (
          <button className="sp-add" onClick={() => onAdd(s.n)}>
            + Add
          </button>
        )}
      </div>
    </div>
  );
}
