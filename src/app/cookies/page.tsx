import { PaperCard } from "@/components/design/PaperCard";

export default function CookiesPage() {
  return (
    <main className="mx-auto min-h-[72vh] max-w-4xl px-4 py-14 md:px-8">
      <PaperCard title="Политика cookies" stamp="1 мая 2026">
        <div className="space-y-5 text-sm leading-7 text-ink-muted">
          <p>Сервис «Противоречие» использует cookies и localStorage для корректной работы приложения.</p>
          <p>
            Необходимые данные применяются для сохранения cookie-согласия, состояния интерфейса, локальных проектов в
            MVP-версии и базовой навигации.
          </p>
          <p>
            Аналитика в MVP не подключена. Если аналитика будет добавлена, пользователь должен иметь возможность
            отказаться от неё.
          </p>
          <p>Изменить выбор можно через очистку cookies и localStorage в настройках браузера.</p>
        </div>
      </PaperCard>
    </main>
  );
}
