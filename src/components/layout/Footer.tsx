import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-black/15 bg-paper-deep/45">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.3fr_0.7fr] md:px-8">
        <div>
          <p className="font-display text-3xl">Противоречие</p>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">
            Рабочий ТРИЗ-инструмент для цифровых художников и AI-криэйторов.
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.12em] text-ink-muted">
            © 2026 sin.ai.da. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 text-sm">
          <a href="https://sinaida.eu" target="_blank" rel="noreferrer" className="hover:underline">
            Автор: sinaida.eu
          </a>
          <Link href="/method" className="hover:underline">
            Метод
          </Link>
          <Link href="/privacy" className="hover:underline">
            Прайваси
          </Link>
          <Link href="/cookies" className="hover:underline">
            Куки
          </Link>
        </div>
      </div>
    </footer>
  );
}
