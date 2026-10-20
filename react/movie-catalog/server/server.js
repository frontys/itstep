const express = require('express');
const cors = require('cors');
const path = require('node:path');
const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { DatabaseSync } = require('node:sqlite');

const scrypt = promisify(crypto.scrypt);
const app = express();
const origin = 'http://localhost:5173';
const db = new DatabaseSync(process.env.MOVIES_DB || path.join(__dirname, 'movies.db'));

db.exec(`PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 150),
    genre TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    watched INTEGER NOT NULL DEFAULT 0 CHECK(watched IN (0,1))
);
CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
);`);

app.use(cors({ origin, credentials: true }));
app.use(express.json({ limit: '16kb' }));

app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (!['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        if ((req.headers.origin && req.headers.origin !== origin) || req.get('X-Movie-App') !== '1') {
            return res.status(403).json({ message: 'Недопустимый источник запроса' });
        }
    }
    next();
});

const cookieOptions = { httpOnly: true, sameSite: 'strict', path: '/', secure: false };

function tokenHash(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function readToken(req) {
    const part = (req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith('movie_session='));
    return part ? part.slice('movie_session='.length) : '';
}

function createSession(req, res, userId) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ? OR expires_at <= ?').run(tokenHash(readToken(req)), Date.now());
    const token = crypto.randomBytes(32).toString('hex');
    const lifetime = 7 * 24 * 60 * 60 * 1000;
    db.prepare('INSERT INTO sessions VALUES (?, ?, ?)').run(tokenHash(token), userId, Date.now() + lifetime);
    res.cookie('movie_session', token, { ...cookieOptions, maxAge: lifetime });
}

function requireAuth(req, res, next) {
    const token = readToken(req);
    const user = db.prepare(`SELECT users.id, users.username FROM sessions JOIN users ON users.id = sessions.user_id WHERE token_hash = ? AND expires_at > ?`).get(tokenHash(token), Date.now());
    if (!token || !user) {
        return res.status(401).json({ message: 'Необходимо войти в аккаунт' });
    }
    req.user = user;
    next();
}

function credentials(body) {
    const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password = body?.password;
    if (!/^[a-z0-9_]{3,30}$/.test(username)) {
        return { error: 'Логин: 3–30 латинских букв, цифр или _' };
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
        return { error: 'Пароль: от 8 до 128 символов' };
    }
    return { username, password };
}

const ALLOWED_GENRES = ['Фантастика', 'Комедия', 'Драма', 'Боевик', 'Мультфильм', 'Другое'];

function validateMovie(body) {
    if (typeof body?.title !== 'string' || body.title.trim().length === 0 || body.title.trim().length > 150) {
        return 'Введите название фильма (от 1 до 150 символов)';
    }
    if (typeof body?.genre !== 'string' || !ALLOWED_GENRES.includes(body.genre.trim())) {
        return 'Выберите корректный жанр из списка';
    }
    const currentYear = new Date().getFullYear();
    const year = body?.release_year;
    if (typeof year !== 'number' || !Number.isSafeInteger(year) || year < 1888 || year > currentYear) {
        return `Год выпуска должен быть целым числом от 1888 до ${currentYear}`;
    }
    if (typeof body?.watched !== 'boolean') {
        return 'Статус просмотра должен быть логическим значением';
    }
    return '';
}

const attempts = new Map();
function authLimit(req, res, next) {
    const now = Date.now();
    for (const [key, val] of attempts) {
        if (val.until <= now) attempts.delete(key);
    }
    const key = req.ip;
    const val = attempts.get(key) || { count: 0, until: now + 60000 };
    attempts.set(key, val);
    val.count++;
    if (val.count > 20) {
        return res.status(429).json({ message: 'Слишком много попыток. Подождите минуту.' });
    }
    next();
}

app.post('/api/auth/register', authLimit, async (req, res) => {
    const data = credentials(req.body);
    if (data.error) return res.status(400).json({ message: data.error });
    if (db.prepare('SELECT id FROM users WHERE username = ?').get(data.username)) {
        return res.status(409).json({ message: 'Логин уже занят' });
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = await scrypt(data.password, salt, 64);
    if (db.prepare('SELECT id FROM users WHERE username = ?').get(data.username)) {
        return res.status(409).json({ message: 'Логин уже занят' });
    }
    const result = db.prepare('INSERT INTO users(username, salt, password_hash) VALUES(?, ?, ?)').run(data.username, salt, hash.toString('hex'));
    const user = { id: Number(result.lastInsertRowid), username: data.username };
    createSession(req, res, user.id);
    res.status(201).json(user);
});

app.post('/api/auth/login', authLimit, async (req, res) => {
    const data = credentials(req.body);
    if (data.error) return res.status(400).json({ message: data.error });
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(data.username);
    const hash = await scrypt(data.password, user?.salt || 'dummy-salt-for-missing-user', 64);
    if (!user || !crypto.timingSafeEqual(hash, Buffer.from(user.password_hash, 'hex'))) {
        return res.status(401).json({ message: 'Неверный логин или пароль' });
    }
    createSession(req, res, user.id);
    res.json({ id: user.id, username: user.username });
});

app.get('/api/auth/me', requireAuth, (req, res) => res.json(req.user));

app.post('/api/auth/logout', (req, res) => {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(readToken(req)));
    res.clearCookie('movie_session', cookieOptions);
    res.json({ message: 'Вы вышли из аккаунта' });
});

app.use('/api/movies', requireAuth);

app.get('/api/movies', (req, res) => {
    const rows = db.prepare('SELECT id, title, genre, release_year, watched FROM movies WHERE user_id = ? ORDER BY id DESC').all(req.user.id);
    const formatted = rows.map(r => ({
        id: r.id,
        title: r.title,
        genre: r.genre,
        release_year: r.release_year,
        watched: Boolean(r.watched)
    }));
    res.json(formatted);
});

app.post('/api/movies', (req, res) => {
    const error = validateMovie(req.body);
    if (error) return res.status(400).json({ message: error });
    const result = db.prepare('INSERT INTO movies(user_id, title, genre, release_year, watched) VALUES(?, ?, ?, ?, ?)').run(
        req.user.id,
        req.body.title.trim(),
        req.body.genre.trim(),
        req.body.release_year,
        Number(req.body.watched)
    );
    res.status(201).json({
        id: Number(result.lastInsertRowid),
        title: req.body.title.trim(),
        genre: req.body.genre.trim(),
        release_year: req.body.release_year,
        watched: req.body.watched
    });
});

app.put('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'Некорректный ID' });
    }
    const error = validateMovie(req.body);
    if (error) return res.status(400).json({ message: error });
    const result = db.prepare('UPDATE movies SET title = ?, genre = ?, release_year = ?, watched = ? WHERE id = ? AND user_id = ?').run(
        req.body.title.trim(),
        req.body.genre.trim(),
        req.body.release_year,
        Number(req.body.watched),
        id,
        req.user.id
    );
    if (!Number(result.changes)) {
        return res.status(404).json({ message: 'Фильм не найден' });
    }
    res.json({ message: 'Фильм изменен' });
});

app.delete('/api/movies/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'Некорректный ID' });
    }
    const result = db.prepare('DELETE FROM movies WHERE id = ? AND user_id = ?').run(id, req.user.id);
    if (!Number(result.changes)) {
        return res.status(404).json({ message: 'Фильм не найден' });
    }
    res.json({ message: 'Фильм удален' });
});

app.use('/api', (req, res) => res.status(404).json({ message: 'Адрес API не найден' }));

app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.status === 400 ? 400 : error.status === 413 ? 413 : 500)
        .json({ message: error.status === 400 ? 'Некорректный JSON' : error.status === 413 ? 'Слишком большой запрос' : 'Ошибка сервера' });
});

if (require.main === module) {
    app.listen(3001, 'localhost', () => console.log('Сервер: http://localhost:3001'));
}

module.exports = { app, db };
