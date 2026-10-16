import { useState } from 'react';

export default function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.repeatPassword) {
      setError('Passwords do not match');
      return;
    }
    const err = onRegister(form);
    if (err) setError(err);
  }

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      {error && <div className="error-text">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Username</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label>Confirm Password</label>
          <input name="repeatPassword" type="password" value={form.repeatPassword} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn-block">Register</button>
      </form>
      <div className="switch-box">
        Already registered?{' '}
        <button type="button" onClick={onSwitchToLogin}>Sign in</button>
      </div>
    </div>
  );
}
