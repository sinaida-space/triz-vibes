# Противоречие

**Хватит перебирать варианты. Найдите противоречие.**

«Противоречие» — русскоязычный web app для AI-криэйторов, цифровых художников и генеративных дизайнеров. Он помогает превратить расплывчатый творческий тупик в структурированное ТРИЗ-решение: диагноз, противоречие, параметры, приём, ИКР, план действий, проверку и экспортируемую карту проекта.

Это не чат с моделью и не промпт с интерфейсом. Это пошаговый диагностический инструмент, где OpenAI используется как один из модулей внутри контролируемой системы.

## Что делает приложение

Пользователь описывает творческую проблему на русском языке, например:

> Серия AI-портретов выглядит аккуратно, но все работы становятся одинаковыми и теряют авторский голос.

Дальше система ведёт проект через строгий маршрут:

```txt
Черновик
→ Диагноз
→ Подтверждение противоречия
→ Подбор ТРИЗ-приёмов
→ Выбор приёма
→ ИКР
→ План действий
→ Проверка
→ Карта проекта
```

На каждом экране есть действие. Пользователь не просто читает сгенерированный текст, а принимает решение, уточняет параметры или переводит проект в следующий статус.

## Почему это система, а не промпт

OpenAI не управляет приложением. Модель не выбирает маршрут, не хранит состояние и не заменяет ТРИЗ-логику.

Система контролирует:

- объект `ProjectSession`;
- staged flow проекта;
- переходы между статусами;
- локальное сохранение проектов;
- ТРИЗ-параметры;
- deterministic lookup в матрице приёмов;
- проверку обязательных шагов;
- структуру финальной карты.

OpenAI используется только там, где действительно нужна интерпретация человеческой формулировки: распознать проблему, переписать противоречие, сформулировать ИКР, собрать план и оценить решение.

## Основной сценарий

1. Пользователь вводит творческий блок.
2. Приложение диагностирует проблему.
3. Система формулирует ТРИЗ-противоречие.
4. Пользователь подтверждает улучшаемый и ухудшаемый параметры.
5. Матрица рекомендует ТРИЗ-приёмы.
6. Пользователь выбирает приём.
7. Приложение генерирует ИКР.
8. Приложение собирает план действий.
9. Система проверяет: противоречие устранено или только найден компромисс.
10. Проект сохраняется как карта решения.

## Как используется OpenAI API

Все вызовы OpenAI выполняются только на сервере через Next.js API routes.

Используемые маршруты:

```txt
/api/ai/diagnose
/api/ai/formulate-contradiction
/api/ai/generate-ifr
/api/ai/generate-action-plan
/api/ai/validate-solution
```

OpenAI отвечает структурированным JSON. Ответы проверяются через Zod-схемы перед тем, как попасть в состояние проекта.

Если API недоступен или ответ не проходит валидацию, приложение возвращает контролируемый fallback, чтобы пользовательский маршрут не ломался.

## Технологии

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- Zod
- OpenAI API
- Framer Motion
- Three.js / React Three Fiber
- localStorage persistence
- Supabase-ready schema draft

## Дизайн

Визуальный язык проекта: архивные документы, старая машинопись, перфокарты, технические формы, выцветшая бумага, красные штампы и строгая типографика.

Цель интерфейса — ощущение серьёзного диагностического прибора, а не AI-игрушки или SaaS-шаблона.

## Запуск локально

Установите зависимости:

```bash
npm install
```

Создайте локальный env-файл:

```bash
cp .env.example .env.local
```

Добавьте переменные окружения:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Запустите dev server:

```bash
npm run dev
```

Откройте:

```txt
http://localhost:3000
```

## GitHub Pages

Репозиторий содержит отдельный GitHub Actions workflow для публикации статической landing-страницы на GitHub Pages:

```txt
.github/workflows/pages.yml
```

Команда для локальной сборки Pages-версии:

```bash
npm run build:pages
```

Она создаёт папку `out` со статическим `index.html`.

Важно: GitHub Pages не выполняет server-side API routes. Поэтому Pages-версия — публичная страница проекта. Полный диагностический workflow с OpenAI API нужно запускать локально или деплоить на платформу с серверным runtime, например Vercel, Netlify или Cloudflare.

## Проверки

```bash
npm run lint
npm run build
```

Дополнительно:

```bash
npm run typecheck
```

## Переменные окружения

```env
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.5
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

API-ключи не хранятся в репозитории и не отправляются в браузер.

## Структура проекта

```txt
src/app
  page.tsx                         Landing page
  app/page.tsx                     Start workspace
  app/project/[id]                 Project flow screens
  api/ai                           Server-side OpenAI routes
  privacy/page.tsx                 Privacy policy
  cookies/page.tsx                 Cookie policy
  method/page.tsx                  Method page

src/components
  animation                        Motion and interaction components
  design                           Paper cards, buttons, stamps
  layout                           Header, footer, app shell, progress rail

src/lib
  openai                           Client, prompts, schemas, fallbacks
  state                            Zustand store and staged transitions
  triz                             Parameters, matrix, principles, formatters
  storage                          Supabase schema draft
```

## ProjectSession

Ключевой объект состояния:

```ts
type ProjectSession = {
  id: string;
  title: string;
  status: ProjectStatus;
  rawProblem: string;
  diagnosedProblem?: string;
  problemType?: string;
  improvingParameter?: string;
  worseningParameter?: string;
  contradictionFormula?: string;
  recommendedPrinciples?: string[];
  selectedPrinciple?: string;
  ifr?: string;
  resources?: string[];
  actionPlan?: unknown;
  validation?: unknown;
  createdAt: string;
  updatedAt: string;
};
```

Фактические типы в коде шире и детальнее; README показывает только смысловую форму объекта.

## Статусы проекта

```txt
draft
→ diagnosed
→ contradiction_confirmed
→ principles_recommended
→ principle_selected
→ ifr_generated
→ action_plan_created
→ validated
→ exported
```

Переходы ограничены. Пользователь не должен попадать в финальную карту без проверки решения.

## Скриншоты

Плейсхолдеры для GitHub:

```txt
public/demo/landing.png
public/demo/workspace.png
public/demo/contradiction.png
public/demo/principles.png
public/demo/map.png
```

## Демо-сценарий для записи

1. Открыть landing page.
2. Нажать «Разобрать творческий блок».
3. Ввести проблему про серию AI-изображений.
4. Дойти до подтверждения противоречия.
5. Выбрать улучшаемый и ухудшаемый параметры.
6. Выбрать один из рекомендованных ТРИЗ-приёмов.
7. Сгенерировать ИКР.
8. Собрать план действий.
9. Запустить проверку.
10. Открыть карту проекта.

## Статус MVP

Готово:

- многошаговый проектный workspace;
- серверные OpenAI routes;
- Zod validation;
- deterministic TRIZ matrix logic;
- localStorage persistence;
- legal pages;
- cookie banner;
- экспортируемая карта проекта;
- polished Russian UI.

Ограничения MVP:

- нет аккаунтов и облачной синхронизации;
- Supabase пока подготовлен архитектурно, но не подключён как runtime storage;
- нет полноценного Playwright E2E test suite;
- финальный экспорт сейчас ориентирован на copy/print flow.

## Почему AI здесь нужен

Творческие блоки редко описываются как готовая инженерная задача. Пользователь говорит: «красиво, но мёртво», «серия распалась», «всё выглядит одинаково», «нет авторского закона».

OpenAI помогает перевести эту мутную формулировку в рабочий материал для системы:

- выделить симптом;
- предложить диагноз;
- переписать конфликт в форме противоречия;
- сформулировать ИКР человеческим языком;
- собрать план, привязанный к конкретному проекту.

Но после этого решение проходит через состояние, матрицу, проверки и карту. Именно поэтому проект остаётся системой.

## Автор

Created by **sin.ai.da**  
Website: [sinaida.eu](https://sinaida.eu)

© 2026 sin.ai.da. All rights reserved.
