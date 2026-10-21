// Pure validation and the single future-endpoint hook for the registration form.
// No DOM access here, so it runs under node --test.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const str = (v) => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v).trim());

export function validateRegistration(data = {}) {
  const errors = {};
  const nombre = str(data.nombre);
  const email = str(data.email);
  const whatsapp = str(data.whatsapp);
  const edad = str(data.edad);

  if (!nombre) errors.nombre = 'Escribe tu nombre.';

  if (!email && !whatsapp) {
    errors.contacto = 'Déjanos un correo o un WhatsApp.';
  } else {
    if (email && !EMAIL_RE.test(email)) errors.email = 'Revisa el correo.';
    if (whatsapp) {
      const digits = whatsapp.replace(/\D/g, '');
      if (digits.length < 7 || digits.length > 15) errors.whatsapp = 'Revisa el número.';
    }
  }

  const n = Number(edad);
  if (!edad || !Number.isInteger(n) || n < 3 || n > 7) {
    errors.edad = 'Elige una edad entre 3 y 7 años.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function submitRegistration(data) {
  // TODO(endpoint): send `data` to the registration backend once it exists.
  // Today nothing leaves the browser: the promise just resolves.
  void data;
  return Promise.resolve({ ok: true });
}
