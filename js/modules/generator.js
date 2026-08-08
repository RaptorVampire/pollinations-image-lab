import { buildImageUrl } from './api.js';
import { addToHistory } from './history.js';
import { showToast } from './utils.js';

/**
 * Enhances a short user prompt so the image model
 * follows the requested scene more accurately.
 */
function enhancePrompt(prompt) {
  const cleanPrompt = prompt.trim();

  return `
Create an image that follows the user's request exactly.

USER REQUEST:
${cleanPrompt}

IMPORTANT INSTRUCTIONS:
- Make the user's requested subject the main focus.
- Follow every important object, person, action, location, and style mentioned.
- Do not replace the requested subject with an unrelated subject.
- Keep the composition natural and visually coherent.
- If the user specifies a number of people or objects, follow that number.
- If a cultural setting is requested, accurately reflect that culture.
- Make important objects clearly visible.
- Use realistic details, natural lighting, accurate proportions, and high visual quality.
- Do not add unnecessary objects or scenes that conflict with the request.
- The final image should closely match the user's original prompt.

Create only the requested image.
`.trim();
}

export async function generateImage(
  prompt,
  settings,
  onStart,
  onSuccess,
  onError
) {
  if (!prompt.trim()) {
    showToast('Please enter a prompt.', true);
    return;
  }

  if (!settings.apiKey) {
    showToast('Please enter your API key.', true);
    return;
  }

  onStart?.();

  try {
    const enhancedPrompt = enhancePrompt(prompt);

    const url = buildImageUrl(enhancedPrompt, settings);

    const img = new Image();
    img.crossOrigin = 'anonymous';

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
