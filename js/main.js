'use strict';

// Menú accesible: su estado se refleja mediante aria-expanded.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#nav-principal');
function closeMenu() {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  navigation.classList.toggle('open', !open);
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') { closeMenu(); }
});
window.matchMedia('(min-width: 1050px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

// Filtro de tarjetas sin recargar la página.
const filters = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('[data-category]');
const filterStatus = document.querySelector('#filter-status');
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(filter => {
    const active = filter === button;
    filter.classList.toggle('active', active);
    filter.setAttribute('aria-pressed', String(active));
  });
  let visible = 0;
  cards.forEach(card => {
    const show = selected === 'todos' || card.dataset.category === selected;
    card.hidden = !show;
    if (show) visible++;
  });
  filterStatus.textContent = `${visible} ${visible === 1 ? 'proyecto visible' : 'proyectos visibles'}.`;
}));

// Validación de campos y retroalimentación para tecnologías de asistencia.
const form = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const validationMessages = {
  nombre: 'Ingresa al menos 3 caracteres en tu nombre.',
  correo: 'Ingresa un correo electrónico válido.',
  tipo: 'Selecciona el tipo de proyecto.',
  mensaje: 'Describe tu idea con al menos 10 caracteres.'
};
function validateField(field) {
  const value = field.value.trim();
  let valid = false;
  if (field.id === 'nombre') valid = value.length >= 3;
  if (field.id === 'correo') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (field.id === 'tipo') valid = value !== '';
  if (field.id === 'mensaje') valid = value.length >= 10;
  field.setAttribute('aria-invalid', String(!valid));
  document.querySelector(`#${field.id}-error`).textContent = valid ? '' : validationMessages[field.id];
  return valid;
}
const fields = Array.from(form.querySelectorAll('input,select,textarea'));
fields.forEach(field => {
  field.addEventListener('blur', () => validateField(field));
  field.addEventListener('input', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
  field.addEventListener('change', () => {
    if (field.getAttribute('aria-invalid') === 'true') validateField(field);
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const results = fields.map(validateField);
  if (results.includes(false)) {
    formStatus.textContent = 'Revisa los campos marcados antes de continuar.';
    formStatus.style.color = 'var(--error)';
    fields[results.indexOf(false)].focus();
    return;
  }
  formStatus.style.color = '#d8e9c3';
  formStatus.textContent = '¡Formulario validado correctamente! Esta es una demostración: los datos no se enviaron.';
  form.reset();
  fields.forEach(field => field.removeAttribute('aria-invalid'));
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
