import { useState } from 'react';
import initialDatabase from './data/database.json';
import { loadDatabase, saveDatabase } from './utils/storage.js';
import RegisterForm from './components/RegisterForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import GameCatalog from './components/GameCatalog.jsx';

export default function App() {
  const [database, setDatabase] = useState(() => loadDatabase(initialDatabase));
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('register');
  const [notice, setNotice] = useState('');

  function saveAndSet(nextDb) {
    saveDatabase(nextDb);
    setDatabase(nextDb);
  }

  function handleRegister(form) {
    const exists = database.users.some(
      u => u.email.toLowerCase() === form.email.trim().toLowerCase()
    );
    if (exists) {
      return 'Email already registered';
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    };

    saveAndSet({
      ...database,
      users: [...database.users, newUser],
    });

    setNotice('Registered successfully. Please login.');
    setAuthView('login');
    return '';
  }

  function handleLogin(email, password) {
    const user = database.users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      return 'Wrong email or password';
    }
    setCurrentUser(user);
    setNotice('');
    return '';
  }

  function handleLogout() {
    setCurrentUser(null);
    setAuthView('login');
    setNotice('');
  }

  return (
    <div>
      <header className="topbar">
        <div className="brand">🎮 GameStore</div>
        {currentUser && (
          <div className="user-panel">
            <span>👤 {currentUser.name}</span>
            <button type="button" onClick={handleLogout}>Log out</button>
          </div>
        )}
      </header>

      <main className="main-content">
        {!currentUser ? (
          authView === 'register' ? (
            <RegisterForm
              onRegister={handleRegister}
              onSwitchToLogin={() => {
                setAuthView('login');
                setNotice('');
              }}
            />
          ) : (
            <LoginForm
              onLogin={handleLogin}
              notice={notice}
              onSwitchToRegister={() => {
                setAuthView('register');
                setNotice('');
              }}
            />
          )
        ) : (
          <GameCatalog games={database.games} />
        )}
      </main>
    </div>
  );
}
