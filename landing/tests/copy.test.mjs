import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Reads a landing file (path relative to landing/) as text.
export const read = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');

test('WhatsApp only appears as the contact field of the registration form', () => {
  const allowed = /f-whatsapp|err-whatsapp|>WhatsApp<\/label>/;
  const html = read('index.html')
    .split('\n')
    .filter((line) => !allowed.test(line))
    .join('\n');
  assert.doesNotMatch(html, /whatsapp/i);
  assert.doesNotMatch(html, /\bMeta\b/);
  assert.doesNotMatch(html, /n[uú]meros? autorizados?/i);
});

test('privacy page keeps the contact-field line but drops the WhatsApp/Meta disclaimer', () => {
  const html = read('privacidad.html');
  assert.match(html, /tu número de WhatsApp/);
  assert.doesNotMatch(html, /Sin afiliación con WhatsApp ni Meta/);
});

test('install promise is gone', () => {
  const html = read('index.html');
  assert.doesNotMatch(html, /Nada que instalar/);
  assert.doesNotMatch(html, /Nadie instala nada/);
  assert.doesNotMatch(html, /sin aplicaciones/i);
  assert.match(html, /app de WoKiToKi/);
});

test('security FAQ is hedged like its Diseñado status', () => {
  assert.doesNotMatch(read('index.html'), /Nadie más tiene cómo enviarle mensajes/);
});

test('pricing page states the approved price model', () => {
  const html = read('pricing/index.html');
  for (const text of ['$350.000', '$30.000', 'primer mes', '8 familiares', '30 días', 'ilimitados', '$1.000',
    'Precios de referencia. WoKiToKi aún no está a la venta.']) {
    assert.ok(html.includes(text), `missing: ${text}`);
  }
  assert.match(html, /cancela cuando quieras/i);
  assert.match(html, /sin suscripci[oó]n/i);
});

test('pricing page is a demo page that links back to the landing', () => {
  const html = read('pricing/index.html');
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.match(html, /href="\.\.\/#registro"/);
  assert.match(html, /href="\.\.\/"/);
});

test('every local href/src on the pricing page resolves to a file', () => {
  const html = read('pricing/index.html');
  const base = new URL('../pricing/', import.meta.url);
  const refs = [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1])
    .filter((ref) => !/^(https?:|mailto:|#)/.test(ref));
  assert.ok(refs.length > 0);
  for (const ref of refs) {
    const clean = ref.replace(/[?#].*$/, '');
    const url = new URL(clean.endsWith('/') ? clean + 'index.html' : clean, base);
    assert.ok(existsSync(fileURLToPath(url)), `broken link: ${ref}`);
  }
});
