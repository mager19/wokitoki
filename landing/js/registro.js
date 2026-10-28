// Pure validation and the Supabase submit for the registration form.
// No DOM access here, so it runs under node --test.

import { SUPABASE_URL, SUPABASE_KEY } from './supabase-config.js?v=20261028b';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Who the box is for: a child's age (3 to 7) or an older adult.
const PARA = new Set(['3', '4', '5', '6', '7', 'mayor']);
// Mirrors the column checks in supabase/leads.sql, so the database never rejects valid-looking input.
const MAX = { nombre: 120, ciudad: 120, email: 254, whatsapp: 30 };
const tooLong = (max) => `Máximo ${max} caracteres.`;

const str = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());

export function validateRegistration(data = {}) {
  const errors = {};
  const nombre = str(data.nombre);
  const email = str(data.email);
  const whatsapp = str(data.whatsapp);
  const para = str(data.para);

  const ciudad = str(data.ciudad);

  if (!nombre) errors.nombre = 'Escribe tu nombre.';
  else if (nombre.length > MAX.nombre) errors.nombre = tooLong(MAX.nombre);
  if (ciudad.length > MAX.ciudad) errors.ciudad = tooLong(MAX.ciudad);

  if (!email && !whatsapp) {
    errors.contacto = 'Déjanos un correo o un WhatsApp.';
  } else {
    if (email && (email.length > MAX.email || !EMAIL_RE.test(email))) errors.email = 'Revisa el correo.';
    if (whatsapp) {
      const digits = whatsapp.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15 || whatsapp.length > MAX.whatsapp) errors.whatsapp = 'Revisa el número.';
    }
  }

  if (!PARA.has(para)) errors.para = 'Elige para quién sería.';

  return { ok: Object.keys(errors).length === 0, errors };
}

const orNull = (v) => str(v) || null;

// Inserts the lead into the Supabase `leads` table (see supabase/leads.sql).
// `options` exists so tests can swap the endpoint and fetch.
export async function submitRegistration(data, options = {}) {
  const { url = SUPABASE_URL, key = SUPABASE_KEY, fetch = globalThis.fetch, timeoutMs = 15000 } = options;

  // Honeypot: people never see the "sitio" field, bots fill it. Pretend success.
  if (str(data.sitio)) return { ok: true };
  // Not configured (e.g. a local copy without keys): behave like before, send nothing.
  if (!url || !key) return { ok: true };

  const lead = {
    nombre: str(data.nombre),
    email: orNull(data.email),
    whatsapp: orNull(data.whatsapp),
    para: str(data.para),
    ciudad: orNull(data.ciudad),
    piloto: Boolean(data.piloto),
  };

  // A stalled request must still end in the failure message, not an endless wait.
  // AbortController + setTimeout instead of AbortSignal.timeout, which Safari < 16 lacks.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${url}/rest/v1/leads`, {
      method: 'POST',
      headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify(lead),
      signal: controller.signal,
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(timer);
  }
}
