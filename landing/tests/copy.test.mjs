import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

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
