import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildImageUrl, fetchAvailableModels, resolveModelId } from '../js/modules/api.js';
import { applySettingsToForm } from '../js/modules/settings.js';

const models = [
  { id: 'another/image-model', aliases: [] },
  { id: 'black-forest-labs/flux.1-schnell', aliases: ['flux'] },
];

test('retains catalog aliases without duplicating dropdown models', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify([
    { name: models[0].id },
    { name: models[1].id, aliases: ['flux'] },
    { id: 'owner/community-image', aliases: [] },
    {},
  ])));
  assert.deepEqual(await fetchAvailableModels(), [
    ...models,
    { id: 'owner/community-image', aliases: [] },
  ]);
});

test('resolves saved and history IDs before and after the rename', () => {
  assert.equal(resolveModelId(models, 'flux'), models[1].id);
  assert.equal(resolveModelId(models, models[1].id), models[1].id);
  assert.equal(resolveModelId([{ id: 'flux', aliases: [models[1].id] }], 'flux'), 'flux');
  assert.equal(resolveModelId([{ id: 'flux', aliases: [models[1].id] }], models[1].id), 'flux');
  assert.equal(resolveModelId(models, 'unknown'), undefined);
  assert.equal(resolveModelId([], 'flux'), undefined);
});

test('prefers an exact ID over an alias collision', () => {
  assert.equal(resolveModelId([
    { id: 'owner/image', aliases: ['flux'] },
    { id: 'flux', aliases: [] },
  ], 'flux'), 'flux');
});

test('restoring settings selects the matching alias instead of the first model', () => {
  const select = { options: models.map(m => ({ value: m.id })), value: '' };
  const apiKey = {}, width = {}, height = {}, seed = {};
  const transparent = { classList: { toggle() {} } };
  applySettingsToForm({ model: 'flux' }, models, select, apiKey, width, height, seed, transparent);
  assert.equal(select.value, models[1].id);
  applySettingsToForm({ model: 'removed-model' }, models, select, apiKey, width, height, seed, transparent);
  assert.equal(select.value, models[0].id);
});

test('generation URLs preserve and encode publisher-qualified model IDs', () => {
  const url = new URL(buildImageUrl('a cat', { model: models[1].id, apiKey: 'test-key' }));
  assert.equal(url.searchParams.get('model'), models[1].id);
  assert.equal(url.searchParams.get('key'), 'test-key');
});
