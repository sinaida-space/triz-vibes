import Link from "next/link";
import { Archive } from "lucide-react";

const links = [
  { href: "/", label: "Главная" },
  { href: "/app", label: "Разобрать блок" },
  { href: "/method", label: "Метод" },
  { href: "/app#projects", label: "Проекты" }
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/15 bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 md:px-8" aria-label="Главная навигация">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center border border-ink bg-card">
            <Archive size={18} aria-hidden="true" />
          </span>
          <span className="font-display text-2xl leading-none">Противоречие</span>
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          {links.map((link) => (
            <Link key={link.href} className="text-xs uppercase tracking-[0.12em] text-ink-muted hover:text-ink" href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
