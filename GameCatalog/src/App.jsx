import { useState } from 'react';
import initialDatabase from './data/database.json';
import { loadDatabase, saveDatabase } from './utils/storage.js';
import RegisterForm from './components/RegisterForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import GameCatalog from './components/GameCatalog.jsx';

export default function App() {
  const [database, setDatabase] = useState(() => loadDatabase(initialDatabase));
  const [currentUser, setCurrentUser] = useState(null);
  const [authTab, setAuthTab] = useState('register');
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

    setNotice('Registered! Please login.');
    setAuthTab('login');
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
    setAuthTab('login');
    setNotice('');
  }

  return (
    <div>
      <div className="header">
        <h1>Game Catalog</h1>
        {currentUser && (
          <nav>
            <span>User: {currentUser.name}</span>
            <button type="button" onClick={handleLogout}>Logout</button>
          </nav>
        )}
      </div>

      <main>
        {!currentUser ? (
          <div>
            {authTab === 'register' ? (
              <RegisterForm
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthTab('login')}
              />
            ) : (
              <LoginForm
                onLogin={handleLogin}
                notice={notice}
                onSwitchToRegister={() => setAuthTab('register')}
              />
            )}
          </div>
        ) : (
          <GameCatalog games={database.games} />
        )}
      </main>
    </div>
  );
}
