/* Prévia de avaliação: sem cadastro real nem Analytics de produção. */
(() => {
  window.MAR_LOCAL_PREVIEW = true;
  window.addEventListener('submit', event => {
    if (event.target.id !== 'lead-form') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const status = document.getElementById('form-status');
    if (status) status.textContent = ({
      en: 'Preview: no registration was sent.',
      es: 'Vista previa: no se ha enviado ningún registro.'
    })[document.documentElement.dataset.locale] || 'Prévia de avaliação: nenhum cadastro foi enviado.';
  }, true);
})();
