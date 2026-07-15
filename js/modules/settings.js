import { STORAGE_KEYS, DEFAULT_SETTINGS } from './config.js';

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

export function applySettingsToForm(settings, modelSelect, apiKeyInput, widthInput, heightInput, seedInput, transparentToggle) {
  apiKeyInput.value = settings.apiKey || '';
  if (modelSelect.options.length > 0) {
    const found = Array.from(modelSelect.options).some(opt => opt.value === settings.model);
    modelSelect.value = found ? settings.model : modelSelect.options[0]?.value || '';
  }
  widthInput.value = settings.width || 1024;
  heightInput.value = settings.height || 1024;
  seedInput.value = settings.seed || '';
  transparentToggle.classList.toggle('active', !!settings.transparent);
}

export function gatherFormSettings(apiKeyInput, modelSelect, widthInput, heightInput, seedInput, transparentToggle) {
  return {
    apiKey: apiKeyInput.value.trim(),
    model: modelSelect.value,
    width: parseInt(widthInput.value) || 1024,
    height: parseInt(heightInput.value) || 1024,
    seed: seedInput.value.trim() || '',
    transparent: transparentToggle.classList.contains('active')
  };
}
