const STORAGE_KEY = 'gamecatalog-v2';
const CART_KEY = 'gamecatalog-cart';

export function loadDatabase(initial) {
  try {
    localStorage.removeItem('gamecatalog-v1');
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
}

export function saveDatabase(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    return true;
  } catch {
    return false;
  }
}
