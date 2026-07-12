"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

// Counts from 0 up to `value` once it scrolls into view. `decimals` handles
// non-integer stats (e.g. the 4.9 rating); `prefix`/`suffix` wrap the
// formatted number (e.g. suffix="+" for "15+").
export default function CountUp({
  value,
  decimals = 0,
  duration = 1.6,
  prefix = "",
  suffix = "",
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(latest) {
        setDisplay(latest.toFixed(decimals));
      },
    });
    return () => controls.stop();
  }, [isInView, value, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
