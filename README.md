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

````bash
# Форматировать все файлы в проекте
pnpm format

# Проверить форматирование без изменений
## Автоформатирование при коммите

Автоформатирование затронутых файлов выполняется через `husky` + `lint-staged`.
Если hooks не активировались автоматически, выполните:

```bash
pnpm format:check
````

## Структура

- [index.html](index.html)

- [src/main.js](src/main.js)
- [src/style.css](src/style.css)
