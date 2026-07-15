import { buildImageUrl } from './api.js';
import { addToHistory } from './history.js';
import { showToast } from './utils.js';

export async function generateImage(prompt, settings, onStart, onSuccess, onError) {
  if (!prompt.trim()) {
    showToast('Please enter a prompt', true);
    return;
  }
  if (!settings.apiKey) {
    showToast('Please enter your API key', true);
    return;
  }

  onStart?.();

  const url = buildImageUrl(prompt, settings);

  const img = new Image();
  img.crossOrigin = 'anonymous';
  try {
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = url;
    });

    const imageUrl = url;
    onSuccess?.(imageUrl, prompt, settings);

    addToHistory({
      prompt,
      model: settings.model,
      url: imageUrl,
      width: settings.width,
      height: settings.height,
      seed: settings.seed || 'random',
      transparent: settings.transparent
    });

    showToast('Image generated!');
    return imageUrl;
  } catch (err) {
    showToast('Generation failed. Check your API key or model.', true);
    onError?.(err);
    throw err;
  }
}
