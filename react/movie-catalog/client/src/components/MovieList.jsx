import React, { useEffect, useState } from 'react';
import { api } from '../api';

const GENRES = ['Фантастика', 'Комедия', 'Драма', 'Боевик', 'Мультфильм', 'Другое'];

export default function MovieList({ user, onLogout }) {
    const [movies, setMovies] = useState([]);
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState(GENRES[0]);
    const [releaseYear, setReleaseYear] = useState('');
    const [watched, setWatched] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('Все');
    const [statusFilter, setStatusFilter] = useState('Все');

    function handleError(err) {
        if (err.status === 401) onLogout();
        else setError(err.message);
    }

    async function loadMovies() {
        const data = await api('/movies');
        setMovies(data);
    }

    useEffect(() => {
        loadMovies()
            .catch(handleError)
            .finally(() => setLoading(false));
    }, []);

    function clearForm() {
        setTitle('');
        setGenre(GENRES[0]);
        setReleaseYear('');
        setWatched(false);
        setEditingId(null);
    }

    function startEditing(movie) {
        setTitle(movie.title);
        setGenre(movie.genre);
        setReleaseYear(String(movie.release_year));
        setWatched(Boolean(movie.watched));
        setEditingId(movie.id);
        setError('');
        const input = document.getElementById('movie-title');
        if (input) input.focus();
    }

    async function saveMovie(event) {
        event.preventDefault();
        setError('');

        const trimmedTitle = title.trim();
        if (!trimmedTitle || trimmedTitle.length > 150) {
            setError('Введите название фильма (от 1 до 150 символов)');
            return;
        }

        const year = Number(releaseYear);
        const currentYear = new Date().getFullYear();
        if (!Number.isSafeInteger(year) || year < 1888 || year > currentYear) {
            setError(`Год выпуска должен быть целым числом от 1888 до ${currentYear}`);
            return;
        }

        setBusy(true);
        try {
            const payload = {
                title: trimmedTitle,
                genre,
                release_year: year,
                watched: Boolean(watched)
            };

            if (editingId === null) {
                await api('/movies', 'POST', payload);
            } else {
                await api(`/movies/${editingId}`, 'PUT', payload);
            }

            clearForm();
            await loadMovies();
        } catch (err) {
            handleError(err);
        } finally {
            setBusy(false);
        }
    }

    async function deleteMovie(movie) {
        if (!window.confirm(`Удалить фильм „${movie.title}“?`)) return;

        setBusy(true);
        setError('');
        try {
            await api(`/movies/${movie.id}`, 'DELETE');
            if (editingId === movie.id) clearForm();
            await loadMovies();
        } catch (err) {
            handleError(err);
        } finally {
            setBusy(false);
        }
    }

    async function logout() {
        setBusy(true);
        setError('');
        try {
            await api('/auth/logout', 'POST');
            onLogout();
        } catch (err) {
            handleError(err);
        } finally {
            setBusy(false);
        }
    }

    const totalCount = movies.length;
    const watchedCount = movies.filter(m => m.watched).length;
    const unwatchedCount = totalCount - watchedCount;

    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGenre = genreFilter === 'Все' || movie.genre === genreFilter;
        const matchesStatus =
            statusFilter === 'Все'
                ? true
                : statusFilter === 'Просмотренные'
                ? movie.watched
                : !movie.watched;
        return matchesSearch && matchesGenre && matchesStatus;
    });

    const currentYear = new Date().getFullYear();

    return (
        <div>
            <header className="top-bar">
                <div>
                    <h1>Личный каталог фильмов</h1>
                    <span className="user-sub">Вы вошли как: <strong>{user.username}</strong></span>
                </div>
                <button className="btn-logout" disabled={busy} onClick={logout}>
                    Выйти
                </button>
            </header>

            <section className="block">
                <h2>{editingId === null ? 'Добавить фильм' : 'Редактирование фильма'}</h2>
                <form onSubmit={saveMovie}>
                    <div className="form-fields">
                        <div className="field-title">
                            <label htmlFor="movie-title">Название фильма</label>
                            <input
                                id="movie-title"
                                type="text"
                                placeholder="Интерстеллар"
                                value={title}
                                maxLength={150}
                                required
                                onChange={e => setTitle(e.target.value)}
                            />
                        </div>

                        <div>
                            <label htmlFor="movie-genre">Жанр</label>
                            <select
                                id="movie-genre"
                                value={genre}
                                onChange={e => setGenre(e.target.value)}
                            >
                                {GENRES.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label htmlFor="movie-year">Год выпуска</label>
                            <input
                                id="movie-year"
                                type="number"
                                min={1888}
                                max={currentYear}
                                placeholder={String(currentYear)}
                                value={releaseYear}
                                required
                                onChange={e => setReleaseYear(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-check">
                        <label>
                            <input
                                type="checkbox"
                                checked={watched}
                                onChange={e => setWatched(e.target.checked)}
                            />
                            Уже просмотрен
                        </label>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <div className="form-buttons">
                        <button className="btn-primary" type="submit" disabled={busy}>
                            {editingId === null ? 'Добавить фильм' : 'Сохранить изменения'}
                        </button>
                        {editingId !== null && (
                            <button
                                className="btn-secondary"
                                type="button"
                                disabled={busy}
                                onClick={clearForm}
                            >
                                Отмена
                            </button>
                        )}
                    </div>
                </form>
            </section>

            <section className="block">
                <div className="catalog-header">
                    <h2>Каталог</h2>
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Поиск по названию..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
                            <option value="Все">Все жанры</option>
                            {GENRES.map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="Все">Все статусы</option>
                            <option value="Просмотренные">Просмотренные</option>
                            <option value="Не просмотренные">Не просмотренные</option>
                        </select>
                    </div>
                </div>

                <div className="stats-line">
                    Всего фильмов: <strong>{totalCount}</strong> | Просмотрено: <strong>{watchedCount}</strong> | Осталось посмотреть: <strong>{unwatchedCount}</strong>
                </div>

                {loading ? (
                    <p className="empty-info">Загрузка фильмов…</p>
                ) : movies.length === 0 ? (
                    <p className="empty-info">Ваш каталог пуст. Добавьте первый фильм.</p>
                ) : filteredMovies.length === 0 ? (
                    <p className="empty-info">Ничего не найдено по фильтрам.</p>
                ) : (
                    <table className="movies-table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Жанр</th>
                                <th>Год</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMovies.map(movie => (
                                <tr key={movie.id}>
                                    <td><strong>{movie.title}</strong></td>
                                    <td>{movie.genre}</td>
                                    <td>{movie.release_year}</td>
                                    <td>{movie.watched ? 'Просмотрен' : 'Не просмотрен'}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="btn-sm btn-secondary"
                                            disabled={busy}
                                            onClick={() => startEditing(movie)}
                                        >
                                            Изменить
                                        </button>
                                        {' '}
                                        <button
                                            type="button"
                                            className="btn-sm btn-danger"
                                            disabled={busy}
                                            onClick={() => deleteMovie(movie)}
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}
