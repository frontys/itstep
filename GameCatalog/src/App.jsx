import { useState } from 'react';
import initialDatabase from './data/database.json';
import { loadDatabase, saveDatabase, loadCart, saveCart } from './utils/storage.js';
import RegisterForm from './components/RegisterForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import GameCatalog from './components/GameCatalog.jsx';
import AddGameForm from './components/AddGameForm.jsx';
import CartView from './components/CartView.jsx';

export default function App() {
  const [database, setDatabase] = useState(() => loadDatabase(initialDatabase));
  const [cart, setCart] = useState(() => loadCart());
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

  function updateCartState(nextCart) {
    setCart(nextCart);
    saveCart(nextCart);
  }

  function handleAddToCart(game) {
    const existingIndex = cart.findIndex(item => item.id === game.id);
    let nextCart;
    if (existingIndex >= 0) {
      nextCart = cart.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      nextCart = [
        ...cart,
        {
          id: game.id,
          title: game.title,
          price: game.price,
          image: game.image,
          genre: game.genre,
          publisher: game.publisher,
          quantity: 1,
        },
      ];
    }
    updateCartState(nextCart);
  }

  function handleUpdateQuantity(id, delta) {
    const nextCart = cart
      .map(item => {
        if (item.id === id) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      })
      .filter(Boolean);
    updateCartState(nextCart);
  }

  function handleRemoveFromCart(id) {
    const nextCart = cart.filter(item => item.id !== id);
    updateCartState(nextCart);
  }

  function handleCheckout() {
    updateCartState([]);
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

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <header className="topbar">
        <div className="brand" onClick={() => setPage('catalog')} style={{ cursor: 'pointer' }}>
          GameStore
        </div>
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
            <button
              type="button"
              className={`btn-cart ${page === 'cart' ? 'nav-active' : ''}`}
              onClick={() => setPage('cart')}
            >
              Cart {totalCartCount > 0 && <span className="cart-badge">{totalCartCount}</span>}
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
          <GameCatalog
            games={database.games}
            cart={cart}
            onAddToCart={handleAddToCart}
          />
        ) : page === 'add' ? (
          <AddGameForm onAddGame={handleAddGame} />
        ) : (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckout}
            onGoToCatalog={() => setPage('catalog')}
          />
        )}
      </main>
    </div>
  );
}
