const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxy_4l0c9bgUmiEpDIiNpEMqgU2NX0KED0Hw_705XGjyB_JczwHjqaCWoaDL3lFZ2vP/exec';

const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');

function setStatus(message, type = '') {
  if (!statusEl) return;

  statusEl.textContent = message;
  statusEl.classList.remove('is-success', 'is-error');

  if (type === 'success') statusEl.classList.add('is-success');
  if (type === 'error') statusEl.classList.add('is-error');
}

function onlyNumbers(value) {
  return String(value || '').replace(/\D/g, '');
}

function maskDate(value) {
  const numbers = onlyNumbers(value).slice(0, 8);

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
}

function maskCep(value) {
  return onlyNumbers(value).slice(0, 8);
}

function maskPhone(value) {
  const numbers = onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

function normalizeUf(value) {
  return String(value || '').replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
}

function applyMasks() {
  const dataNascimento = document.getElementById('data_nascimento');
  const cep = document.getElementById('cep');
  const telefone = document.getElementById('telefone');
  const uf = document.getElementById('uf');

  if (dataNascimento) {
    dataNascimento.addEventListener('input', () => {
      dataNascimento.value = maskDate(dataNascimento.value);
    });
  }

  if (cep) {
    cep.addEventListener('input', () => {
      cep.value = maskCep(cep.value);
    });

    cep.addEventListener('blur', () => {
      preencherCep(cep.value);
    });
  }

  if (telefone) {
    telefone.addEventListener('input', () => {
      telefone.value = maskPhone(telefone.value);
    });
  }

  if (uf) {
    uf.addEventListener('input', () => {
      uf.value = normalizeUf(uf.value);
    });
  }
}

async function preencherCep(cepValue) {
  const cep = maskCep(cepValue);
  const hint = document.getElementById('cep-hint');

  if (cep.length !== 8) return;

  if (hint) hint.textContent = 'Buscando CEP...';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      if (hint) hint.textContent = 'CEP não encontrado.';
      return;
    }

    const endereco = document.getElementById('endereco');
    const bairro = document.getElementById('bairro');
    const cidade = document.getElementById('cidade');
    const uf = document.getElementById('uf');

    if (endereco && !endereco.value) endereco.value = data.logradouro || '';
    if (bairro && !bairro.value) bairro.value = data.bairro || '';
    if (cidade && !cidade.value) cidade.value = data.localidade || '';
    if (uf && !uf.value) uf.value = data.uf || '';

    if (hint) hint.textContent = '';
  } catch (error) {
    if (hint) hint.textContent = 'Não foi possível buscar o CEP.';
  }
}

function validateForm() {
  if (!form) return false;

  const requiredFields = form.querySelectorAll('[required]');

  for (const field of requiredFields) {
    if (!String(field.value || '').trim()) {
      field.focus();
      setStatus('Preencha todos os campos obrigatórios.', 'error');
      return false;
    }
  }

  const email = document.getElementById('email');
  if (email && !email.validity.valid) {
    email.focus();
    setStatus('Informe um e-mail válido.', 'error');
    return false;
  }

  return true;
}

function createHiddenIframe() {
  let iframe = document.getElementById('apps-script-frame');

  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.name = 'apps-script-frame';
    iframe.id = 'apps-script-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  return iframe;
}

function openConfirmationPopup() {
  const popup = document.getElementById('elementor-popup-modal-3873');
  if (!popup) return;

  popup.hidden = false;
  document.body.classList.add('dialog-prevent-scroll');

  const closeButton = popup.querySelector('.dialog-close-button');
  if (closeButton) closeButton.focus();
}

function closeConfirmationPopup() {
  const popup = document.getElementById('elementor-popup-modal-3873');
  if (!popup) return;

  popup.hidden = true;
  document.body.classList.remove('dialog-prevent-scroll');
}

function setupConfirmationPopup() {
  const popup = document.getElementById('elementor-popup-modal-3873');
  if (!popup) return;

  const closeButton = popup.querySelector('.dialog-close-button');

  if (closeButton) {
    closeButton.addEventListener('click', closeConfirmationPopup);
  }

  popup.addEventListener('click', event => {
    if (event.target === popup) closeConfirmationPopup();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !popup.hidden) closeConfirmationPopup();
  });
}

function submitToAppsScript() {
  if (!form) return;

  createHiddenIframe();

  const originalAction = form.getAttribute('action');
  const originalMethod = form.getAttribute('method');
  const originalTarget = form.getAttribute('target');

  form.setAttribute('action', APP_SCRIPT_URL);
  form.setAttribute('method', 'POST');
  form.setAttribute('target', 'apps-script-frame');

  form.submit();

  if (originalAction === null) form.removeAttribute('action');
  else form.setAttribute('action', originalAction);

  if (originalMethod === null) form.removeAttribute('method');
  else form.setAttribute('method', originalMethod);

  if (originalTarget === null) form.removeAttribute('target');
  else form.setAttribute('target', originalTarget);
}

function setupFormSubmit() {
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (!validateForm()) return;

    submitButton.disabled = true;
    setStatus('Enviando cadastro...');

    submitToAppsScript();

    window.setTimeout(() => {
      form.reset();
      submitButton.disabled = false;
      setStatus('Enviado com Sucesso.', 'success');
      openConfirmationPopup();
    }, 1400);
  });
}

function setupCountdown() {
  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  const target = new Date(countdown.dataset.target).getTime();

  const daysEl = countdown.querySelector('[data-countdown-days]');
  const hoursEl = countdown.querySelector('[data-countdown-hours]');
  const minutesEl = countdown.querySelector('[data-countdown-minutes]');
  const secondsEl = countdown.querySelector('[data-countdown-seconds]');

  function update() {
    const now = Date.now();
    const distance = Math.max(0, target - now);

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  window.setInterval(update, 1000);
}

applyMasks();
setupConfirmationPopup();
setupFormSubmit();
setupCountdown();
