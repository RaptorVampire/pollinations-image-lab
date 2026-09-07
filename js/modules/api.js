export async function fetchAvailableModels() {
  const res = await fetch('https://gen.pollinations.ai/image/models');

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid response format');
  }

  return data.map(m => ({ id: m.name || m.id, aliases: m.aliases || [] })).filter(m => m.id);
}

export function resolveModelId(models, id) {
  return models.find(m => m.id === id)?.id
    || models.find(m => m.aliases.includes(id))?.id;
}

export function buildImageUrl(prompt, settings) {
  const params = new URLSearchParams();

  params.set('model', settings.model || 'flux');
  params.set('key', settings.apiKey);

  if (settings.width) {
    params.set('width', settings.width);
  }

  if (settings.height) {
    params.set('height', settings.height);
  }

  if (settings.seed) {
    params.set('seed', settings.seed);
  }

  if (settings.transparent) {
    params.set('transparent', 'true');
  }

  return `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params.toString()}`;
}
