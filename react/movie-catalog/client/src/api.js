const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.includes('github.io');

const MOCK_STORAGE_KEY = 'movie-catalog-demo-data';

function getMockData() {
    try {
        const raw = localStorage.getItem(MOCK_STORAGE_KEY);
        if (raw) return JSON.parse(raw);
    } catch {}
    const initial = {
        user: { id: 1, username: 'demo_user' },
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
        const data = getMockData();
        if (address === '/auth/me') {
            if (!data.user) {
                const err = new Error('Необходимо войти в аккаунт');
                err.status = 401;
                throw err;
            }
            return data.user;
        }
        if (address === '/auth/login' || address === '/auth/register') {
            data.user = { id: 1, username: body.username.trim().toLowerCase() };
            saveMockData(data);
            return data.user;
        }
        if (address === '/auth/logout') {
            data.user = null;
            saveMockData(data);
            return { message: 'Вы вышли из аккаунта' };
        }
        if (address === '/movies') {
            if (method === 'GET') {
                return [...data.movies];
            }
            if (method === 'POST') {
                const newId = data.movies.length > 0 ? Math.max(...data.movies.map(m => m.id)) + 1 : 1;
                const newMovie = { id: newId, ...body };
                data.movies = [newMovie, ...data.movies];
                saveMockData(data);
                return newMovie;
            }
        }
        if (address.startsWith('/movies/')) {
            const id = Number(address.split('/').pop());
            if (method === 'PUT') {
                data.movies = data.movies.map(m => m.id === id ? { ...m, ...body } : m);
                saveMockData(data);
                return { message: 'Фильм изменен' };
            }
            if (method === 'DELETE') {
                data.movies = data.movies.filter(m => m.id !== id);
                saveMockData(data);
                return { message: 'Фильм удален' };
            }
        }
    }

    let response;
    try {
        response = await fetch(`http://localhost:3001/api${address}`, {
            method,
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-Movie-App': '1'
            },
            body: body === undefined ? undefined : JSON.stringify(body)
        });
    } catch {
        throw new Error('Нет связи с сервером. Проверьте, запущен ли server.');
    }

    const resData = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(resData.message || 'Ошибка запроса');
        error.status = response.status;
        throw error;
    }
    return resData;
}
