// Сервер: учёт товаров магазина (Express + SQLite)
const express = require('express');
const cors = require('cors');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// База данных создаётся в папке server
const database = new DatabaseSync(path.join(__dirname, 'store.db'));

database.exec(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    quantity INTEGER NOT NULL CHECK(quantity >= 0)
)`);

function validateProduct(product) {
    if (typeof product.name !== 'string' || !product.name.trim()) {
        return 'Введите название товара';
    }
    if (typeof product.category !== 'string' || !product.category.trim()) {
        return 'Введите категорию товара';
    }
    if (typeof product.price !== 'number' || !Number.isFinite(product.price) || product.price < 0) {
        return 'Цена должна быть числом не меньше нуля';
    }
    if (typeof product.quantity !== 'number' || !Number.isSafeInteger(product.quantity) || product.quantity < 0) {
        return 'Количество должно быть целым числом не меньше нуля';
    }
    return '';
}

// 1. Получение списка всех товаров
app.get('/api/products', (request, response) => {
    const products = database.prepare('SELECT * FROM products ORDER BY id DESC').all();
    response.json(products);
});

// 2. Добавление нового товара
app.post('/api/products', (request, response) => {
    const product = request.body || {};
    const error = validateProduct(product);
    if (error) {
        return response.status(400).json({ message: error });
    }

    const result = database.prepare(
        'INSERT INTO products (name, category, price, quantity) VALUES (?, ?, ?, ?)'
    ).run(product.name.trim(), product.category.trim(), product.price, product.quantity);

    response.status(201).json({ id: Number(result.lastInsertRowid) });
});

// 3. Редактирование товара
app.put('/api/products/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return response.status(400).json({ message: 'Некорректный ID' });
    }

    const product = request.body || {};
    const error = validateProduct(product);
    if (error) {
        return response.status(400).json({ message: error });
    }

    const result = database.prepare(
        'UPDATE products SET name = ?, category = ?, price = ?, quantity = ? WHERE id = ?'
    ).run(product.name.trim(), product.category.trim(), product.price, product.quantity, id);

    if (!Number(result.changes)) {
        return response.status(404).json({ message: 'Товар не найден' });
    }

    response.json({ message: 'Товар изменен' });
});

// 4. Удаление товара
app.delete('/api/products/:id', (request, response) => {
    const id = Number(request.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return response.status(400).json({ message: 'Некорректный ID' });
    }

    const result = database.prepare('DELETE FROM products WHERE id = ?').run(id);

    if (!Number(result.changes)) {
        return response.status(404).json({ message: 'Товар не найден' });
    }

    response.json({ message: 'Товар удален' });
});

// Обработка ошибок (включая невалидный JSON)
app.use((error, request, response, next) => {
    console.error(error);
    response.status(error.type === 'entity.parse.failed' ? 400 : 500)
        .json({ message: error.type === 'entity.parse.failed' ? 'Некорректный JSON' : 'Ошибка сервера' });
});

app.listen(3001, 'localhost', () => {
    console.log('Сервер запущен: http://localhost:3001/api/products');
});
