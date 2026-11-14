import { test } from 'node:test';
import assert from 'node:assert/strict';
import portuguese from '../../locales/pt-BR.json' with { type: 'json' };
import { resolveLocale, translate, localizeBundledPlan } from './i18n.js';

test('Portuguese language tags resolve to pt-BR and other languages keep English', () => {
  for (const language of ['pt', 'pt-BR', 'pt-PT', 'PT_br']) assert.equal(resolveLocale(language), 'pt-BR');
  for (const language of ['en', 'en-US', 'es', '']) assert.equal(resolveLocale(language), 'en');
});

test('English fallback and values preserve user-provided names', () => {
  assert.equal(translate('Settings…', {}, 'pt-BR'), 'Ajustes…');
  assert.equal(translate('Settings…', {}, 'en'), 'Settings…');
  assert.equal(translate('Untranslated message', {}, 'pt-BR'), 'Untranslated message');
  assert.equal(translate('{name} settings', { name: 'Home <script>' }, 'pt-BR'), 'Ajustes de Home <script>');
  assert.equal(translate('{name} settings', {}, 'pt-BR'), 'Ajustes de {name}');
});

test('every translation keeps the source placeholders', () => {
  const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  for (const [source, translation] of Object.entries(portuguese)) {
    assert.ok(translation.trim(), source);
    assert.deepEqual(placeholders(translation), placeholders(source), source);
  }
});

test('light counts handle zero, singular and plural', () => {
  assert.equal(translate('No lights on', {}, 'pt-BR'), 'Nenhuma luz acesa');
  assert.equal(translate('{count} of {total} light on', { count: 1, total: 1 }, 'pt-BR'), '1 de 1 luz acesa');
  assert.equal(translate('{count} of {total} lights on', { count: 2, total: 4 }, 'pt-BR'), '2 de 4 luzes acesas');
});

test('demo labels change without mutating the original plan, IDs or device links', () => {
  const raw = { name: 'Home', rooms: [{ id: 'living', name: 'Living' }], lights: [{ id: 'living.main', name: 'Ceiling', link: { service: 'hue', id: 'abc' } }] };
  const plan = localizeBundledPlan(raw, 'pt-BR');
  assert.equal(raw.name, 'Home');
  assert.equal(plan.name, 'Casa');
  assert.equal(plan.rooms[0].name, 'Sala de estar');
  assert.equal(plan.lights[0].name, 'Luz de teto');
  assert.equal(plan.lights[0].id, raw.lights[0].id);
  assert.deepEqual(plan.lights[0].link, raw.lights[0].link);
  assert.deepEqual(localizeBundledPlan(raw, 'en'), raw);
});
