const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

const MOCK_STORAGE_KEY = 'movie-catalog-demo-data';

function getMockData() {
    try {
        const raw = localStorage.getItem(MOCK_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    const initial = {
        users: [
            { id: 1, username: 'admin', email: 'admin@mail.com', password: 'password123' }
        ],
        movies: [
            { id: 1, title: 'Интерстеллар', genre: 'Фантастика', release_year: 2014, watched: false },
            { id: 2, title: 'Шрек', genre: 'Мультфильм', release_year: 2001, watched: true },
            { id: 3, title: 'Начало', genre: 'Фантастика', release_year: 2010, watched: false },
            { id: 4, title: 'Один дома', genre: 'Комедия', release_year: 1990, watched: true },
            { id: 5, title: 'Гладиатор', genre: 'Боевик', release_year: 2000, watched: false }
        ]
    };
    try { localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initial)); } catch {}
    return initial;
}

function saveMockData(data) {
    try { localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export async function api(address, method = 'GET', body) {
    if (isGitHubPages) {
        let store = getMockData();
        if (address === '/auth/register') {
            const email = body.email.trim().toLowerCase();
            if (store.users.some(u => u.email.toLowerCase() === email)) {
                const err = new Error('Пользователь с таким email уже зарегистрирован');
                err.status = 409;
                throw err;
            }
            const newUser = {
                id: store.users.length + 1,
                username: body.username.trim(),
                email,
                password: body.password
            };
            store.users.push(newUser);
            saveMockData(store);
            return { id: newUser.id, username: newUser.username, email: newUser.email };
        }
        if (address === '/auth/login') {
            const loginId = body.email.trim().toLowerCase();
            const user = store.users.find(u =>
                (u.email.toLowerCase() === loginId || u.username.toLowerCase() === loginId) &&
                u.password === body.password
            );
            if (!user) {
                const err = new Error('Неверный email или пароль');
                err.status = 401;
                throw err;
            }
            return { id: user.id, username: user.username, email: user.email };
        }
        if (address === '/movies') {
            if (method === 'GET') {
                return [...store.movies];
            }
            if (method === 'POST') {
                const newId = store.movies.length > 0 ? Math.max(...store.movies.map(m => m.id)) + 1 : 1;
                const newMovie = { id: newId, ...body };
                store.movies = [newMovie, ...store.movies];
                saveMockData(store);
                return newMovie;
            }
        }
        if (address.startsWith('/movies/')) {
            const id = Number(address.split('/').pop());
            if (method === 'PUT') {
                store.movies = store.movies.map(m => m.id === id ? { ...m, ...body } : m);
                saveMockData(store);
                return { message: 'Фильм изменен' };
            }
            if (method === 'DELETE') {
                store.movies = store.movies.filter(m => m.id !== id);
                saveMockData(store);
                return { message: 'Фильм удален' };
            }
        }
    }

    let response;
    try {
        response = await fetch(`http://127.0.0.1:8000/api${address}`, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new Error('Нет связи с сервером. Запустите backend (FastAPI на порту 8000).');
    }

    if (response.status === 204) {
        return null;
    }

    const resData = await response.json().catch(() => ({}));
    if (!response.ok) {
        const detail = typeof resData.detail === 'string' ? resData.detail : (resData.message || 'Ошибка запроса');
        const error = new Error(detail);
        error.status = response.status;
        throw error;
    }
    return resData;
}
