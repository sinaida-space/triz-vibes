"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MechanicalButton } from "@/components/design/MechanicalButton";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setVisible(!localStorage.getItem("protivorechie.cookieConsent"));
    });
  }, []);

  function choose(value: "accepted" | "necessary") {
    localStorage.setItem("protivorechie.cookieConsent", value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-4xl border border-ink/25 bg-card p-4 shadow-paper md:flex md:items-center md:justify-between md:gap-5">
      <p className="text-sm leading-6 text-ink-muted">
        Мы используем минимальные cookies и локальное хранилище, чтобы сохранять состояние проекта и улучшать работу
        интерфейса. Вы можете принять cookies или продолжить только с необходимыми.{" "}
        <Link className="text-ink underline" href="/cookies">
          Подробнее
        </Link>
      </p>
      <div className="mt-4 flex shrink-0 flex-wrap gap-3 md:mt-0">
        <MechanicalButton onClick={() => choose("accepted")}>Принять</MechanicalButton>
        <MechanicalButton variant="secondary" onClick={() => choose("necessary")}>
          Только необходимые
        </MechanicalButton>
      </div>
    </div>
  );
}
