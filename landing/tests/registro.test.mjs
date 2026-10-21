import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration, submitRegistration } from '../js/registro.js';

const valid = {
  nombre: 'Ana Pérez',
  email: 'ana@example.com',
  whatsapp: '',
  edad: '5',
  ciudad: 'Bogotá',
  piloto: false,
};
const make = (over = {}) => ({ ...valid, ...over });

test('requires name', () => {
  const r = validateRegistration(make({ nombre: '   ' }));
  assert.equal(r.ok, false);
  assert.equal(r.errors.nombre, 'Escribe tu nombre.');
});

test('requires email or whatsapp', () => {
  const r = validateRegistration(make({ email: '', whatsapp: '' }));
  assert.equal(r.ok, false);
  assert.equal(r.errors.contacto, 'Déjanos un correo o un WhatsApp.');
});

test('rejects malformed email', () => {
  const r = validateRegistration(make({ email: 'ana@' }));
  assert.equal(r.errors.email, 'Revisa el correo.');
});

test('accepts colombian whatsapp', () => {
  const ok = validateRegistration(make({ email: '', whatsapp: '+57 300 123 4567' }));
  assert.equal(ok.errors.whatsapp, undefined);
  assert.equal(ok.ok, true);
  const bad = validateRegistration(make({ email: '', whatsapp: '300 12' }));
  assert.equal(bad.errors.whatsapp, 'Revisa el número.');
});

test('edad must be 3 to 7', () => {
  assert.equal(validateRegistration(make({ edad: '8' })).errors.edad, 'Elige una edad entre 3 y 7 años.');
  assert.equal(validateRegistration(make({ edad: '2' })).errors.edad, 'Elige una edad entre 3 y 7 años.');
  assert.equal(validateRegistration(make({ edad: '' })).errors.edad, 'Elige una edad entre 3 y 7 años.');
  assert.equal(validateRegistration(make({ edad: '3' })).errors.edad, undefined);
  assert.equal(validateRegistration(make({ edad: '7' })).errors.edad, undefined);
});

test('does not require consent (privacy flow removed for now)', () => {
  const r = validateRegistration(make());
  assert.equal(r.ok, true);
  assert.equal(r.errors.consentimiento, undefined);
});

test('valid data passes', () => {
  const r = validateRegistration(make());
  assert.equal(r.ok, true);
  assert.deepEqual(r.errors, {});
});

test('submitRegistration resolves ok without network', async () => {
  const saved = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('network used'); };
  try {
    assert.deepEqual(await submitRegistration(make()), { ok: true });
  } finally {
    globalThis.fetch = saved;
  }
});
