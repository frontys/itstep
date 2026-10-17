========================================================================
УЧЁТ ТОВАРОВ МАГАЗИНА — REACT + EXPRESS + SQLITE
========================================================================

1. ТРЕБОВАНИЯ К ОКРУЖЕНИЮ
- Node.js версии 24.x (включает встроенный модуль node:sqlite)
- Проверка версии в терминале:
    node -v
    npm -v (или npm.cmd -v)

2. СЕРВЕР — ПЕРВЫЙ ТЕРМИНАЛ (из папки store-practice)
    cd server
    npm install
    npm start

Сервер запустится на http://localhost:3001
База данных SQLite (store.db) создаётся в папке server автоматически.
В ней уже содержатся актуальные тестовые данные после прохождения сценариев проверки.
Проверка API: http://localhost:3001/api/products

3. КЛИЕНТ (REACT + VITE) — ВТОРОЙ ТЕРМИНАЛ (из папки store-practice)
    cd client
    npm install
    npm run dev

Интерфейс откроется по адресу: http://localhost:5173
Терминал оставьте работающим.

4. СТРУКТУРА ПРОЕКТА
store-practice/
├── server/
│   ├── package.json        (express, cors, команда start)
│   ├── server.js           (REST API, валидация, SQL-запросы к SQLite)
│   └── store.db            (база данных SQLite с таблицей products)
├── client/
│   ├── package.json        (react, react-dom, vite)
│   ├── index.html          (входная страница)
│   └── src/
│       ├── main.jsx        (точка входа React)
│       ├── App.jsx         (компонент: форма, таблица, итоговые метрики, фильтры)
│       └── App.css         (стилизация приложения)
├── screenshots/            (скриншоты выполнения сценариев проверки)
├── README.txt              (данная инструкция)
└── REPORT.md               (отчёт о тестировании 14 сценариев и ответы на вопросы)

5. ЭНДПОИНТЫ API
- GET    /api/products      — получить все товары (сортировка по id убыванию)
- POST   /api/products      — добавить новый товар
- PUT    /api/products/:id  — обновить существующий товар
- DELETE /api/products/:id  — удалить товар по ID

Формат тела запроса (JSON):
{
  "name": "Беспроводная мышь",
  "category": "Аксессуары",
  "price": 700,
  "quantity": 10
}
