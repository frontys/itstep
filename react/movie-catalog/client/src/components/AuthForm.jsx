import React, { useState } from 'react';
import { api } from '../api';

export default function AuthForm({ onAuth }) {
    const [register, setRegister] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    async function submit(event) {
        event.preventDefault();
        setError('');

        if (password.length < 8) {
            setError('Пароль должен содержать не менее 8 символов');
            return;
        }

        if (register && password !== confirm) {
            setError('Пароли не совпадают');
            return;
        }

        setBusy(true);
        try {
            const endpoint = register ? '/auth/register' : '/auth/login';
            const user = await api(endpoint, 'POST', { username, password });
            onAuth(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="auth-box">
            <h1>{register ? 'Регистрация' : 'Вход'}</h1>

            <form onSubmit={submit}>
                <div className="form-group">
                    <label htmlFor="username">Логин</label>
                    <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        minLength={3}
                        maxLength={30}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Пароль</label>
                    <input
                        id="password"
                        type="password"
                        autoComplete={register ? 'new-password' : 'current-password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        minLength={8}
                        maxLength={128}
                    />
                </div>

                {register && (
                    <div className="form-group">
                        <label htmlFor="confirm">Повтор пароля</label>
                        <input
                            id="confirm"
                            type="password"
                            autoComplete="new-password"
                            value={confirm}
                            onChange={e => setConfirm(e.target.value)}
                            required
                            minLength={8}
                            maxLength={128}
                        />
                    </div>
                )}

                {error && <p className="error">{error}</p>}

                <button className="btn-primary btn-submit" type="submit" disabled={busy}>
                    {busy ? 'Загрузка…' : register ? 'Зарегистрироваться' : 'Войти'}
                </button>

                <button
                    className="btn-switch"
                    type="button"
                    onClick={() => {
                        setRegister(!register);
                        setError('');
                        setPassword('');
                        setConfirm('');
                    }}
                >
                    {register ? 'Есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
                </button>
            </form>
        </div>
    );
}
