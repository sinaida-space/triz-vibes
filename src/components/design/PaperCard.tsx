import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function PaperCard({
  eyebrow,
  title,
  stamp,
  children,
  className
}: {
  eyebrow?: string;
  title?: string;
  stamp?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "paper-edge relative border border-black/20 bg-card p-6 pl-12 shadow-paper transition-transform duration-300 hover:-translate-y-0.5 md:p-8 md:pl-14",
        "after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.28),transparent)] after:opacity-0 after:transition-opacity hover:after:opacity-100",
        className
      )}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow ? <p className="mb-2 text-xs uppercase tracking-[0.14em] text-ink-muted">{eyebrow}</p> : null}
          {title ? <h2 className="font-display text-3xl leading-[0.95] md:text-5xl">{title}</h2> : null}
        </div>
        {stamp ? <span className="stamp text-xs">{stamp}</span> : null}
      </div>
      <div className="relative z-10">{children}</div>
    </section>
  );
}
