const faqItems = Array.from(document.querySelectorAll('.faq__list details'));

faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const countdowns = Array.from(document.querySelectorAll('[data-target]'));

function updateCountdowns() {
  const now = Date.now();

  countdowns.forEach((countdown) => {
    const target = new Date(countdown.dataset.target).getTime();
    const distance = Math.max(0, target - now);
    const values = {
      days: Math.floor(distance / 86400000),
      hours: Math.floor((distance / 3600000) % 24),
      minutes: Math.floor((distance / 60000) % 60),
      seconds: Math.floor((distance / 1000) % 60)
    };

    Object.entries(values).forEach(([unit, value]) => {
      const element = countdown.querySelector(`[data-countdown-${unit}]`);
      if (element) element.textContent = unit === 'days' ? value : String(value).padStart(2, '0');
    });
  });
}

updateCountdowns();
window.setInterval(updateCountdowns, 1000);
