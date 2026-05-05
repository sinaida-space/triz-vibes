import { mkdir, rm, writeFile } from "node:fs/promises";

const outDir = new URL("../out/", import.meta.url);

const html = String.raw`<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Противоречие — ТРИЗ-инструмент для AI-криэйторов</title>
    <meta
      name="description"
      content="Русскоязычный ТРИЗ-инструмент для цифровых художников и AI-криэйторов: от творческого блока к противоречию, ИКР, плану и карте решения."
    />
    <meta property="og:title" content="Противоречие" />
    <meta property="og:description" content="Хватит перебирать варианты. Найдите противоречие." />
    <meta property="og:type" content="website" />
    <style>
      :root {
        --paper: #f3ead7;
        --paper-deep: #e4d3b2;
        --card: #fbf6e9;
        --ink: #171411;
        --muted: #5f584f;
        --stamp: #8f1d14;
        --line: rgba(23, 20, 17, 0.22);
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        min-height: 100vh;
        color: var(--ink);
        background:
          radial-gradient(circle at 12% 16%, rgba(143, 29, 20, 0.08), transparent 24rem),
          linear-gradient(rgba(23, 20, 17, 0.045) 1px, transparent 1px),
          linear-gradient(90deg, rgba(23, 20, 17, 0.035) 1px, transparent 1px),
          var(--paper);
        background-size: auto, 32px 32px, 32px 32px, auto;
        font-family: "IBM Plex Mono", "Courier New", monospace;
      }

      body::before {
        content: "";
        position: fixed;
        inset: 0;
        pointer-events: none;
        opacity: 0.32;
        background-image:
          radial-gradient(rgba(23, 20, 17, 0.22) 0.55px, transparent 0.55px),
          radial-gradient(rgba(255, 255, 255, 0.38) 0.65px, transparent 0.65px);
        background-position: 0 0, 9px 11px;
        background-size: 18px 18px, 22px 22px;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .shell {
        position: relative;
        z-index: 1;
      }

      header,
      footer {
        border-color: var(--line);
        background: rgba(243, 234, 215, 0.84);
        backdrop-filter: blur(12px);
      }

      header {
        position: sticky;
        top: 0;
        z-index: 10;
        border-bottom: 1px solid var(--line);
      }

      nav,
      .wrap {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
      }

      nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;
        padding: 18px 0;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: 12px;
        font-family: Georgia, "Times New Roman", serif;
        font-size: clamp(1.4rem, 3vw, 2rem);
      }

      .brand-mark {
        display: inline-grid;
        width: 38px;
        height: 38px;
        place-items: center;
        border: 1px solid var(--ink);
        background: var(--card);
        font-family: inherit;
        font-size: 1.1rem;
      }

      .nav-links {
        display: flex;
        gap: 18px;
        color: var(--muted);
        font-size: 0.74rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .hero {
        display: grid;
        min-height: calc(100vh - 75px);
        grid-template-columns: 1.05fr 0.95fr;
        gap: 48px;
        align-items: center;
        padding: clamp(48px, 7vw, 96px) 0;
      }

      .eyebrow {
        display: inline-flex;
        width: fit-content;
        border: 1px solid rgba(23, 20, 17, 0.25);
        background: var(--card);
        padding: 9px 12px;
        color: var(--muted);
        box-shadow: 3px 3px 0 rgba(23, 20, 17, 0.08);
        font-size: 0.72rem;
        letter-spacing: 0.16em;
        text-transform: uppercase;
      }

      h1,
      h2,
      h3 {
        margin: 0;
        font-family: Georgia, "Times New Roman", serif;
        font-weight: 500;
        letter-spacing: 0;
      }

      h1 {
        max-width: 840px;
        margin-top: 28px;
        font-size: clamp(4rem, 11vw, 9rem);
        line-height: 0.86;
      }

      h2 {
        font-size: clamp(3rem, 6vw, 5.8rem);
        line-height: 0.96;
      }

      h3 {
        font-size: clamp(1.6rem, 3vw, 2.45rem);
      }

      .lead {
        max-width: 680px;
        margin: 28px 0 0;
        border-left: 1px solid rgba(143, 29, 20, 0.58);
        padding-left: 18px;
        color: var(--muted);
        font-size: clamp(1rem, 1.5vw, 1.16rem);
        line-height: 1.8;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 14px;
        margin-top: 36px;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 48px;
        border: 1px solid var(--ink);
        padding: 13px 18px;
        background: var(--ink);
        color: var(--card);
        box-shadow: 5px 5px 0 rgba(143, 29, 20, 0.45);
        font-size: 0.78rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      .button.secondary {
        background: var(--card);
        color: var(--ink);
        box-shadow: none;
      }

      .dossier-stack {
        position: relative;
        min-height: 540px;
      }

      .sheet-shadow,
      .sheet-shadow.second {
        position: absolute;
        inset: 32px 0 0 auto;
        width: 88%;
        height: 88%;
        border: 1px solid rgba(23, 20, 17, 0.16);
        background: rgba(228, 211, 178, 0.5);
        box-shadow: 10px 10px 0 rgba(23, 20, 17, 0.08);
        transform: rotate(2deg);
      }

      .sheet-shadow.second {
        inset: 0 36px auto auto;
        background: rgba(216, 194, 122, 0.23);
        transform: rotate(-1deg);
      }

      .paper-card {
        position: relative;
        min-height: 520px;
        border: 1px solid rgba(23, 20, 17, 0.2);
        background: var(--card);
        padding: 34px 34px 34px 54px;
        box-shadow: 9px 9px 0 rgba(23, 20, 17, 0.12);
      }

      .paper-card::before {
        content: "";
        position: absolute;
        top: 20px;
        bottom: 20px;
        left: 18px;
        width: 7px;
        opacity: 0.45;
        background-image: radial-gradient(rgba(95, 88, 79, 0.75) 1px, transparent 1.4px);
        background-size: 7px 12px;
      }

      .stamp {
        display: inline-flex;
        border: 1px solid var(--stamp);
        color: var(--stamp);
        padding: 3px 7px;
        font-size: 0.68rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        transform: rotate(-2deg);
      }

      .punch-strip {
        height: 42px;
        margin: 26px 0;
        border-block: 1px solid rgba(23, 20, 17, 0.16);
        opacity: 0.7;
        background-image: radial-gradient(rgba(23, 20, 17, 0.52) 1.5px, transparent 1.8px);
        background-size: 14px 14px;
      }

      .paper-card p {
        color: var(--muted);
        line-height: 1.8;
      }

      .red {
        color: var(--stamp);
      }

      section {
        border-top: 1px solid rgba(23, 20, 17, 0.14);
        padding: clamp(68px, 8vw, 108px) 0;
      }

      .section-head {
        max-width: 760px;
        margin-bottom: 34px;
      }

      .grid-3 {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }

      .small-card {
        min-height: 220px;
        border: 1px solid rgba(23, 20, 17, 0.18);
        background: var(--card);
        padding: 28px;
        box-shadow: 5px 5px 0 rgba(23, 20, 17, 0.08);
      }

      .small-card p {
        color: var(--muted);
        line-height: 1.75;
      }

      .steps {
        display: grid;
        grid-template-columns: repeat(6, minmax(0, 1fr));
        gap: 10px;
      }

      .step {
        min-height: 132px;
        border: 1px solid rgba(23, 20, 17, 0.18);
        background: var(--card);
        padding: 18px;
        box-shadow: 3px 3px 0 rgba(23, 20, 17, 0.1);
      }

      .step .number {
        color: var(--stamp);
        font-size: 0.8rem;
      }

      .step .label {
        margin-top: 48px;
        font-size: 0.78rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      footer {
        border-top: 1px solid var(--line);
        padding: 42px 0;
      }

      .footer-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 28px;
      }

      .footer-links {
        display: flex;
        flex-direction: column;
        gap: 12px;
        color: var(--muted);
      }

      @media (max-width: 900px) {
        .hero,
        .grid-3,
        .footer-grid {
          grid-template-columns: 1fr;
        }

        .dossier-stack {
          display: none;
        }

        .steps {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .nav-links {
          display: none;
        }
      }
    </style>
  </head>
  <body>
    <div class="shell">
      <header>
        <nav>
          <a class="brand" href="#">
            <span class="brand-mark">▣</span>
            <span>Противоречие</span>
          </a>
          <div class="nav-links">
            <a href="#system">Система</a>
            <a href="#flow">Маршрут</a>
            <a href="https://github.com/sinaida-space/triz-vibes">GitHub</a>
          </div>
        </nav>
      </header>

      <main>
        <div class="wrap hero">
          <div>
            <span class="eyebrow">Архивный модуль / ТРИЗ / AI creators</span>
            <h1>Хватит перебирать варианты. Найдите противоречие.</h1>
            <p class="lead">
              Интерактивный ТРИЗ-инструмент для цифровых художников и AI-криэйторов. Опишите творческий тупик — система найдёт конфликт, предложит приёмы, сформулирует ИКР и соберёт карту решения.
            </p>
            <div class="actions">
              <a class="button" href="https://github.com/sinaida-space/triz-vibes#запуск-локально">Запустить проект →</a>
              <a class="button secondary" href="#flow">Посмотреть маршрут</a>
            </div>
          </div>

          <div class="dossier-stack" aria-hidden="true">
            <div class="sheet-shadow"></div>
            <div class="sheet-shadow second"></div>
            <article class="paper-card">
              <span class="eyebrow">Форма 01-А / первичная карта</span>
              <h3 style="margin-top: 16px;">Досье конфликта</h3>
              <span class="stamp" style="position:absolute; right:28px; top:34px;">Открыто</span>
              <div class="punch-strip"></div>
              <p><span class="red">Симптом:</span> “Серия AI-портретов красивая, но выглядит одинаково.”</p>
              <p><span class="red">Противоречие:</span> единый стиль усиливает цельность, но убивает уникальность. Различие усиливает авторский голос, но разрушает серию.</p>
              <div class="small-card" style="min-height:auto; margin-top:24px;">
                <span class="eyebrow">Контрольный вывод</span>
                <p style="font-size:1.1rem; color:var(--ink);">Сделать единым не стиль, а закон трансформации.</p>
              </div>
            </article>
          </div>
        </div>

        <section id="system">
          <div class="wrap">
            <div class="section-head">
              <span class="eyebrow">Почему это не prompt UI</span>
              <h2 style="margin-top:16px;">Сначала структура. Потом генерация.</h2>
            </div>
            <div class="grid-3">
              <article class="small-card">
                <span class="stamp">I</span>
                <h3 style="margin-top:18px;">Не чат</h3>
                <p>Пользователь проходит диагностический маршрут, а не переписывается с моделью.</p>
              </article>
              <article class="small-card">
                <span class="stamp">II</span>
                <h3 style="margin-top:18px;">Состояние</h3>
                <p>Каждый шаг меняет объект проекта: диагноз, параметры, приём, ИКР, план, проверку и карту.</p>
              </article>
              <article class="small-card">
                <span class="stamp">III</span>
                <h3 style="margin-top:18px;">Контроль</h3>
                <p>OpenAI работает внутри строгой схемы: JSON, Zod, staged flow и deterministic TRIZ matrix.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="flow">
          <div class="wrap">
            <div class="section-head">
              <span class="eyebrow">Как работает система</span>
              <h2 style="margin-top:16px;">Досье проходит шесть проверок</h2>
            </div>
            <div class="steps">
              <div class="step"><div class="number">01</div><div class="label">Проблема</div></div>
              <div class="step"><div class="number">02</div><div class="label">Противоречие</div></div>
              <div class="step"><div class="number">03</div><div class="label">Приём</div></div>
              <div class="step"><div class="number">04</div><div class="label">ИКР</div></div>
              <div class="step"><div class="number">05</div><div class="label">План</div></div>
              <div class="step"><div class="number">06</div><div class="label">Проверка</div></div>
            </div>
          </div>
        </section>

        <section>
          <div class="wrap grid-3">
            <div>
              <span class="eyebrow">OpenAI API</span>
              <h2 style="margin-top:16px;">Модель — не продукт. Модель — слой рассуждения.</h2>
            </div>
            <article class="small-card" style="grid-column: span 2;">
              <p>
                В полном приложении OpenAI используется на сервере: диагностика, формулировка противоречия, ИКР, план действий и проверка решения. Матрица ТРИЗ, состояние проекта и переходы остаются deterministic.
              </p>
              <div class="actions">
                <a class="button" href="https://github.com/sinaida-space/triz-vibes">Открыть репозиторий</a>
                <a class="button secondary" href="https://sinaida.eu">Автор: sinaida.eu</a>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer>
        <div class="wrap footer-grid">
          <div>
            <div class="brand">Противоречие</div>
            <p style="max-width:620px; color:var(--muted); line-height:1.7;">
              Рабочий ТРИЗ-инструмент для цифровых художников и AI-криэйторов.
            </p>
            <p style="color:var(--muted); font-size:.78rem; letter-spacing:.1em; text-transform:uppercase;">© 2026 sin.ai.da. All rights reserved.</p>
          </div>
          <div class="footer-links">
            <a href="https://github.com/sinaida-space/triz-vibes">GitHub</a>
            <a href="https://sinaida.eu">sinaida.eu</a>
          </div>
        </div>
      </footer>
    </div>
  </body>
</html>`;

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });
await writeFile(new URL("index.html", outDir), html);
await writeFile(new URL("404.html", outDir), html);

console.log("GitHub Pages static site written to ./out");
