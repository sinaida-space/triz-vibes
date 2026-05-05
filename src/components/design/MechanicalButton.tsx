import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function MechanicalButton({
  children,
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
}) {
  return (
    <button
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden border px-4 py-3 text-left text-xs uppercase tracking-[0.12em] transition active:translate-x-[2px] active:translate-y-[2px] disabled:cursor-not-allowed disabled:opacity-55",
        "after:absolute after:inset-x-3 after:bottom-2 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100",
        variant === "primary" &&
          "border-ink bg-ink text-card shadow-[4px_4px_0_rgba(143,29,20,0.45)] hover:bg-stamp hover:shadow-[6px_6px_0_rgba(23,20,17,0.2)]",
        variant === "secondary" && "border-ink/35 bg-card text-ink hover:border-ink hover:bg-paper-deep hover:shadow-[4px_4px_0_rgba(23,20,17,0.12)]",
        variant === "danger" && "border-stamp bg-transparent text-stamp hover:bg-stamp hover:text-card",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}
