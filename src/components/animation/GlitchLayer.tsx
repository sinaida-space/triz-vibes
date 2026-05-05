"use client";

import { useEffect, useRef, useState } from "react";

export function firePageGlitch() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("protivorechie:glitch"));
}

export function GlitchLayer() {
  const [active, setActive] = useState(false);
  const timeout = useRef<number | undefined>(undefined);

  useEffect(() => {
    function onGlitch() {
      setActive(true);
      document.documentElement.classList.add("acid-glitch-active");
      window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        setActive(false);
        document.documentElement.classList.remove("acid-glitch-active");
      }, 420);
    }

    function onDocumentClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("button")) firePageGlitch();
    }

    window.addEventListener("protivorechie:glitch", onGlitch);
    document.addEventListener("click", onDocumentClick);
    return () => {
      window.clearTimeout(timeout.current);
      document.documentElement.classList.remove("acid-glitch-active");
      document.removeEventListener("click", onDocumentClick);
      window.removeEventListener("protivorechie:glitch", onGlitch);
    };
  }, []);

  return (
    <div className={`glitch-layer ${active ? "is-active" : ""}`} aria-hidden="true">
      <div />
      <div />
      <div />
    </div>
  );
}
