import Link from "next/link";
import { ArrowRight, FileText, ScanLine, Stamp, Workflow } from "lucide-react";
import { ScrollFlapText } from "@/components/animation/ScrollFlapText";
import { ParticleField } from "@/components/animation/ParticleField";
import { MechanicalButton } from "@/components/design/MechanicalButton";
import { PaperCard } from "@/components/design/PaperCard";

const steps = ["Проблема", "Противоречие", "Приём", "ИКР", "План", "Проверка"];

export default function LandingPage() {
  return (
    <main>
      <section className="relative overflow-hidden border-b border-black/15">
        <ParticleField mode="ambient" />
        <div className="mx-auto grid min-h-[86vh] max-w-7xl gap-10 px-4 py-8 md:grid-cols-[1.08fr_0.92fr] md:px-8 md:py-14 lg:py-20">
          <div className="flex flex-col justify-between">
            <p className="mb-5 inline-flex w-fit border border-ink/25 bg-card px-3 py-2 text-[0.68rem] uppercase tracking-[0.16em] text-ink-muted shadow-[3px_3px_0_rgba(23,20,17,0.08)] md:mb-7 md:text-xs md:tracking-[0.18em]">
              Архивный модуль / ТРИЗ / AI creators
            </p>
            <h1 className="max-w-4xl font-display text-5xl leading-[0.86] sm:text-6xl md:text-8xl lg:text-[8.8rem]">
              <ScrollFlapText text="Хватит перебирать варианты. Найдите противоречие." intensity="strong" />
            </h1>
            <p className="mt-6 max-w-2xl border-l border-stamp/60 pl-4 text-base leading-7 text-ink-muted md:mt-8 md:pl-5 md:text-lg md:leading-8">
              Интерактивный ТРИЗ-инструмент для цифровых художников и AI-криэйторов. Опишите творческий
              тупик — система найдёт конфликт, предложит приёмы, сформулирует ИКР и соберёт карту решения.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 md:mt-10 md:gap-4">
              <Link href="/app">
                <MechanicalButton>
                  Разобрать творческий блок <ArrowRight size={16} />
                </MechanicalButton>
              </Link>
              <Link href="#demo">
                <MechanicalButton variant="secondary">Посмотреть, как работает система</MechanicalButton>
              </Link>
            </div>
          </div>
          <div className="relative hidden min-h-[520px] md:block">
            <div className="absolute right-0 top-4 h-[92%] w-[86%] rotate-2 border border-black/15 bg-paper-deep/45 shadow-paper" />
            <div className="absolute right-8 top-0 h-[92%] w-[86%] -rotate-1 border border-black/15 bg-card-yellow/25 shadow-paper" />
            <PaperCard
              eyebrow="Форма 01-А / первичная карта"
              title="Досье конфликта"
              stamp="Открыто"
              className="relative z-10 min-h-[510px]"
            >
              <div className="punch-strip mb-7 h-10 border-y border-black/15 opacity-70" />
              <div className="space-y-6 text-sm leading-7">
                <p>
                  <span className="text-stamp">Симптом:</span> “Серия AI-портретов красивая, но выглядит одинаково.”
                </p>
                <p>
                  <span className="text-stamp">Противоречие:</span> единый стиль усиливает цельность, но убивает
                  уникальность. Различие усиливает авторский голос, но разрушает серию.
                </p>
                <div className="dossier-grid border border-black/15 bg-paper p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Контрольный вывод</p>
                  <p className="mt-3 text-lg leading-8">Сделать единым не стиль, а закон трансформации.</p>
                </div>
              </div>
            </PaperCard>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Почему это не template AI app</p>
          <h2 className="mt-3 font-display text-5xl leading-none md:text-7xl">
            <ScrollFlapText text="Сначала структура. Потом генерация." />
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <PaperCard title="Не промпт" stamp="I">
            <p className="text-sm leading-7 text-ink-muted">
              AI может создавать изображения, но не решает за вас творческое противоречие. Здесь модель не управляет
              продуктом: она работает внутри матрицы, схемы состояния и проверки.
            </p>
          </PaperCard>
          <PaperCard title="Состояние" stamp="II">
            <p className="text-sm leading-7 text-ink-muted">
              Каждый шаг меняет объект ProjectSession: диагноз, параметры, приём, ИКР, план, проверку и экспортируемую
              карту проекта.
            </p>
          </PaperCard>
          <PaperCard title="Действие" stamp="III">
            <p className="text-sm leading-7 text-ink-muted">
              Внутри приложения нет пассивных страниц. Каждый экран фиксирует решение, уточняет параметр или переводит
              досье в следующий статус.
            </p>
          </PaperCard>
        </div>
      </section>

      <section className="border-y border-black/15 bg-paper-deep/35">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Как работает система</p>
              <h2 className="mt-3 font-display text-5xl leading-none md:text-7xl">
                <ScrollFlapText text="Досье проходит шесть проверок" />
              </h2>
            </div>
            <Workflow className="hidden text-stamp md:block" size={42} />
          </div>
          <div className="grid gap-3 md:grid-cols-6">
            {steps.map((step, index) => (
              <div
                key={step}
                className="group relative min-h-32 overflow-hidden border border-ink/20 bg-card p-4 shadow-[3px_3px_0_rgba(23,20,17,0.12)] transition hover:-translate-y-1 hover:bg-paper"
              >
                <ScanLine className="absolute right-3 top-3 opacity-0 transition group-hover:opacity-50" size={16} />
                <p className="text-xs text-stamp">0{index + 1}</p>
                <p className="mt-12 text-sm uppercase tracking-[0.08em]">
                  <ScrollFlapText text={step} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-[0.75fr_1.25fr] md:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-ink-muted">Демонстрационный случай</p>
          <h2 className="mt-3 font-display text-5xl leading-none md:text-7xl">
            <ScrollFlapText text="Красиво, но generic" />
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink-muted">
            Система не обещает вдохновения. Она показывает, где именно проект теряет структуру.
          </p>
        </div>
        <PaperCard stamp="Пример">
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <FileText className="mb-4 text-stamp" />
              <h3 className="font-semibold">Ввод</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">“Проект красивый, но не имеет авторского голоса.”</p>
            </div>
            <div>
              <Stamp className="mb-4 text-stamp" />
              <h3 className="font-semibold">Диагноз</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">Конфликт уникальности и управляемости AI.</p>
            </div>
            <div>
              <ArrowRight className="mb-4 text-stamp" />
              <h3 className="font-semibold">Выход</h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">ИКР, план действий, критерии и карта проекта.</p>
            </div>
          </div>
        </PaperCard>
      </section>
    </main>
  );
}
