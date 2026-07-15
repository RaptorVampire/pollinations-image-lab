import { STORAGE_KEYS, MAX_HISTORY } from './config.js';

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
  } catch {
    return [];
  }
}

export function addToHistory(item) {
  const history = getHistory();
  history.unshift({ ...item, id: Date.now(), timestamp: Date.now() });
  if (history.length > MAX_HISTORY) history.pop();
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.HISTORY);
}

export function deleteHistoryItem(id) {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
}
