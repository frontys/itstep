import React, { useState } from 'react';

export default function LoginForm({ onLogin, notice, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setBusy(true);
        try {
            await onLogin(email, password);
        } catch (err) {
            setError(err.message || 'Ошибка входа');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="auth-box">
            <h1>Вход в каталог</h1>
            {notice && <div className="notice-msg">{notice}</div>}
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="login-email">Email или логин</label>
                    <input
                        id="login-email"
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="name@example.com или логин"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="login-password">Пароль</label>
                    <input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="••••••"
                    />
                </div>
                <button type="submit" className="btn-primary btn-submit" disabled={busy}>
                    {busy ? 'Вход…' : 'Войти'}
                </button>
            </form>
            <button type="button" className="btn-switch" onClick={onSwitchToRegister}>
                Нет аккаунта? Зарегистрироваться
            </button>
        </div>
    );
}
