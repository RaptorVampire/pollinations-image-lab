import { loadSettings, saveSettings, applySettingsToForm, gatherFormSettings } from './modules/settings.js';
import { fetchAvailableModels } from './modules/api.js';
import { generateImage } from './modules/generator.js';
import { getHistory, clearHistory, deleteHistoryItem } from './modules/history.js';
import { showToast, copyText, escapeHTML, getTimeAgo } from './modules/utils.js';
import { togglePanel, closeAllPanels, openModal, closeModal } from './modules/ui.js';

const promptInput = document.getElementById('promptInput');
const generateBtn = document.getElementById('generateBtn');
const btnText = document.getElementById('btnText');
const btnSpinner = document.getElementById('btnSpinner');
const resultCard = document.getElementById('resultCard');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const copyUrlBtn = document.getElementById('copyUrlBtn');
const settingsBtn = document.getElementById('settingsBtn');
const historyBtn = document.getElementById('historyBtn');
const historyCount = document.getElementById('historyCount');
const settingsPanel = document.getElementById('settingsPanel');
const historyPanel = document.getElementById('historyPanel');
const closeSettings = document.getElementById('closeSettings');
const closeHistory = document.getElementById('closeHistory');
const overlayBg = document.getElementById('overlayBg');
const apiKeyInput = document.getElementById('apiKeyInput');
const modelSelect = document.getElementById('modelSelect');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const seedInput = document.getElementById('seedInput');
const showKeyToggle = document.getElementById('showKeyToggle');
const transparentToggle = document.getElementById('transparentToggle');
const saveSettingsBtn = document.getElementById('saveSettingsBtn');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');
const emptyHistory = document.getElementById('emptyHistory');
const apiKeyModal = document.getElementById('apiKeyModal');
const modalApiKeyInput = document.getElementById('modalApiKeyInput');
const modalSaveKey = document.getElementById('modalSaveKey');
const modalSkip = document.getElementById('modalSkip');
const modelLoading = document.getElementById('modelLoading');
const refreshModelsBtn = document.getElementById('refreshModelsBtn');
const imageDetailModal = document.getElementById('imageDetailModal');
const detailPrompt = document.getElementById('detailPrompt');
const detailImage = document.getElementById('detailImage');
const detailDownloadBtn = document.getElementById('detailDownloadBtn');
const detailCopyPromptBtn = document.getElementById('detailCopyPromptBtn');
const closeDetailModal = document.getElementById('closeDetailModal');

let currentImageUrl = '';
let generating = false;
let availableModels = [];

function updateBadge() {
  const count = getHistory().length;
  historyCount.textContent = count;
  historyCount.style.display = count ? 'block' : 'none';
}

function populateModelSelect(models) {
  modelSelect.innerHTML = models.length === 0
    ? '<option value="">no models available</option>'
    : models.map(m => `<option value="${m}">${m}</option>`).join('');
}

function renderHistory() {
  const history = getHistory();
  historyList.innerHTML = '';
  if (history.length === 0) {
    emptyHistory.style.display = 'block';
    return;
  }
  emptyHistory.style.display = 'none';
  history.forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    const timeAgo = getTimeAgo(item.timestamp || item.id);
    div.innerHTML = `
      <img class="history-thumb" src="${item.url}" alt="" loading="lazy">
      <div class="history-details">
        <div class="history-prompt">${escapeHTML(item.prompt)}</div>
        <div class="history-meta"><span>${item.model}</span><span>${item.width}×${item.height}</span><span>${timeAgo}</span></div>
      </div>
      <div class="history-actions">
        <button class="reuse-btn" title="Reuse">&#x21bb;</button>
        <button class="delete-btn" title="Delete">&#x2715;</button>
      </div>
    `;
    div.addEventListener('click', (e) => {
      if (e.target.closest('.reuse-btn') || e.target.closest('.delete-btn')) return;
      openImageDetail(item);
    });
    div.querySelector('.reuse-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      promptInput.value = item.prompt;
      const settings = loadSettings();
      if (availableModels.includes(item.model)) settings.model = item.model;
      settings.width = item.width;
      settings.height = item.height;
      if (item.seed && item.seed !== 'random') settings.seed = item.seed;
      else settings.seed = '';
      settings.transparent = item.transparent || false;
      saveSettings(settings);
      applySettingsToForm(settings, modelSelect, apiKeyInput, widthInput, heightInput, seedInput, transparentToggle);
      closeAllPanels([settingsPanel, historyPanel], overlayBg);
      showToast('settings applied');
    });
    div.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteHistoryItem(item.id);
      updateBadge();
      renderHistory();
      showToast('removed');
    });
    historyList.appendChild(div);
  });
}

function openImageDetail(item) {
  detailPrompt.textContent = item.prompt;
  detailImage.src = item.url;
  imageDetailModal._item = item;
  openModal(imageDetailModal, overlayBg);
}
function closeImageDetail() {
  closeModal(imageDetailModal, overlayBg);
}

async function handleGenerate() {
  if (generating) return;
  const settings = loadSettings();
  const prompt = promptInput.value.trim();

  generating = true;
  generateBtn.disabled = true;
  btnText.style.display = 'none';
  btnSpinner.style.display = 'inline-block';
  resultCard.style.display = 'none';

  try {
    await generateImage(
      prompt,
      settings,
      () => {},
      (url, prompt, settings) => {
        currentImageUrl = url;
        resultImage.src = url;
        resultCard.style.display = 'block';
        resultCard.style.animation = 'none';
        resultCard.offsetHeight;
        resultCard.style.animation = 'fadeSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        updateBadge();
        renderHistory();
        spawnConfetti();
      },
      () => {}
    );
  } catch (err) {
  } finally {
    generating = false;
    generateBtn.disabled = false;
    btnText.style.display = 'inline';
    btnSpinner.style.display = 'none';
  }
}

function spawnConfetti() {
  const colors = ['#d946ef','#a21caf','#f0abfc','#facc15','#22c55e','#ef4444'];
  for (let i=0; i<50; i++) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;width:7px;height:7px;background:${colors[Math.floor(Math.random()*colors.length)]};left:${Math.random()*100}%;top:-10px;border-radius:2px;z-index:999;pointer-events:none;animation:confettiFall ${Math.random()*2+2}s ease-out forwards;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }
  if (!document.getElementById('confettiStyle')) {
    const s = document.createElement('style');
    s.id = 'confettiStyle';
    s.textContent = '@keyframes confettiFall{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(720deg);opacity:0}}';
    document.head.appendChild(s);
  }
}

async function loadModels() {
  modelLoading.textContent = 'loading models...';
  modelLoading.style.color = 'var(--text2)';
  refreshModelsBtn.disabled = true;
  try {
    const models = await fetchAvailableModels();
    availableModels = models;
    populateModelSelect(models);
    modelLoading.textContent = `${models.length} models loaded`;
    modelLoading.style.color = 'var(--success)';
    const settings = loadSettings();
    if (models.includes(settings.model)) modelSelect.value = settings.model;
    else if (models.length) modelSelect.value = models[0];
  } catch (err) {
    availableModels = [];
    modelLoading.textContent = 'Failed to load models. Tap refresh to retry.';
    modelLoading.style.color = '#ef4444';
    showToast('Failed to load models. Check your connection.', true);
  } finally {
    refreshModelsBtn.disabled = false;
  }
}

function init() {
  loadModels();
  const settings = loadSettings();
  applySettingsToForm(settings, modelSelect, apiKeyInput, widthInput, heightInput, seedInput, transparentToggle);
  updateBadge();

  if (!settings.apiKey) {
    openModal(apiKeyModal, overlayBg);
  }

  generateBtn.addEventListener('click', handleGenerate);
  promptInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleGenerate(); } });

  downloadBtn.addEventListener('click', async () => {
    if (!currentImageUrl) return;
    try {
      const blob = await fetch(currentImageUrl).then(r => r.blob());
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `polli-${Date.now()}.png`;
      a.click();
      showToast('downloaded');
    } catch { showToast('download failed', true); }
  });

  copyUrlBtn.addEventListener('click', async () => {
    if (!currentImageUrl) return;
    const ok = await copyText(currentImageUrl);
    showToast(ok ? 'url copied' : 'copy failed', !ok);
  });

  settingsBtn.addEventListener('click', () => {
    if (settingsPanel.classList.contains('open')) closeAllPanels([settingsPanel, historyPanel], overlayBg);
    else { applySettingsToForm(loadSettings(), modelSelect, apiKeyInput, widthInput, heightInput, seedInput, transparentToggle); togglePanel(settingsPanel, overlayBg, true); }
  });
  historyBtn.addEventListener('click', () => {
    if (historyPanel.classList.contains('open')) closeAllPanels([settingsPanel, historyPanel], overlayBg);
    else { renderHistory(); togglePanel(historyPanel, overlayBg, true); }
  });
  closeSettings.addEventListener('click', () => closeAllPanels([settingsPanel, historyPanel], overlayBg));
  closeHistory.addEventListener('click', () => closeAllPanels([settingsPanel, historyPanel], overlayBg));
  overlayBg.addEventListener('click', () => closeAllPanels([settingsPanel, historyPanel], overlayBg));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAllPanels([settingsPanel, historyPanel], overlayBg); closeModal(apiKeyModal, overlayBg); closeModal(imageDetailModal, overlayBg); } });

  saveSettingsBtn.addEventListener('click', () => {
    const selectedModel = modelSelect.value;
    if (!selectedModel || selectedModel === '') {
      showToast('please select a model first', true);
      return;
    }
    const s = gatherFormSettings(apiKeyInput, modelSelect, widthInput, heightInput, seedInput, transparentToggle);
    saveSettings(s);
    showToast('settings saved');
    closeAllPanels([settingsPanel, historyPanel], overlayBg);
  });
  clearHistoryBtn.addEventListener('click', () => { if (confirm('Delete all history?')) { clearHistory(); updateBadge(); renderHistory(); showToast('history cleared'); } });

  showKeyToggle.addEventListener('click', () => {
    const active = showKeyToggle.classList.toggle('active');
    apiKeyInput.type = active ? 'text' : 'password';
  });
  transparentToggle.addEventListener('click', () => transparentToggle.classList.toggle('active'));

  modalSaveKey.addEventListener('click', () => {
    const key = modalApiKeyInput.value.trim();
    if (key) {
      const s = loadSettings();
      s.apiKey = key;
      saveSettings(s);
      applySettingsToForm(s, modelSelect, apiKeyInput, widthInput, heightInput, seedInput, transparentToggle);
      closeModal(apiKeyModal, overlayBg);
      showToast('key saved');
    }
  });
  modalSkip.addEventListener('click', () => closeModal(apiKeyModal, overlayBg));

  refreshModelsBtn.addEventListener('click', loadModels);

  closeDetailModal.addEventListener('click', closeImageDetail);
  detailDownloadBtn.addEventListener('click', () => {
    const item = imageDetailModal._item;
    if (!item || !item.url) return;
    fetch(item.url).then(r => r.blob()).then(blob => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `polli-${Date.now()}.png`;
      a.click();
      showToast('downloaded');
    }).catch(() => showToast('download failed', true));
  });
  detailCopyPromptBtn.addEventListener('click', async () => {
    const item = imageDetailModal._item;
    if (item && item.prompt) {
      const ok = await copyText(item.prompt);
      showToast(ok ? 'prompt copied' : 'copy failed', !ok);
    }
  });

  createParticles();
}

function createParticles() {
  const container = document.getElementById('particles');
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 7 + 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = -(Math.random() * 25 + 10) + 'px';
    p.style.animationDuration = (Math.random() * 12 + 18) + 's';
    p.style.animationDelay = Math.random() * 15 + 's';
    container.appendChild(p);
  }
}

init();
