// DOM view for the registration form. Validation lives in registro.js.

import { validateRegistration, submitRegistration } from './registro.js';

const form = document.getElementById('registro-form');
const status = document.getElementById('registro-status');

// Error key -> element that shows it, and the input that receives focus.
const FIELDS = [
  { key: 'nombre', input: 'f-nombre' },
  { key: 'contacto', input: 'f-email' },
  { key: 'email', input: 'f-email' },
  { key: 'whatsapp', input: 'f-whatsapp' },
  { key: 'edad', input: 'f-edad' },
];

function readData() {
  const v = (id) => document.getElementById(id);
  return {
    nombre: v('f-nombre').value,
    email: v('f-email').value,
    whatsapp: v('f-whatsapp').value,
    edad: v('f-edad').value,
    ciudad: v('f-ciudad').value,
    piloto: v('f-piloto').checked,
  };
}

function showErrors(errors) {
  for (const f of FIELDS) {
    const box = document.getElementById('err-' + f.key);
    const msg = errors[f.key];
    box.textContent = msg || '';
    box.hidden = !msg;
  }
  // The shared "contacto" error marks both contact inputs.
  for (const key of ['nombre', 'email', 'whatsapp', 'edad']) {
    const input = document.getElementById('f-' + key);
    const bad = errors[key] || (errors.contacto && (key === 'email' || key === 'whatsapp'));
    if (bad) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }
}

function focusFirstError(errors) {
  const first = FIELDS.find((f) => errors[f.key]);
  if (first) document.getElementById(first.input).focus();
}

let submitted = false;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitted = true;
  // Clear any earlier result so a stale message never sits next to a new attempt.
  status.className = 'registro__status';
  status.textContent = '';
  const data = readData();
  const { ok, errors } = validateRegistration(data);
  showErrors(errors);
  if (!ok) {
    focusFirstError(errors);
    return;
  }
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const res = await submitRegistration(data);
    if (!res || !res.ok) throw new Error('submit failed');
    form.hidden = true;
    status.className = 'registro__status registro__status--done';
    status.textContent = '¡Listo! Te avisaremos.';
    status.focus();
  } catch {
    button.disabled = false;
    status.className = 'registro__status registro__status--fail';
    status.textContent = 'No pudimos guardar tus datos. Inténtalo de nuevo en un momento.';
  }
});

// After the first attempt, re-check as the person fixes things.
const recheck = () => { if (submitted) showErrors(validateRegistration(readData()).errors); };
form.addEventListener('input', recheck);
form.addEventListener('change', recheck);
