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
    <div className="auth-box">
      <h3>Register</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email:
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password:
          <input name="password" type="password" value={form.password} onChange={handleChange} required />
        </label>
        <label>
          Repeat Password:
          <input name="repeatPassword" type="password" value={form.repeatPassword} onChange={handleChange} required />
        </label>
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ marginTop: '10px', fontSize: '13px' }}>
        Already have account?{' '}
        <button type="button" onClick={onSwitchToLogin}>Login</button>
      </p>
    </div>
  );
}
