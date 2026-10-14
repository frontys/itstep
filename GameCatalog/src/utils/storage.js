const STORAGE_KEY = 'gamecatalog-v2';

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
