import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRegistration, submitRegistration } from '../js/registro.js';

const valid = {
  nombre: 'Ana Pérez',
  email: 'ana@example.com',
  whatsapp: '',
  para: '5',
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

test('para accepts a child age from 3 to 7 or an older adult', () => {
  const msg = 'Elige para quién sería.';
  assert.equal(validateRegistration(make({ para: '8' })).errors.para, msg);
  assert.equal(validateRegistration(make({ para: '2' })).errors.para, msg);
  assert.equal(validateRegistration(make({ para: '' })).errors.para, msg);
  assert.equal(validateRegistration(make({ para: 'abuelo' })).errors.para, msg);
  assert.equal(validateRegistration(make({ para: '3' })).errors.para, undefined);
  assert.equal(validateRegistration(make({ para: '7' })).errors.para, undefined);
  assert.equal(validateRegistration(make({ para: 'mayor' })).errors.para, undefined);
});

test('limits field lengths to what the database accepts', () => {
  const long = (n) => 'a'.repeat(n);
  assert.equal(validateRegistration(make({ nombre: long(121) })).errors.nombre, 'Máximo 120 caracteres.');
  assert.equal(validateRegistration(make({ nombre: long(120) })).errors.nombre, undefined);
  assert.equal(validateRegistration(make({ ciudad: long(121) })).errors.ciudad, 'Máximo 120 caracteres.');
  assert.equal(validateRegistration(make({ email: `${long(250)}@x.co` })).errors.email, 'Revisa el correo.');
  assert.equal(validateRegistration(make({ whatsapp: '+57 ' + '3'.repeat(27) })).errors.whatsapp, 'Revisa el número.');
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

const config = { url: 'https://example.supabase.co', key: 'sb_publishable_test' };

function fakeFetch(response = { ok: true, status: 201 }) {
  const calls = [];
  const fn = async (url, init) => { calls.push({ url, init }); return response; };
  fn.calls = calls;
  return fn;
}

test('submitRegistration posts the lead to the Supabase leads table', async () => {
  const fetch = fakeFetch();
  const res = await submitRegistration(make({ whatsapp: ' +57 300 123 4567 ', piloto: true }), { ...config, fetch });
  assert.deepEqual(res, { ok: true });
  assert.equal(fetch.calls.length, 1);
  const { url, init } = fetch.calls[0];
  assert.equal(url, 'https://example.supabase.co/rest/v1/leads');
  assert.equal(init.method, 'POST');
  assert.equal(init.headers.apikey, 'sb_publishable_test');
  assert.equal(init.headers.Prefer, 'return=minimal');
  assert.deepEqual(JSON.parse(init.body), {
    nombre: 'Ana Pérez',
    email: 'ana@example.com',
    whatsapp: '+57 300 123 4567',
    para: '5',
    ciudad: 'Bogotá',
    piloto: true,
  });
});

test('submitRegistration sends empty optional fields as null', async () => {
  const fetch = fakeFetch();
  await submitRegistration(make({ whatsapp: '', ciudad: '  ' }), { ...config, fetch });
  const body = JSON.parse(fetch.calls[0].init.body);
  assert.equal(body.whatsapp, null);
  assert.equal(body.ciudad, null);
});

test('submitRegistration reports a failed request', async () => {
  const fetch = fakeFetch({ ok: false, status: 400 });
  assert.deepEqual(await submitRegistration(make(), { ...config, fetch }), { ok: false });
});

test('submitRegistration reports a network error', async () => {
  const fetch = async () => { throw new Error('offline'); };
  assert.deepEqual(await submitRegistration(make(), { ...config, fetch }), { ok: false });
});

test('submitRegistration drops honeypot submissions without network', async () => {
  const fetch = fakeFetch();
  assert.deepEqual(await submitRegistration(make({ sitio: 'spam.example' }), { ...config, fetch }), { ok: true });
  assert.equal(fetch.calls.length, 0);
});

test('submitRegistration skips the network when Supabase is not configured', async () => {
  const fetch = fakeFetch();
  assert.deepEqual(await submitRegistration(make(), { url: '', key: '', fetch }), { ok: true });
  assert.equal(fetch.calls.length, 0);
});

test('submitRegistration gives up when Supabase does not answer in time', { timeout: 2000 }, async () => {
  // Never settles unless the request is aborted.
  const fetch = (url, init) => new Promise((_, reject) => {
    init.signal?.addEventListener('abort', () => reject(init.signal.reason));
  });
  // AbortSignal.timeout timers do not keep Node alive on their own.
  const keepAlive = setTimeout(() => {}, 1000);
  try {
    const res = await submitRegistration(make(), { ...config, fetch, timeoutMs: 20 });
    assert.deepEqual(res, { ok: false });
  } finally {
    clearTimeout(keepAlive);
  }
});
