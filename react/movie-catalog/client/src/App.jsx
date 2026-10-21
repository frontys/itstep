import React, { useState } from 'react';
import { api } from './api';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import MovieList from './components/MovieList';

export default function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        try {
            const saved = localStorage.getItem('movie-catalog-user');
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [authView, setAuthView] = useState('login');
    const [notice, setNotice] = useState('');

    async function handleRegister(name, email, password) {
        await api('/auth/register', 'POST', {
            username: name,
            email,
            password
        });
        setNotice('Регистрация успешна! Теперь выполните вход.');
        setAuthView('login');
    }

    async function handleLogin(email, password) {
        const user = await api('/auth/login', 'POST', {
            email,
            password
        });
        setCurrentUser(user);
        try {
            localStorage.setItem('movie-catalog-user', JSON.stringify(user));
        } catch {}
        setNotice('');
    }

    function handleLogout() {
        setCurrentUser(null);
        try {
            localStorage.removeItem('movie-catalog-user');
        } catch {}
        setAuthView('login');
        setNotice('');
    }

    return (
        <main className="shell">
            {currentUser ? (
                <MovieList user={currentUser} onLogout={handleLogout} />
            ) : authView === 'register' ? (
                <RegisterForm
                    onRegister={handleRegister}
                    onSwitchToLogin={() => {
                        setAuthView('login');
                        setNotice('');
                    }}
                />
            ) : (
                <LoginForm
                    notice={notice}
                    onLogin={handleLogin}
                    onSwitchToRegister={() => {
                        setAuthView('register');
                        setNotice('');
                    }}
                />
            )}
        </main>
    );
}
