"use client";

import { useEffect, useState, type CSSProperties } from "react";

export default function CursorAura() {
  const [active, setActive] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    function onMove(event: MouseEvent) {
      setX(event.clientX);
      setY(event.clientY);
      setActive(true);
    }

    function onLeave() {
      setActive(false);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-10 hidden md:block"
      style={
        {
          "--cursor-x": `${x}px`,
          "--cursor-y": `${y}px`,
          opacity: active ? 1 : 0,
        } as CSSProperties
      }
    >
      <div className="cm-cursor-aura" />
    </div>
  );
}
