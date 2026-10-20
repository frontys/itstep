import React, { useEffect, useState } from 'react';
import { api } from './api';
import AuthForm from './components/AuthForm';
import MovieList from './components/MovieList';

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    async function checkSession() {
        setLoading(true);
        setError('');
        try {
            const currentUser = await api('/auth/me');
            setUser(currentUser);
        } catch (err) {
            if (err.status !== 401) {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkSession();
    }, []);

    if (loading) {
        return (
            <main className="shell">
                <div className="loader-box">
                    <p>Проверяем вход…</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="shell">
                <div className="card error-card">
                    <p role="alert" className="error">{error}</p>
                    <button className="primary-btn" onClick={checkSession}>Повторить</button>
                </div>
            </main>
        );
    }

    return (
        <main className="shell">
            {user ? (
                <MovieList user={user} onLogout={() => setUser(null)} />
            ) : (
                <AuthForm onAuth={setUser} />
            )}
        </main>
    );
}
