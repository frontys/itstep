import { useState } from 'react';

export default function LoginForm({ onLogin, notice, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const err = onLogin(email, password);
    if (err) setError(err);
  }

  return (
    <div className="auth-box">
      <h3>Login</h3>
      {notice && <p className="msg">{notice}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Sign In</button>
      </form>
      <p style={{ marginTop: '10px', fontSize: '13px' }}>
        No account?{' '}
        <button type="button" onClick={onSwitchToRegister}>Register</button>
      </p>
    </div>
  );
}
