import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/api/products';

// Общая функция отправляет запрос и проверяет ответ сервера
async function sendRequest(url, options) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || 'Ошибка запроса к серверу');
    }
    return data;
}

export default function App() {
    // Основные состояния
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    // Дополнительные состояния (поиск и фильтрация)
    const [searchTerm, setSearchTerm] = useState('');
    const [onlyOutOfStock, setOnlyOutOfStock] = useState(false);

    async function loadProducts() {
        const data = await sendRequest(API_URL);
        setProducts(data);
    }

    useEffect(() => {
        loadProducts()
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    function clearForm() {
        setName('');
        setCategory('');
        setPrice('');
        setQuantity('');
        setEditingId(null);
    }

    function startEditing(product) {
        setName(product.name);
        setCategory(product.category);
        setPrice(String(product.price));
        setQuantity(String(product.quantity));
        setEditingId(product.id);
        setError('');
    }

    async function saveProduct(event) {
        event.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('Введите название товара');
            return;
        }
        if (!category.trim()) {
            setError('Введите категорию товара');
            return;
        }
        const parsedPrice = Number(price);
        if (!price.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
            setError('Цена должна быть числом не меньше нуля');
            return;
        }
        const parsedQuantity = Number(quantity);
        if (!quantity.trim() || !Number.isSafeInteger(parsedQuantity) || parsedQuantity < 0) {
            setError('Количество должно быть целым числом не меньше нуля');
            return;
        }

        setBusy(true);
        try {
            const url = editingId === null ? API_URL : `${API_URL}/${editingId}`;
            await sendRequest(url, {
                method: editingId === null ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    category: category.trim(),
                    price: parsedPrice,
                    quantity: parsedQuantity
                })
            });
            clearForm();
            await loadProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    async function deleteProduct(id) {
        if (!window.confirm('Удалить этот товар?')) return;
        setBusy(true);
        setError('');
        try {
            await sendRequest(`${API_URL}/${id}`, { method: 'DELETE' });
            if (editingId === id) clearForm();
            await loadProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    // Итоговые показатели по всему складу
    const totalUnits = products.reduce((acc, p) => acc + p.quantity, 0);
    const totalValuation = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);

    // Фильтрация товаров для отображения в таблице
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStock = onlyOutOfStock ? product.quantity === 0 : true;
        return matchesSearch && matchesStock;
    });

    return (
        <main className="container">
            <header className="header">
                <h1>Учёт товаров магазина</h1>
                <p className="description">React + Express + SQLite</p>
            </header>

            {error && (
                <div className="error" role="alert">
                    {error}. Проверьте, запущен ли сервер.
                </div>
            )}

            {/* Карточки сводки склада */}
            <section className="summary-grid">
                <div className="summary-card">
                    <span className="summary-label">Всего позиций</span>
                    <strong className="summary-value">{products.length}</strong>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Общий остаток</span>
                    <strong className="summary-value">{totalUnits} шт</strong>
                </div>
                <div className="summary-card">
                    <span className="summary-label">Стоимость склада</span>
                    <strong className="summary-value">{totalValuation.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} грн</strong>
                </div>
            </section>

            {/* Форма добавления и редактирования */}
            <section className="card">
                <h2>{editingId === null ? 'Добавление товара' : 'Редактирование товара'}</h2>
                <form onSubmit={saveProduct}>
                    <fieldset disabled={busy || loading}>
                        <div className="form-grid">
                            <div>
                                <label htmlFor="name">Название товара</label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Например, Беспроводная мышь"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="category">Категория</label>
                                <input
                                    id="category"
                                    type="text"
                                    placeholder="Например, Аксессуары"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="price">Цена, грн</label>
                                <input
                                    id="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="quantity">Остаток на складе, шт</label>
                                <input
                                    id="quantity"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="0"
                                    value={quantity}
                                    onChange={e => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="actions">
                            <button type="submit">
                                {busy ? 'Подождите...' : editingId === null ? 'Добавить товар' : 'Сохранить изменения'}
                            </button>
                            {editingId !== null && (
                                <button type="button" className="secondary" onClick={clearForm}>
                                    Отмена
                                </button>
                            )}
                        </div>
                    </fieldset>
                </form>
            </section>

            {/* Таблица товаров и фильтры */}
            <section className="card">
                <div className="table-header">
                    <h2>Список товаров: {filteredProducts.length}{filteredProducts.length !== products.length && ` (из ${products.length})`}</h2>
                    <div className="filters">
                        <input
                            type="search"
                            className="search-input"
                            placeholder="Поиск по названию или категории..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={onlyOutOfStock}
                                onChange={e => setOnlyOutOfStock(e.target.checked)}
                            />
                            <span>Только нет в наличии (0 шт)</span>
                        </label>
                    </div>
                </div>

                {loading ? (
                    <p className="loading-state">Загрузка...</p>
                ) : products.length === 0 ? (
                    <p className="empty-state">Товаров пока нет. Добавьте первый товар.</p>
                ) : filteredProducts.length === 0 ? (
                    <p className="empty-state">По вашему запросу ничего не найдено.</p>
                ) : (
                    <div className="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Название</th>
                                    <th>Категория</th>
                                    <th>Цена</th>
                                    <th>Остаток</th>
                                    <th>Стоимость остатка</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => {
                                    const itemValuation = product.price * product.quantity;
                                    const isOutOfStock = product.quantity === 0;
                                    return (
                                        <tr key={product.id} className={isOutOfStock ? 'row-out-of-stock' : ''}>
                                            <td><strong>#{product.id}</strong></td>
                                            <td>{product.name}</td>
                                            <td>
                                                <span className="badge category-badge">{product.category}</span>
                                            </td>
                                            <td>{product.price.toFixed(2)} грн</td>
                                            <td>
                                                <span className={`badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}`}>
                                                    {product.quantity} шт
                                                </span>
                                            </td>
                                            <td>{itemValuation.toFixed(2)} грн</td>
                                            <td>
                                                <div className="actions">
                                                    <button
                                                        type="button"
                                                        className="secondary"
                                                        disabled={busy}
                                                        onClick={() => startEditing(product)}
                                                    >
                                                        Изменить
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="danger"
                                                        disabled={busy}
                                                        onClick={() => deleteProduct(product.id)}
                                                    >
                                                        Удалить
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}
