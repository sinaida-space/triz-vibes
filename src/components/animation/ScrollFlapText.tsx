"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

export function ScrollFlapText({
  text,
  className,
  intensity = "soft"
}: {
  text: string;
  className?: string;
  intensity?: "soft" | "strong";
}) {
  const [active, setActive] = useState(false);
  const timeout = useRef<number | undefined>(undefined);
  const characters = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    function onScroll() {
      setActive(true);
      window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => setActive(false), 240);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timeout.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <span aria-label={text} className={cn("mechanical-flap-text", active && "is-flipping", className)}>
      <span aria-hidden="true">
        {characters.map((character, index) => {
          return (
            <span
              className={cn("mechanical-flap-char", intensity === "strong" && "is-strong")}
              key={`${character}-${index}`}
              style={{ animationDelay: `${(index % 9) * 18}ms` }}
            >
              {character === " " ? "\u00A0" : character}
            </span>
          );
        })}
      </span>
    </span>
  );
}
