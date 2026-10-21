import React, { useState } from 'react';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        repeatPassword: ''
    });
    const [error, setError] = useState('');
    const [busy, setBusy] = useState(false);

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        if (form.password.length < 6) {
            setError('Пароль должен содержать не менее 6 символов');
            return;
        }

        if (form.password !== form.repeatPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setBusy(true);
        try {
            await onRegister(form.name, form.email, form.password);
        } catch (err) {
            setError(err.message || 'Ошибка регистрации');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="auth-box">
            <h1>Регистрация</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="reg-name">Имя пользователя</label>
                    <input
                        id="reg-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        maxLength={50}
                        placeholder="Например, alex"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-email">Электронная почта</label>
                    <input
                        id="reg-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="name@example.com"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-password">Пароль</label>
                    <input
                        id="reg-password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        maxLength={128}
                        placeholder="••••••"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="reg-repeat">Повтор пароля</label>
                    <input
                        id="reg-repeat"
                        name="repeatPassword"
                        type="password"
                        value={form.repeatPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                        maxLength={128}
                        placeholder="••••••"
                    />
                </div>
                <button type="submit" className="btn-primary btn-submit" disabled={busy}>
                    {busy ? 'Регистрация…' : 'Зарегистрироваться'}
                </button>
            </form>
            <button type="button" className="btn-switch" onClick={onSwitchToLogin}>
                Уже есть аккаунт? Войти
            </button>
        </div>
    );
}
