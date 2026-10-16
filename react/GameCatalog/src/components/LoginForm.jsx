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
    <div className="auth-container">
      <h2>Account Login</h2>
      {notice && <div className="msg-text">{notice}</div>}
      {error && <div className="error-text">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-block">Sign In</button>
      </form>
      <div className="switch-box">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToRegister}>Register</button>
      </div>
    </div>
  );
}
