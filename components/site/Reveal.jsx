"use client";

import { motion } from "framer-motion";

// Fade + slide-up scroll entrance, used to animate server-rendered content
// (children render on the server as usual — only this wrapper is a client
// component). `once: true` so it doesn't re-trigger every time you scroll
// past it, `margin` starts the animation a little before it's fully on
// screen so it doesn't feel late.
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  x = 0,
  duration = 0.6,
  className,
  style,
  as = "div",
}) {
  const Tag = motion[as] ?? motion.div;
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
