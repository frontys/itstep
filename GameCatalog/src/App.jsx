import { useState } from 'react';
import initialDatabase from './data/database.json';
import { loadDatabase, saveDatabase } from './utils/storage.js';
import RegisterForm from './components/RegisterForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import GameCatalog from './components/GameCatalog.jsx';
import AddGameForm from './components/AddGameForm.jsx';

export default function App() {
  const [database, setDatabase] = useState(() => loadDatabase(initialDatabase));
  const [currentUser, setCurrentUser] = useState(null);
  const [authView, setAuthView] = useState('register');
  const [page, setPage] = useState('catalog');
  const [notice, setNotice] = useState('');

  function saveAndSet(nextDb) {
    const ok = saveDatabase(nextDb);
    if (ok) {
      setDatabase(nextDb);
      return true;
    }
    return false;
  }

  function handleRegister(form) {
    const emailNormalized = form.email.trim().toLowerCase();
    const exists = database.users.some(
      u => u.email.trim().toLowerCase() === emailNormalized
    );

    if (exists) {
      return 'User with this email already exists.';
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: form.name.trim(),
      email: emailNormalized,
      password: form.password,
    };

    const nextDb = {
      ...database,
      users: [...database.users, newUser],
    };

    if (!saveAndSet(nextDb)) {
      return 'Failed to save account.';
    }

    setNotice('Registration successful! Please log in.');
    setAuthView('login');
    return '';
  }

  function handleLogin(email, password) {
    const emailNormalized = email.trim().toLowerCase();
    const user = database.users.find(
      u => u.email.trim().toLowerCase() === emailNormalized && u.password === password
    );

    if (!user) {
      return 'Invalid email or password.';
    }

    setCurrentUser(user);
    setPage('catalog');
    setNotice('');
    return '';
  }

  function handleLogout() {
    setCurrentUser(null);
    setAuthView('login');
    setPage('catalog');
    setNotice('');
  }

  function handleAddGame(newGame) {
    const nextDb = {
      ...database,
      games: [...database.games, newGame],
    };

    if (!saveAndSet(nextDb)) {
      return 'Failed to save game to storage.';
    }

    setPage('catalog');
    return '';
  }

  return (
    <div>
      <header className="topbar">
        <div className="brand">GameStore</div>
        {currentUser && (
          <div className="user-panel">
            <button
              type="button"
              className={page === 'catalog' ? 'nav-active' : ''}
              onClick={() => setPage('catalog')}
            >
              Catalog
            </button>
            <button
              type="button"
              className={page === 'add' ? 'nav-active' : ''}
              onClick={() => setPage('add')}
            >
              Add Game
            </button>
            <span>User: {currentUser.name}</span>
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
        ) : page === 'catalog' ? (
          <GameCatalog games={database.games} />
        ) : (
          <AddGameForm onAddGame={handleAddGame} />
        )}
      </main>
    </div>
  );
}
