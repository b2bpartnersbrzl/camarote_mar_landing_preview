const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxy_4l0c9bgUmiEpDIiNpEMqgU2NX0KED0Hw_705XGjyB_JczwHjqaCWoaDL3lFZ2vP/exec';

// Configuração produtiva central do Consentimento V2.
const CONSENT_V2_CONFIG = Object.freeze({
  enabled: true,
  backEnabled: true,
  privacyPolicyVersion: 'PRIVACY_POLICY_V2_20260728',
  consentOrigin: 'landing-page-camarote-mar-2027',
  consentEventEdition: 'camarote-mar-2027',
  consentTextVersion: 'CONSENT_V2_20260728'
});

const consentV2Copy = {
  brasil: {
    privacyPrefix: 'Li e aceito a ',
    privacyLink: 'Política de Privacidade',
    privacySuffix: ' (obrigatório).',
    email: 'Quero receber comunicações oficiais por e-mail.',
    whatsapp: 'QUERO RECEBER PELO WHATSAPP AVISOS IMPORTANTES E NOVIDADES EM PRIMEIRA MÃO.',
    whatsappHelper: 'É o canal mais rápido para receber informações oficiais do CAMAROTE MAR. Você pode sair quando quiser.',
    privacyRequired: 'Aceite a Política de Privacidade para continuar.'
  },
  exterior: {
    privacyPrefix: 'I have read and accept the ',
    privacyLink: 'Privacy Policy',
    privacySuffix: ' (required).',
    email: 'I want to receive official communications by email.',
    whatsapp: 'I WANT TO RECEIVE IMPORTANT UPDATES AND NEWS FIRST VIA WHATSAPP.',
    whatsappHelper: 'It is the fastest way to receive official CAMAROTE MAR updates. You can opt out at any time.',
    privacyRequired: 'Please accept the Privacy Policy to continue.'
  }
};

const form = document.getElementById('lead-form');
const statusEl = document.getElementById('form-status');
const submitButton = document.getElementById('submit-button');
const formSteps = form ? Array.from(form.querySelectorAll('[data-form-step]')) : [];
const stepIndicators = form ? Array.from(form.querySelectorAll('[data-step-indicator]')) : [];
const prevStepButton = form ? form.querySelector('[data-step-prev]') : null;
const nextStepButton = form ? form.querySelector('[data-step-next]') : null;
const SUBMIT_FALLBACK_DELAY = 9000;
const E5_ACK_TIMEOUT_MS = 6000;
const E5_ACK_STATUS = 'RECEIVED';
const E5_TELEMETRY_EVENTS = Object.freeze([
  'form_view',
  'form_start',
  'submit_attempt',
  'ack_received',
  'ack_timeout',
  'submit_error',
  'retry'
]);
const E5_TELEMETRY_PARAMETER_ALLOWLIST = Object.freeze([
  'idempotency_key',
  'transport',
  'state',
  'reason',
  'attempt',
  'timeout_ms',
  'feature_enabled'
]);
const SUBMIT_BUTTON_LABEL = 'Enviar';
let submitFallbackTimer = null;
let submitResponsePending = false;
let conversionTrackedForSubmit = false;
let currentFormStep = 0;
let residenceMode = 'brasil';
let e5IdempotencyKey = '';
let e5SubmitAttemptEmitted = false;
let e5AckReceivedEmitted = false;
let e5AckTimeoutEmitted = false;
let e5IframeDispatched = false;
let e5AttemptNumber = 0;
let e5InterfaceState = '';

const residenceCopy = {
  brasil: {
    residenceLegend: 'Onde você mora?',
    steps: ['Dados', 'Contato', 'Endereço'],
    stepTitles: ['Seus dados', 'Contato', 'Endereço'],
    labels: {
      nome: 'Nome completo',
      data_nascimento: 'Data nasc.',
      sexo: 'Sexo',
      email: 'E-mail',
      telefone: 'Telefone',
      pais: 'País',
      cep: 'CEP',
      endereco: 'Endereço',
      numero: 'Número',
      complemento: 'Complemento',
      bairro: 'Bairro',
      cidade: 'Cidade',
      uf: 'UF',
      optional: 'Opcional'
    },
    genderOptions: ['Selecione', 'Feminino', 'Masculino', 'Prefiro não informar'],
    buttons: { back: 'Voltar', next: 'Avançar', submit: 'Enviar' },
    buttonStates: { sending: 'Enviando', validating: 'Validando', sent: 'Enviado', error: 'Erro' },
    consentBefore: 'Autorizo o uso dos meus dados para receber comunicações oficiais do CAMAROTE MAR e aceito a ',
    privacyPolicy: 'Política de Privacidade',
    consentAfter: '.',
    privacy: 'Utilizamos seus dados apenas para a comunicação oficial do CAMAROTE MAR.',
    heading: ['Cadastre-se para a', 'pré-venda de 2027!'],
    subheading: 'Acesso antecipado à pré-venda, novidades oficiais e descontos do CAMAROTE MAR na Sapucaí.',
    placeholders: { date: 'dd/mm/aaaa', phone: '', postalCode: '', region: '' },
    hints: { number: '', district: '' },
    validation: {
      fieldFallback: 'campo',
      required: (field) => `Preencha o campo ${field}.`,
      consent: 'Aceite a Política de Privacidade para continuar.',
      birthDate: 'Informe uma data de nascimento válida no formato dd/mm/aaaa.',
      email: 'Informe um e-mail válido.',
      internationalPhone: 'Informe um telefone internacional válido.',
      internationalPostalCode: 'Informe um código postal válido.',
      internationalRegion: 'Informe um estado, província ou região válido.'
    },
    status: {
      sending: 'Enviando cadastro...',
      success: 'Enviado com sucesso.',
      pending: 'Cadastro enviado. Aguardando confirmação do status.',
      failure: 'Não foi possível concluir o envio agora. Tente novamente em instantes.'
    }
  },
  exterior: {
    residenceLegend: 'Where do you live?',
    steps: ['Details', 'Contact', 'Address'],
    stepTitles: ['Personal details', 'Contact', 'Address'],
    labels: {
      nome: 'Full name',
      data_nascimento: 'Date of birth',
      sexo: 'Gender',
      email: 'Email',
      telefone: 'Phone',
      pais: 'Country',
      cep: 'Postal code',
      endereco: 'Address',
      numero: 'Number',
      complemento: 'Address complement',
      bairro: 'District / Neighborhood',
      cidade: 'City',
      uf: 'State / Province / Region',
      optional: 'Optional'
    },
    genderOptions: ['Select', 'Female', 'Male', 'Prefer not to say'],
    buttons: { back: 'Back', next: 'Continue', submit: 'Submit' },
    buttonStates: { sending: 'Sending', validating: 'Validating', sent: 'Sent', error: 'Error' },
    consentBefore: 'I authorize the use of my data to receive official communications from CAMAROTE MAR and accept the ',
    privacyPolicy: 'Privacy Policy',
    consentAfter: '.',
    privacy: 'We use your data only for official CAMAROTE MAR communications.',
    heading: ['Sign up for the', '2027 presale!'],
    subheading: 'Get early access to the presale, official news and CAMAROTE MAR discounts at Sapucaí.',
    placeholders: {
      date: 'dd/mm/yyyy',
      phone: 'Ex.: +1 212 555 0100',
      postalCode: 'Ex.: SW1A 1AA',
      region: 'State, province or region'
    },
    hints: {
      number: '',
      district: ''
    },
    validation: {
      fieldFallback: 'field',
      required: (field) => `Please complete the ${field} field.`,
      consent: 'Please accept the Privacy Policy to continue.',
      birthDate: 'Enter a valid date of birth in dd/mm/yyyy format.',
      email: 'Enter a valid email address.',
      internationalPhone: 'Enter a valid international phone number.',
      internationalPostalCode: 'Enter a valid postal code.',
      internationalRegion: 'Enter a valid state, province or region.'
    },
    status: {
      sending: 'Sending',
      success: 'Successfully submitted.',
      pending: 'Registration submitted. Waiting for status confirmation.',
      failure: 'We could not complete the submission. Please try again shortly.'
    }
  }
};

function getResidenceCopy() {
  return residenceCopy[residenceMode];
}

function isConsentV2Mode() {
  return CONSENT_V2_CONFIG.enabled;
}

function getConsentV2Input(fieldName) {
  return form ? form.querySelector(`[data-consent-v2-field="${fieldName}"]`) : null;
}

function updateConsentV2Copy() {
  if (!form) return;

  const copy = consentV2Copy[residenceMode];
  const privacyPrefix = form.querySelector('[data-consent-v2-copy="privacy-prefix"]');
  const privacyLink = form.querySelector('[data-consent-v2-policy-link]');
  const privacySuffix = form.querySelector('[data-consent-v2-copy="privacy-suffix"]');
  const email = form.querySelector('[data-consent-v2-copy="email"]');
  const whatsapp = form.querySelector('[data-consent-v2-copy="whatsapp"]');
  const whatsappHelper = form.querySelector('[data-consent-v2-copy="whatsapp-helper"]');

  if (privacyPrefix) privacyPrefix.textContent = copy.privacyPrefix;
  if (privacyLink) privacyLink.textContent = copy.privacyLink;
  if (privacySuffix) privacySuffix.textContent = copy.privacySuffix;
  if (email) email.textContent = copy.email;
  if (whatsapp) whatsapp.textContent = copy.whatsapp;
  if (whatsappHelper) whatsappHelper.textContent = copy.whatsappHelper;
}

function updateConsentV2Visibility() {
  if (!form) return;

  const v2Enabled = isConsentV2Mode();
  let legacyConsent = form.querySelector('[data-legacy-consent]');
  const consentV2 = form.querySelector('[data-consent-v2]');

  if (legacyConsent) legacyConsent.remove();
  legacyConsent = null;

  if (legacyConsent) {
    legacyConsent.hidden = true;
    legacyConsent.setAttribute('aria-hidden', 'true');
    legacyConsent.querySelectorAll('input, select, textarea, button').forEach((field) => {
      field.disabled = true;
      field.tabIndex = -1;
    });
  }

  if (consentV2) {
    consentV2.hidden = !v2Enabled;
    consentV2.setAttribute('aria-hidden', String(!v2Enabled));
    consentV2.querySelectorAll('input, select, textarea, button').forEach((field) => {
      field.disabled = !v2Enabled;
      field.tabIndex = v2Enabled ? 0 : -1;
    });
  }
}

function appendConsentV2Payload() {
  if (!form || !isConsentV2Mode()) return;

  const values = {
    consent_schema_version: 'v2',
    privacy_policy_accepted: Boolean(getConsentV2Input('privacy')?.checked),
    privacy_policy_version: CONSENT_V2_CONFIG.privacyPolicyVersion,
    email_consent: Boolean(getConsentV2Input('email')?.checked),
    whatsapp_consent: Boolean(getConsentV2Input('whatsapp')?.checked),
    consent_language: residenceMode === 'exterior' ? 'en' : 'pt-BR',
    consent_origin: 'site-oficial',
    consent_event_edition: 'Camarote Mar 2027',
    consent_text_version: CONSENT_V2_CONFIG.consentTextVersion,
    consent_timestamp_client: new Date().toISOString()
  };

  Object.entries(values).forEach(([name, value]) => {
    let input = form.querySelector(`input[type="hidden"][data-consent-v2-payload="${name}"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.dataset.consentV2Payload = name;
      input.name = name;
      form.appendChild(input);
    }
    input.value = String(value);
  });
}

function validateConsentV2() {
  if (!isConsentV2Mode()) return true;

  const privacy = getConsentV2Input('privacy');
  const copy = consentV2Copy[residenceMode];
  if (!privacy || privacy.checked) return true;

  return invalidateField(privacy, copy.privacyRequired);
}

function setLabelText(fieldId, text) {
  const label = form ? form.querySelector(`label[for="${fieldId}"]`) : null;
  if (!label) return;

  const textNode = Array.from(label.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) textNode.nodeValue = `${text} `;
}

function updateResidenceCopy() {
  if (!form) return;

  const copy = getResidenceCopy();
  const signupHeadingLines = document.querySelectorAll('#signup-title > span');
  const consentText = form.querySelector('.form__consent > span');
  const privacyText = form.querySelector('.form__privacy');
  const gender = document.getElementById('sexo');
  const formStepsContainer = form.querySelector('.form-steps');
  const formNav = form.querySelector('.form-nav');

  stepIndicators.forEach((indicator, index) => {
    indicator.textContent = copy.steps[index];
  });

  formSteps.forEach((step, index) => {
    const legend = step.querySelector(':scope > legend');
    if (legend) legend.textContent = copy.stepTitles[index];
  });

  ['nome', 'data_nascimento', 'sexo', 'email', 'telefone', 'pais', 'endereco', 'numero', 'complemento', 'cidade']
    .forEach((fieldId) => setLabelText(fieldId, copy.labels[fieldId]));

  document.getElementById('cep-label-text').textContent = copy.labels.cep;
  document.getElementById('bairro-label-text').textContent = copy.labels.bairro;
  document.getElementById('uf-label-text').textContent = copy.labels.uf;
  document.getElementById('residence-selector-label').firstChild.nodeValue = `${copy.residenceLegend} `;
  if (formStepsContainer) formStepsContainer.setAttribute('aria-label', residenceMode === 'exterior' ? 'Registration steps' : 'Etapas do cadastro');
  if (formNav) formNav.setAttribute('aria-label', residenceMode === 'exterior' ? 'Form navigation' : 'Navegação do formulário');

  if (gender) {
    Array.from(gender.options).forEach((option, index) => {
      option.textContent = copy.genderOptions[index];
    });
  }

  if (consentText) {
    const link = consentText.querySelector('a');
    const textNodes = Array.from(consentText.childNodes).filter((node) => node.nodeType === Node.TEXT_NODE);
    if (textNodes[0]) textNodes[0].nodeValue = copy.consentBefore;
    if (link) link.textContent = copy.privacyPolicy;
    if (textNodes[1]) textNodes[1].nodeValue = copy.consentAfter;
  }

  if (privacyText) {
    const textNode = Array.from(privacyText.childNodes).find(
      (node) =>
        node.nodeType === Node.TEXT_NODE &&
        node.nodeValue.trim()
    );
    if (textNode) textNode.nodeValue = `\n                ${copy.privacy}\n              `;
  }

  signupHeadingLines.forEach((line, index) => {
    line.textContent = copy.heading[index];
  });
  const signupSubheading = document.querySelector('.section-heading__sub');
  if (signupSubheading) signupSubheading.textContent = copy.subheading;

  document.getElementById('data_nascimento').placeholder = copy.placeholders.date;
  document.getElementById('telefone').placeholder = copy.placeholders.phone;
  document.getElementById('cep').placeholder = copy.placeholders.postalCode;
  document.getElementById('uf').placeholder = copy.placeholders.region;
  document.getElementById('numero-hint').textContent = copy.hints.number;
  document.getElementById('bairro-hint').textContent = copy.hints.district;

  prevStepButton.textContent = copy.buttons.back;
  nextStepButton.textContent = copy.buttons.next;
  if (!submitButton.disabled && !submitButton.classList.contains('is-success') && !submitButton.classList.contains('is-error')) {
    submitButton.textContent = copy.buttons.submit;
  }

  updateConsentV2Copy();
  updateConsentV2Visibility();
}

function trackSuccessfulSignup() {
  if (conversionTrackedForSubmit) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'event': 'cadastro_prevenda' });
  conversionTrackedForSubmit = true;
}

function sanitizeE5Telemetry(parameters) {
  return E5_TELEMETRY_PARAMETER_ALLOWLIST.reduce((safe, key) => {
    if (Object.prototype.hasOwnProperty.call(parameters, key)) safe[key] = parameters[key];
    return safe;
  }, {});
}

function pushE5Event(eventName, parameters = {}) {
  if (!E5_TELEMETRY_EVENTS.includes(eventName)) return false;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...sanitizeE5Telemetry(parameters) });
  return true;
}

function createE5IdempotencyKey() {
  if (window.crypto && typeof window.crypto.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  if (!window.crypto || typeof window.crypto.getRandomValues !== 'function') {
    throw new Error('secure_random_unavailable');
  }
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
  return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}

function setE5HiddenValue(value) {
  if (!form) return;
  let field = form.querySelector('input[type="hidden"][name="idempotency_key"]');
  if (!field) {
    field = document.createElement('input');
    field.type = 'hidden';
    field.name = 'idempotency_key';
    form.appendChild(field);
  }
  field.value = value;
}

function setE5InterfaceState(state) {
  e5InterfaceState = state;
  if (form) form.dataset.e5State = state;
}

function ensureE5FormStart() {
  if (e5IdempotencyKey) return e5IdempotencyKey;
  e5IdempotencyKey = createE5IdempotencyKey();
  setE5HiddenValue(e5IdempotencyKey);
  pushE5Event('form_start', { idempotency_key: e5IdempotencyKey, feature_enabled: true });
  return e5IdempotencyKey;
}

function resetE5Cycle() {
  e5IdempotencyKey = '';
  e5SubmitAttemptEmitted = false;
  e5AckReceivedEmitted = false;
  e5AckTimeoutEmitted = false;
  e5IframeDispatched = false;
  e5AttemptNumber = 0;
  setE5HiddenValue('');
}

function emitE5SubmitAttempt() {
  if (e5SubmitAttemptEmitted) return;
  e5SubmitAttemptEmitted = true;
  pushE5Event('submit_attempt', {
    idempotency_key: e5IdempotencyKey,
    transport: 'fetch',
    attempt: 1,
    feature_enabled: true
  });
}

function finishRealFailure(reason) {
  if (submitFallbackTimer) {
    window.clearTimeout(submitFallbackTimer);
    submitFallbackTimer = null;
  }
  submitResponsePending = false;
  if (submitButton) submitButton.disabled = false;
  setE5InterfaceState('FALHA_REAL');
  setStatus(getResidenceCopy().status.failure, 'error');
  pushE5Event('submit_error', {
    idempotency_key: e5IdempotencyKey,
    state: 'FALHA_REAL',
    reason,
    attempt: e5AttemptNumber
  });
}

function buildE5FetchPayload() {
  const payload = {};
  new FormData(form).forEach((value, key) => { payload[key] = value; });
  payload.idempotency_key = e5IdempotencyKey;
  return payload;
}

async function submitE5Fetch() {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), E5_ACK_TIMEOUT_MS);
  try {
    const response = await fetch(APP_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(buildE5FetchPayload()),
      signal: controller.signal
    });
    const payload = JSON.parse(await response.text());
    const validAck = response.ok && payload && payload.ok === true &&
      payload.status === E5_ACK_STATUS && payload.idempotency_key === e5IdempotencyKey;
    if (!validAck) throw new Error(payload && payload.idempotency_key !== e5IdempotencyKey ? 'ack_key_mismatch' : 'ack_invalid');
    submitResponsePending = false;
    finishSuccessfulSubmit(payload.contact_status || 'created', 'fetch');
    return true;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function dispatchE5Iframe(reason) {
  if (e5IframeDispatched) return true;
  try {
    submitToAppsScript();
    e5IframeDispatched = true;
    pushE5Event('retry', {
      idempotency_key: e5IdempotencyKey,
      transport: 'iframe',
      reason,
      attempt: e5AttemptNumber
    });
    return true;
  } catch (error) {
    finishRealFailure('iframe_dispatch_failed');
    return false;
  }
}

async function runE5Submission() {
  try {
    await submitE5Fetch();
  } catch (error) {
    if (!e5AckTimeoutEmitted) {
      e5AckTimeoutEmitted = true;
      pushE5Event('ack_timeout', {
        idempotency_key: e5IdempotencyKey,
        transport: 'fetch',
        reason: error && error.name === 'AbortError' ? 'timeout' : 'ack_unavailable',
        timeout_ms: E5_ACK_TIMEOUT_MS,
        attempt: e5AttemptNumber
      });
    }
    dispatchE5Iframe('fetch_ack_unavailable');
  }
}

function setupE5Telemetry() {
  pushE5Event('form_view', { feature_enabled: true });
  if (!form) return;
  const start = () => {
    if (e5InterfaceState === 'FALHA_REAL') return;
    try {
      ensureE5FormStart();
    } catch (error) {
      finishRealFailure('secure_random_unavailable');
    }
  };
  form.addEventListener('focusin', start);
  form.addEventListener('input', start);
  form.addEventListener('change', start);
}

function setStatus(message, type = '') {
  const copy = getResidenceCopy();

  if (statusEl) {
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');

    if (type === 'success') statusEl.classList.add('is-success');
    if (type === 'error') statusEl.classList.add('is-error');
  }

  if (!submitButton) return;

  submitButton.classList.remove('is-sending', 'is-success', 'is-error');

  if (submitButton.hidden && type === 'error') {
    submitButton.textContent = copy.buttons.submit || SUBMIT_BUTTON_LABEL;
    return;
  }

  if (type === 'success') {
    submitButton.textContent = copy.buttonStates.sent;
    submitButton.classList.add('is-success');
    return;
  }

  if (type === 'error') {
    submitButton.textContent = copy.buttonStates.error;
    submitButton.classList.add('is-error');
    return;
  }

  if (type === 'pending') {
    submitButton.textContent = copy.buttons.submit || SUBMIT_BUTTON_LABEL;
    return;
  }

  if (message) {
    submitButton.textContent = copy.buttonStates.sending;
    submitButton.classList.add('is-sending');
    return;
  }

  submitButton.textContent = copy.buttons.submit || SUBMIT_BUTTON_LABEL;
}

function clearStatus() {
  setStatus('');
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

function normalizeInternationalPostalCode(value) {
  return String(value || '').replace(/[^\p{L}0-9 -]/gu, '');
}

function normalizeInternationalPhone(value) {
  return String(value || '').replace(/[^+0-9 ()-]/g, '');
}

function normalizeInternationalRegion(value) {
  return String(value || '').replace(/[^\p{L} -]/gu, '');
}

function updateInternationalAddressRequirements(isExterior) {
  const optionalFields = [
    { fieldId: 'numero', label: getResidenceCopy().labels.numero },
    { fieldId: 'bairro', label: getResidenceCopy().labels.bairro }
  ];

  optionalFields.forEach(({ fieldId }) => {
    const field = document.getElementById(fieldId);
    const fieldLabel = form ? form.querySelector(`label[for="${fieldId}"]`) : null;
    if (!field || !fieldLabel) return;

    field.required = !isExterior;

    const requiredMarker = fieldLabel.querySelector('.required');
    if (requiredMarker) requiredMarker.hidden = isExterior;

    let optionalMarker = fieldLabel.querySelector('[data-address-optional]');
    if (isExterior) {
      if (!optionalMarker) {
        optionalMarker = document.createElement('span');
        optionalMarker.setAttribute('data-address-optional', 'true');
        fieldLabel.appendChild(optionalMarker);
      }
      optionalMarker.textContent = ` (${getResidenceCopy().labels.optional})`;
    } else if (optionalMarker) {
      optionalMarker.remove();
    }
  });
}

function setResidenceMode(mode) {
  residenceMode = mode === 'exterior' ? 'exterior' : 'brasil';
  const isExterior = residenceMode === 'exterior';
  const cep = document.getElementById('cep');
  const telefone = document.getElementById('telefone');
  const uf = document.getElementById('uf');
  const pais = document.getElementById('pais');
  const paisField = document.getElementById('pais-field');
  const cepHint = document.getElementById('cep-hint');

  if (form) form.classList.toggle('is-exterior', isExterior);

  document.querySelectorAll('[data-residence-mode]').forEach((button) => {
    const isActive = button.dataset.residenceMode === residenceMode;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  if (paisField) paisField.hidden = !isExterior;
  if (pais) {
    pais.disabled = !isExterior;
    pais.required = isExterior;
    if (isExterior) pais.setAttribute('name', 'pais');
    else pais.removeAttribute('name');
  }

  if (cep) {
    cep.inputMode = isExterior ? 'text' : 'numeric';
    if (isExterior) cep.removeAttribute('maxlength');
    else cep.setAttribute('maxlength', '8');
  }

  if (telefone) {
    telefone.inputMode = isExterior ? 'tel' : 'numeric';
    if (isExterior) telefone.removeAttribute('maxlength');
    else telefone.setAttribute('maxlength', '15');
  }

  if (uf) {
    if (isExterior) uf.removeAttribute('maxlength');
    else uf.setAttribute('maxlength', '2');
  }

  updateInternationalAddressRequirements(isExterior);

  if (cepHint) cepHint.textContent = '';
  updateResidenceCopy();
}

function setupResidenceSelector() {
  document.querySelectorAll('[data-residence-mode]').forEach((button) => {
    button.addEventListener('click', () => setResidenceMode(button.dataset.residenceMode));
  });

  if (form) {
    form.addEventListener('reset', () => {
      window.setTimeout(() => setResidenceMode('brasil'), 0);
    });
  }

  setResidenceMode('brasil');
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
      cep.value = residenceMode === 'brasil'
        ? maskCep(cep.value)
        : normalizeInternationalPostalCode(cep.value);
    });

    cep.addEventListener('blur', () => {
      preencherCep(cep.value);
    });
  }

  if (telefone) {
    telefone.addEventListener('input', () => {
      telefone.value = residenceMode === 'brasil'
        ? maskPhone(telefone.value)
        : normalizeInternationalPhone(telefone.value);
    });
  }

  if (uf) {
    uf.addEventListener('input', () => {
      uf.value = residenceMode === 'brasil'
        ? normalizeUf(uf.value)
        : normalizeInternationalRegion(uf.value);
    });
  }
}

async function preencherCep(cepValue) {
  if (residenceMode !== 'brasil') return;

  const cep = maskCep(cepValue);
  const hint = document.getElementById('cep-hint');

  if (cep.length !== 8) return;

  if (hint) hint.textContent = 'Buscando CEP...';

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (residenceMode !== 'brasil') return;

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
  if (!validateFieldsInScope(form)) return false;
  return validateConsentV2();
}

function getFieldLabel(field) {
  if (!field) return getResidenceCopy().validation.fieldFallback;

  const label = form.querySelector(`label[for="${field.id}"]`);
  if (!label) return getResidenceCopy().validation.fieldFallback;

  return label.textContent.replace('*', '').trim().replace(/\.$/, '');
}

function getErrorContainer(field) {
  return field.closest('.field') || field.closest('.form__consent') || field.closest('.form__consent-v2-item');
}

function clearFieldError(field) {
  const container = getErrorContainer(field);
  if (!container) return;

  container.classList.remove('is-invalid');
  field.removeAttribute('aria-invalid');

  const error = container.querySelector('.field__error');
  if (error) error.remove();
}

function showFieldError(field, message) {
  const container = getErrorContainer(field);
  if (!container) return;

  clearFieldError(field);
  container.classList.add('is-invalid');
  field.setAttribute('aria-invalid', 'true');

  const error = document.createElement('span');
  error.className = 'field__error';
  const describedBy = field.getAttribute('aria-describedby');
  if (describedBy) error.id = describedBy;
  error.textContent = message;
  container.appendChild(error);
}

function invalidateField(field, message) {
  showFieldError(field, message);
  setStatus(message, 'error');
  field.focus();
  return false;
}

function isValidDate(value) {
  const match = String(value || '').match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return false;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function validateFieldsInScope(scope) {
  if (!scope) return false;

  const messages = getResidenceCopy().validation;
  const requiredFields = Array.from(scope.querySelectorAll('[required]')).filter(
    (field) => !field.disabled && !field.closest('[hidden]')
  );

  for (const field of requiredFields) {
    clearFieldError(field);

    if ((field.type === 'checkbox' || field.type === 'radio') && !field.checked) {
      return invalidateField(field, messages.consent);
    }

    if (!String(field.value || '').trim()) {
      return invalidateField(field, messages.required(getFieldLabel(field)));
    }
  }

  const dataNascimento = scope.querySelector('#data_nascimento');
  if (dataNascimento && !isValidDate(dataNascimento.value)) {
    return invalidateField(dataNascimento, messages.birthDate);
  }

  const email = scope.querySelector('#email');
  if (email && !email.validity.valid) {
    return invalidateField(email, messages.email);
  }

  const telefone = scope.querySelector('#telefone');
  if (telefone && residenceMode === 'brasil' && ![10, 11].includes(onlyNumbers(telefone.value).length)) {
    return invalidateField(telefone, 'Informe um telefone válido com DDD.');
  }

  if (telefone && residenceMode === 'exterior' && !/^\+?[0-9 ()-]+$/.test(telefone.value.trim())) {
    return invalidateField(telefone, messages.internationalPhone);
  }

  const cep = scope.querySelector('#cep');
  if (cep && residenceMode === 'brasil' && onlyNumbers(cep.value).length !== 8) {
    return invalidateField(cep, 'Informe um CEP válido com 8 números.');
  }

  if (cep && residenceMode === 'exterior' && !/^[\p{L}0-9 -]+$/u.test(cep.value.trim())) {
    return invalidateField(cep, messages.internationalPostalCode);
  }

  const uf = scope.querySelector('#uf');
  if (uf && residenceMode === 'brasil' && normalizeUf(uf.value).length !== 2) {
    return invalidateField(uf, 'Informe uma UF válida com 2 letras.');
  }

  if (uf && residenceMode === 'exterior' && !/^[\p{L} -]+$/u.test(uf.value.trim())) {
    return invalidateField(uf, messages.internationalRegion);
  }

  return true;
}

function updateFormStep() {
  if (!formSteps.length) return;

  const residenceStepControl = form.querySelector('[data-residence-step-control]');

  formSteps.forEach((step, index) => {
    const isActive = index === currentFormStep;
    step.hidden = !isActive;
    step.classList.toggle('is-active', isActive);
  });

  stepIndicators.forEach((indicator, index) => {
    indicator.classList.toggle('is-active', index === currentFormStep);
    indicator.classList.toggle('is-complete', index < currentFormStep);
  });

  if (prevStepButton) prevStepButton.hidden = currentFormStep === 0;
  if (nextStepButton) nextStepButton.hidden = currentFormStep === formSteps.length - 1;
  if (submitButton) submitButton.hidden = currentFormStep !== formSteps.length - 1;
  if (residenceStepControl) residenceStepControl.hidden = currentFormStep !== 0;
}

function goToFormStep(nextStep) {
  if (!formSteps.length) return;

  currentFormStep = Math.max(0, Math.min(nextStep, formSteps.length - 1));
  updateFormStep();
  clearStatus();
}

function setupFormSteps() {
  if (!formSteps.length) return;

  updateFormStep();

  if (prevStepButton) {
    prevStepButton.addEventListener('click', () => {
      goToFormStep(currentFormStep - 1);
    });
  }

  if (nextStepButton) {
    nextStepButton.addEventListener('click', () => {
      if (!validateFieldsInScope(formSteps[currentFormStep])) return;
      goToFormStep(currentFormStep + 1);
    });
  }
}

function setupFormStatusReset() {
  if (!form) return;

  function resetChangedField(event) {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement)) return;

    clearFieldError(field);

    if (submitButton && !submitButton.disabled && statusEl && statusEl.classList.contains('is-error')) {
      clearStatus();
    }
  }

  form.addEventListener('input', resetChangedField);
  form.addEventListener('change', resetChangedField);
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

function setConfirmationImage(contactStatus = 'created') {
  const popupImage = document.querySelector('#elementor-popup-modal-3873 [data-created-src][data-updated-src]');
  if (!popupImage) return;

  const isUpdated = contactStatus === 'updated';
  const imageSrc = residenceMode === 'exterior'
    ? (isUpdated ? popupImage.dataset.updatedSrcEn : popupImage.dataset.createdSrcEn)
    : (isUpdated ? popupImage.dataset.updatedSrc : popupImage.dataset.createdSrc);
  if (imageSrc) popupImage.src = imageSrc;
}

function openConfirmationPopup(contactStatus = 'created') {
  const popup = document.getElementById('elementor-popup-modal-3873');
  if (!popup) return;

  setConfirmationImage(contactStatus);
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

  submitResponsePending = true;
  form.submit();

  if (originalAction === null) form.removeAttribute('action');
  else form.setAttribute('action', originalAction);

  if (originalMethod === null) form.removeAttribute('method');
  else form.setAttribute('method', originalMethod);

  if (originalTarget === null) form.removeAttribute('target');
  else form.setAttribute('target', originalTarget);
}

function finishSuccessfulSubmit(contactStatus = 'created', transport = 'iframe') {
  if (submitFallbackTimer) {
    window.clearTimeout(submitFallbackTimer);
    submitFallbackTimer = null;
  }
  submitResponsePending = false;
  setE5InterfaceState('CONFIRMADO');
  if (!e5AckReceivedEmitted) {
    e5AckReceivedEmitted = true;
    pushE5Event('ack_received', {
      idempotency_key: e5IdempotencyKey,
      transport,
      state: 'CONFIRMADO',
      attempt: e5AttemptNumber
    });
  }
  form.reset();
  currentFormStep = 0;
  updateFormStep();
  submitButton.disabled = false;
  trackSuccessfulSignup();
  setStatus(getResidenceCopy().status.success, 'success');
  openConfirmationPopup(contactStatus === 'updated' ? 'updated' : 'created');
  resetE5Cycle();
}

function finishUnconfirmedSubmit() {
  submitFallbackTimer = null;
  submitResponsePending = false;
  submitButton.disabled = false;
  setE5InterfaceState('RECEBIDO_EM_CONFIRMACAO');
  setStatus(getResidenceCopy().status.pending, 'pending');
}

function parseAppsScriptMessage(rawData) {
  if (!rawData) return null;
  if (typeof rawData === 'object') return rawData;

  if (typeof rawData === 'string') {
    try {
      return JSON.parse(rawData);
    } catch (error) {
      return null;
    }
  }

  return null;
}

function getContactStatus(data) {
  const status = data.contact_status || data.contactStatus || data.status || data.action || '';
  const normalizedStatus = String(status).toLowerCase();

  if (normalizedStatus === 'created' || normalizedStatus === 'updated' || normalizedStatus === 'invalid') {
    return normalizedStatus;
  }

  if (normalizedStatus === 'validation_error') return 'invalid';

  return '';
}

function isMessageFromSubmitFrame(sourceWindow, iframeWindow) {
  if (!sourceWindow || !iframeWindow) return false;

  let currentWindow = sourceWindow;

  for (let depth = 0; depth < 8; depth += 1) {
    if (currentWindow === iframeWindow) return true;

    try {
      const parentWindow = currentWindow.parent;

      if (!parentWindow || parentWindow === currentWindow) return false;

      currentWindow = parentWindow;
    } catch (error) {
      return false;
    }
  }

  return false;
}

function setupAppsScriptResponse() {
  window.addEventListener('message', event => {
    const iframe = document.getElementById('apps-script-frame');
    if (!iframe || !iframe.contentWindow || !submitResponsePending) return;
    if (!isMessageFromSubmitFrame(event.source, iframe.contentWindow)) return;
    const data = parseAppsScriptMessage(event.data);
    if (!data || data.source !== 'camarote-mar-form') return;
    const validAck = data.status === E5_ACK_STATUS &&
      Boolean(e5IdempotencyKey) && data.idempotency_key === e5IdempotencyKey;
    if (!validAck) return;
    finishSuccessfulSubmit(data.contact_status || 'created', 'iframe');
  });
}
function setupFormSubmit() {
  if (!form) return;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitResponsePending && e5InterfaceState !== 'RECEBIDO_EM_CONFIRMACAO') return;
    if (!validateForm()) return;
    const isManualRetry = e5InterfaceState === 'RECEBIDO_EM_CONFIRMACAO';
    e5IframeDispatched = false;
    e5AttemptNumber += 1;
    try {
      ensureE5FormStart();
    } catch (error) {
      finishRealFailure('secure_random_unavailable');
      return;
    }
    if (isManualRetry) {
      pushE5Event('retry', {
        idempotency_key: e5IdempotencyKey,
        transport: 'fetch',
        reason: 'manual_retry',
        attempt: e5AttemptNumber
      });
    }
    emitE5SubmitAttempt();
    submitButton.disabled = true;
    conversionTrackedForSubmit = false;
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.classList.remove('is-success', 'is-error');
    }
    submitButton.classList.remove('is-success', 'is-error');
    submitButton.classList.add('is-sending');
    submitButton.textContent = getResidenceCopy().buttonStates.sending;
    appendConsentV2Payload();
    if (!CONSENT_V2_CONFIG.backEnabled) {
      finishRealFailure('backend_disabled');
      return;
    }
    submitResponsePending = true;
    if (submitFallbackTimer) window.clearTimeout(submitFallbackTimer);
    submitFallbackTimer = window.setTimeout(finishUnconfirmedSubmit, SUBMIT_FALLBACK_DELAY);
    await runE5Submission();
  });
}
function setupCountdown() {
  const countdowns = Array.from(document.querySelectorAll('.countdown[data-target]'));
  if (!countdowns.length) return;

  function update() {
    const now = Date.now();

    countdowns.forEach(countdown => {
      const target = new Date(countdown.dataset.target).getTime();
      const distance = Math.max(0, target - now);

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      const daysEl = countdown.querySelector('[data-countdown-days]');
      const hoursEl = countdown.querySelector('[data-countdown-hours]');
      const minutesEl = countdown.querySelector('[data-countdown-minutes]');
      const secondsEl = countdown.querySelector('[data-countdown-seconds]');

      if (daysEl) daysEl.textContent = days;
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
      if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
      countdown.classList.add('is-ready');
    });
  }

  update();
  window.setInterval(update, 1000);
}

function setupDeferredSectionBackgrounds() {
  const sections = Array.from(document.querySelectorAll([
    '.post-hero-strip-section',
    '.post-hero-section',
    '.verdadeiro-section',
    '.video-section',
    '.post-video-section',
    '.social-section',
    '.facilities-section',
    '.othon-section',
    '.after-othon-section',
    '.new-section',
    '.signup',
    '.countdown-section'
  ].join(',')));
  if (!sections.length) return;

  const reveal = section => section.classList.add('is-bg-ready');
  if (!('IntersectionObserver' in window)) {
    sections.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '100% 0px' });

  sections.forEach(section => observer.observe(section));
}

function setupPostHeroArtReveal() {
  const section = document.querySelector('.post-hero-strip-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupNumbersArtReveal() {
  const section = document.querySelector('.post-hero-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupVerdadeiroArtReveal() {
  const section = document.querySelector('.verdadeiro-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupVideoArtReveal() {
  const section = document.querySelector('.video-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupPostVideoArtReveal() {
  const section = document.querySelector('.post-video-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupSocialArtReveal() {
  const section = document.querySelector('.social-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupFacilitiesArtReveal() {
  const section = document.querySelector('.facilities-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupOthonArtReveal() {
  const section = document.querySelector('.othon-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupAfterOthonArtReveal() {
  const section = document.querySelector('.after-othon-section');
  if (!section) return;

  const reveal = () => section.classList.add('is-art-visible');
  if (!('IntersectionObserver' in window)) {
    reveal();
    return;
  }

  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    reveal();
    observer.disconnect();
  }, { threshold: 0.25 });

  observer.observe(section);
}

function setupSectionArtExitReveal() {
  if (window.matchMedia('(max-width: 820px)').matches) return;

  const sections = Array.from(document.querySelectorAll([
    '.post-hero-strip-section',
    '.post-hero-section',
    '.verdadeiro-section',
    '.video-section',
    '.post-video-section',
    '.social-section',
    '.facilities-section',
    '.othon-section',
    '.after-othon-section'
  ].join(',')));
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const section = entry.target;
      if (entry.isIntersecting) {
        section.classList.remove('is-art-hiding');
        section.classList.add('is-art-visible');
        return;
      }

      if (section.classList.contains('is-art-visible')) {
        section.classList.remove('is-art-visible');
        section.classList.add('is-art-hiding');
      }
    });
  }, { threshold: 0.25 });

  sections.forEach(section => observer.observe(section));
}

function setupParadeDetails() {
  const days = Array.from(document.querySelectorAll('[data-parade-day]'));
  const details = Array.from(document.querySelectorAll('[data-parade-detail]'));
  const detailsBox = document.querySelector('.parade-grid');
  if (!days.length || !details.length) return;

  const activate = (day) => {
    const key = day.dataset.paradeDay;
    const index = days.indexOf(day);
    details.forEach(detail => {
      const active = detail.dataset.paradeDetail === key;
      detail.classList.toggle('is-active', active);
      const card = detail.closest('.parade-card');
      if (card) card.classList.toggle('is-active', active);
    });
    if (detailsBox) detailsBox.classList.add('has-active');
    if (detailsBox) detailsBox.style.setProperty('--active-left', `${index * 20 + 10}%`);
    days.forEach(item => item.classList.toggle('is-active', item === day));
  };

  days.forEach(day => {
    day.addEventListener('pointerenter', () => { if (window.matchMedia('(min-width: 821px)').matches) activate(day); });
    day.addEventListener('focus', () => activate(day));
    day.addEventListener('click', () => activate(day));
  });

  activate(days[0]);
}

function setupCountdownDockVisibility() {
  const dock = document.querySelector('.countdown-dock');
  if (!dock) return;
  dock.classList.remove('is-hidden');
  dock.setAttribute('aria-hidden', 'false');
}

function setupResponsiveHeroVideo() {
  const video = document.querySelector('.hero__video');
  if (!video) return;

  const mobileSource = video.querySelector('source[media]');
  const desktopSource = video.querySelector('source:not([media])');
  if (!mobileSource || !desktopSource) return;

  const mediaQuery = window.matchMedia('(max-width: 640px)');

  function updateVideoSource() {
    const nextSource = mediaQuery.matches ? mobileSource.src : desktopSource.src;
    if (video.src === nextSource) return;

    const wasPlaying = !video.paused;
    video.src = nextSource;
    video.load();

    if (wasPlaying) {
      video.play().catch(() => {});
    }
  }

  updateVideoSource();
  mediaQuery.addEventListener('change', updateVideoSource);
}

function setupSignupHeadingAlignment() {
  const headings = document.querySelectorAll('.section-heading h2');
  if (!headings.length) return;

  function alignHeading(heading) {
    const lines = Array.from(heading.querySelectorAll(':scope > span'));
    if (lines.length < 2) return;

    lines.forEach((line) => {
      line.style.scale = '1 1';
    });

    const widths = lines.map((line) => line.getBoundingClientRect().width);
    const targetWidth = Math.max(...widths);

    lines.forEach((line, index) => {
      line.style.scale = `${targetWidth / widths[index]} 1`;
    });
  }

  const alignAll = () => headings.forEach(alignHeading);
  alignAll();
  window.addEventListener('resize', alignAll);

  const observer = new ResizeObserver(alignAll);
  headings.forEach((heading) => observer.observe(heading));

  if (document.fonts?.ready) {
    document.fonts.ready.then(alignAll);
  }
}

function setupVideoModal() {
  const modal = document.querySelector('[data-video-modal]');
  const opener = document.querySelector('.video__open');
  const frame = modal?.querySelector('[data-video-modal-frame]');
  const closers = modal ? Array.from(modal.querySelectorAll('[data-video-close]')) : [];
  if (!modal || !opener || !frame) return;

  const embedBase = 'https://www.youtube-nocookie.com/embed/Zhv7c0BlA4Y';
  const playerParams = new URLSearchParams({
    origin: window.location.origin,
    widget_referrer: window.location.href,
    enablejsapi: '1',
    playsinline: '1',
    rel: '0'
  });
  const modalParams = new URLSearchParams(playerParams);
  modalParams.set('autoplay', '1');
  modalParams.set('start', '0');
  const source = `${embedBase}?${modalParams.toString()}`;
  const close = () => {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    frame.src = 'about:blank';
    document.body.classList.remove('video-modal-open');
  };

  opener.addEventListener('click', () => {
    frame.src = source;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('video-modal-open');
  });

  closers.forEach((button) => button.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });
}

function setupMobileScrollToggle() {
  const toggle = document.querySelector('[data-scroll-toggle]');
  const hero = document.querySelector('#hero');
  const mobileQuery = window.matchMedia('(max-width: 640px)');
  if (!toggle || !hero) return;

  const getVisibleSections = () => Array.from(document.querySelectorAll('main > section, footer.footer'))
    .filter((section) => !section.hidden && section.offsetHeight > 0 && window.getComputedStyle(section).display !== 'none')
    .sort((first, second) => {
      const firstTop = first.getBoundingClientRect().top + window.scrollY;
      const secondTop = second.getBoundingClientRect().top + window.scrollY;
      return firstTop - secondTop;
    });

  const syncDirection = () => {
    const sections = getVisibleSections();
    const lastSection = sections.at(-1);
    const reachedLastSection = lastSection && (
      lastSection.getBoundingClientRect().top <= 64
      || window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    );
    const pointsUp = mobileQuery.matches && reachedLastSection;
    toggle.classList.toggle('is-scroll-up', pointsUp);
    toggle.setAttribute('aria-label', pointsUp ? 'Voltar ao início' : 'Ir para a próxima seção');
  };

  toggle.addEventListener('click', () => {
    if (!mobileQuery.matches) return;
    const sections = getVisibleSections();
    const target = toggle.classList.contains('is-scroll-up')
      ? hero
      : sections.find((section) => section.getBoundingClientRect().top > 64);
    if (!target) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    target.scrollIntoView({ behavior, block: 'start' });
  });

  window.addEventListener('scroll', syncDirection, { passive: true });
  window.addEventListener('resize', syncDirection);
  syncDirection();
}

function setupDesktopSectionNavigation() {
  const navigation = document.querySelector('[data-desktop-section-nav]');
  const previousButton = navigation?.querySelector('[data-section-nav-up]');
  const nextButton = navigation?.querySelector('[data-section-nav-down]');
  const desktopQuery = window.matchMedia('(min-width: 821px)');
  if (!navigation || !previousButton || !nextButton) return;

  const getVisibleSections = () => Array.from(document.querySelectorAll('main > section, footer.footer'))
    .filter((section) => !section.hidden && section.offsetHeight > 0 && window.getComputedStyle(section).display !== 'none')
    .sort((first, second) => {
      const firstTop = first.getBoundingClientRect().top + window.scrollY;
      const secondTop = second.getBoundingClientRect().top + window.scrollY;
      return firstTop - secondTop;
    });

  const getCurrentSectionIndex = (sections) => {
    if (!sections.length || window.scrollY <= 2) return 0;
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
      return sections.length - 1;
    }

    const viewportCenter = window.innerHeight / 2;
    const containingIndex = sections.findIndex((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top <= viewportCenter && rect.bottom >= viewportCenter;
    });
    if (containingIndex >= 0) return containingIndex;

    return sections.reduce((nearestIndex, section, index) => {
      const rect = section.getBoundingClientRect();
      const nearestRect = sections[nearestIndex].getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - viewportCenter);
      const nearestDistance = Math.abs(nearestRect.top + nearestRect.height / 2 - viewportCenter);
      return distance < nearestDistance ? index : nearestIndex;
    }, 0);
  };

  const syncButtons = () => {
    const sections = getVisibleSections();
    const currentIndex = getCurrentSectionIndex(sections);
    const disabled = !desktopQuery.matches || sections.length < 2;
    previousButton.disabled = disabled || currentIndex <= 0;
    nextButton.disabled = disabled || currentIndex >= sections.length - 1;
  };

  const navigate = (direction) => {
    if (!desktopQuery.matches) return;
    const sections = getVisibleSections();
    const currentIndex = getCurrentSectionIndex(sections);
    const targetIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));
    const target = sections[targetIndex];
    if (!target || targetIndex === currentIndex) return;
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const block = targetIndex === 0
      ? 'start'
      : targetIndex === sections.length - 1
        ? 'end'
        : 'center';
    target.scrollIntoView({ behavior, block });
  };

  previousButton.addEventListener('click', () => navigate(-1));
  nextButton.addEventListener('click', () => navigate(1));
  window.addEventListener('scroll', syncButtons, { passive: true });
  window.addEventListener('resize', syncButtons);
  desktopQuery.addEventListener('change', syncButtons);
  syncButtons();
}

function setupDesktopHeroEntrance() {
  const hero = document.querySelector('.hero');
  if (!hero || !window.matchMedia('(min-width: 641px)').matches) return;

  const waveAnimations = Array.from(document.querySelectorAll('#heroLogoWaveFilter animate'));

  window.requestAnimationFrame(() => {
    waveAnimations.forEach((animation) => {
      if (typeof animation.beginElement === 'function') animation.beginElement();
    });
    hero.classList.add('is-desktop-hero-active');
  });
}

setupDesktopHeroEntrance();
setupDeferredSectionBackgrounds();
setupPostHeroArtReveal();
setupNumbersArtReveal();
setupVerdadeiroArtReveal();
setupVideoArtReveal();
setupPostVideoArtReveal();
setupSocialArtReveal();
setupFacilitiesArtReveal();
setupOthonArtReveal();
setupAfterOthonArtReveal();
setupSectionArtExitReveal();
setupResidenceSelector();
applyMasks();
setupConfirmationPopup();
setupAppsScriptResponse();
setupFormSteps();
setupFormStatusReset();
setupE5Telemetry();
setupFormSubmit();
setupCountdown();
setupParadeDetails();
setupCountdownDockVisibility();
setupResponsiveHeroVideo();
setupSignupHeadingAlignment();
setupVideoModal();
setupMobileScrollToggle();
setupDesktopSectionNavigation();
