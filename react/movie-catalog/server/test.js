process.env.MOVIES_DB = ':memory:';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { app, db } = require('./server');

test('Личный каталог фильмов: Auth, CRUD, изоляция пользователей, валидация', async () => {
    const server = app.listen(0, '127.0.0.1');
    await new Promise(r => server.once('listening', r));
    const url = `http://127.0.0.1:${server.address().port}/api`;

    async function call(address, method = 'GET', body, cookie = '') {
        const r = await fetch(url + address, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'X-Movie-App': '1',
                Cookie: cookie
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
        const text = await r.text();
        let data = null;
        try { data = JSON.parse(text); } catch { data = text; }
        return {
            status: r.status,
            data,
            cookie: r.headers.get('set-cookie')?.split(';')[0]
        };
    }

    try {
        assert.equal((await call('/movies')).status, 401);
        assert.equal((await call('/movies', 'POST', { title: 'Test', genre: 'Драма', release_year: 2020, watched: false })).status, 401);

        assert.equal((await call('/auth/register', 'POST', { username: 'x', password: '123' })).status, 400);

        const regA = await call('/auth/register', 'POST', { username: 'alice', password: 'password123' });
        assert.equal(regA.status, 201);
        assert.equal(regA.data.username, 'alice');
        const cookieA = regA.cookie;

        assert.equal((await call('/auth/me', 'GET', undefined, cookieA)).data.username, 'alice');
        assert.deepEqual((await call('/movies', 'GET', undefined, cookieA)).data, []);

        assert.equal((await call('/auth/register', 'POST', { username: 'ALICE', password: 'password123' })).status, 409);

        assert.equal((await call('/auth/login', 'POST', { username: 'alice', password: 'wrongpassword' })).status, 401);

        const loginA = await call('/auth/login', 'POST', { username: 'alice', password: 'password123' });
        assert.equal(loginA.status, 200);
        const cookieA2 = loginA.cookie;

        const moviesToAdd = [
            { title: 'Интерстеллар', genre: 'Фантастика', release_year: 2014, watched: false },
            { title: 'Шрек', genre: 'Мультфильм', release_year: 2001, watched: true },
            { title: 'Начало', genre: 'Фантастика', release_year: 2010, watched: false },
            { title: 'Один дома', genre: 'Комедия', release_year: 1990, watched: true },
            { title: 'Гладиатор', genre: 'Боевик', release_year: 2000, watched: false }
        ];

        const createdMovies = [];
        for (const m of moviesToAdd) {
            const res = await call('/movies', 'POST', m, cookieA2);
            assert.equal(res.status, 201);
            createdMovies.push(res.data);
        }

        const listA = (await call('/movies', 'GET', undefined, cookieA2)).data;
        assert.equal(listA.length, 5);
        const watchedCount = listA.filter(m => m.watched).length;
        const unwatchedCount = listA.filter(m => !m.watched).length;
        assert.equal(watchedCount, 2);
        assert.equal(unwatchedCount, 3);

        const firstMovie = listA.find(m => m.title === 'Интерстеллар');
        const editRes = await call(`/movies/${firstMovie.id}`, 'PUT', {
            title: 'Интерстеллар (IMAX)',
            genre: 'Фантастика',
            release_year: 2014,
            watched: true
        }, cookieA2);
        assert.equal(editRes.status, 200);

        const updatedList = (await call('/movies', 'GET', undefined, cookieA2)).data;
        const updatedItem = updatedList.find(m => m.id === firstMovie.id);
        assert.equal(updatedItem.title, 'Интерстеллар (IMAX)');
        assert.equal(updatedItem.watched, true);

        assert.equal((await call('/movies', 'POST', { title: '   ', genre: 'Комедия', release_year: 2020, watched: false }, cookieA2)).status, 400);
        assert.equal((await call('/movies', 'POST', { title: 'Фильм', genre: 'Комедия', release_year: 2020.5, watched: false }, cookieA2)).status, 400);
        assert.equal((await call('/movies', 'POST', { title: 'Фильм', genre: 'НесуществующийЖанр', release_year: 2020, watched: false }, cookieA2)).status, 400);

        const regB = await call('/auth/register', 'POST', { username: 'boris', password: 'password123' });
        assert.equal(regB.status, 201);
        const cookieB = regB.cookie;

        assert.deepEqual((await call('/movies', 'GET', undefined, cookieB)).data, []);

        assert.equal((await call(`/movies/${firstMovie.id}`, 'PUT', {
            title: 'Взлом',
            genre: 'Драма',
            release_year: 2020,
            watched: true
        }, cookieB)).status, 404);

        assert.equal((await call(`/movies/${firstMovie.id}`, 'DELETE', undefined, cookieB)).status, 404);

        const delRes = await call(`/movies/${firstMovie.id}`, 'DELETE', undefined, cookieA2);
        assert.equal(delRes.status, 200);
        const afterDelList = (await call('/movies', 'GET', undefined, cookieA2)).data;
        assert.equal(afterDelList.length, 4);

        await call('/auth/logout', 'POST', undefined, cookieA2);
        assert.equal((await call('/movies', 'GET', undefined, cookieA2)).status, 401);

        const badOrigin = await fetch(url + '/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Movie-App': '1',
                Origin: 'https://evil.attacker.com'
            },
            body: JSON.stringify({ username: 'boris', password: 'password123' })
        });
        assert.equal(badOrigin.status, 403);

    } finally {
        await new Promise(r => server.close(r));
        db.close();
    }
});
