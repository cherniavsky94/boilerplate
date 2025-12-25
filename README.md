# Vite + Vanilla JS (pnpm)

Минимальный шаблон проекта на Vite (vanilla JS) с использованием pnpm.

## Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Запуск дев-сервера
pnpm dev

# Сборка продакшн-билда
pnpm build

# Локальный просмотр собранного билда
pnpm preview
```

## Prettier

Команды форматирования:

```bash
# Форматировать все файлы в проекте
pnpm format

# Проверить форматирование без изменений
pnpm format:check
```

## Автоформатирование при коммите

Автоформатирование затронутых файлов выполняется через `husky` + `lint-staged`.
Если hooks не активировались автоматически, выполните:

```bash
pnpm install           # установит зависимости и выполнит prepare
# альтернативно вручную:
pnpm exec husky install
chmod +x .husky/pre-commit
git config core.hooksPath .husky
```

## PostHTML

PostHTML интегрирован через Vite-плагин (`transformIndexHtml`).
Конфигурация: [posthtml.config.js](posthtml.config.js). Добавляйте плагины в `plugins`.

Проверка сборки с трансформациями:

```bash
pnpm build
```

## Структура

- [index.html](index.html)
- [src/main.js](src/main.js)
- [src/style.css](src/style.css)
- [vite.config.js](vite.config.js)
- [posthtml.config.js](posthtml.config.js)
- [package.json](package.json)

Примечание: требуется установленный Node.js и pnpm. При необходимости выполните `corepack enable`.
