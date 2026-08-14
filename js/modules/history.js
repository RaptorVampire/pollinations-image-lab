import { STORAGE_KEYS, MAX_HISTORY } from './config.js';

let lastId = 0;

function isLocalStorageAvailable() {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function generateId() {
  const now = Date.now();
  lastId = now > lastId ? now : lastId + 1;
  return lastId;
}

export function getHistory() {
  if (!isLocalStorageAvailable()) {
    return [];
  }
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addToHistory(item) {
  if (!isLocalStorageAvailable()) {
    return null;
  }
  try {
    const history = getHistory();
    const newItem = {
      ...item,
      id: generateId(),
      timestamp: Date.now(),
    };
    history.unshift(newItem);
    if (history.length > MAX_HISTORY) {
      history.length = MAX_HISTORY;
    }
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return newItem;
  } catch {
    return null;
  }
}

export function clearHistory() {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  } catch {
    return false;
  }
}

export function deleteHistoryItem(id) {
  if (!isLocalStorageAvailable()) {
    return false;
  }
  try {
    const history = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
}
