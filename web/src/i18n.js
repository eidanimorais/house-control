import portuguese from '../../locales/pt-BR.json' with { type: 'json' };

// The native shell and web UI use the same locale and catalog. Unknown messages
// keep their English source text, so untranslated screens remain usable.
export function resolveLocale(language = 'en') {
  return /^pt(?:[-_]|$)/i.test(language) ? 'pt-BR' : 'en';
}

export const locale = resolveLocale(globalThis.window?.__HOUSE_BOOT__?.locale
  || globalThis.navigator?.language || 'en');

export function translate(message, values = {}, language = locale) {
  const text = resolveLocale(language) === 'pt-BR' ? portuguese[message] ?? message : message;
  return text.replace(/\{(\w+)\}/g, (token, key) => Object.hasOwn(values, key) ? String(values[key]) : token);
}

export const t = translate;

// Call only for bundled demos. Custom plans and real-device names bypass this.
export function localizeBundledPlan(raw, language = locale) {
  const plan = structuredClone(raw);
  plan.name = translate(plan.name, {}, language);
  for (const group of ['rooms', 'lights', 'acs', 'scenes']) {
    for (const item of plan[group] || []) item.name = translate(item.name, {}, language);
  }
  return plan;
}

if (globalThis.document) document.documentElement.lang = locale;
