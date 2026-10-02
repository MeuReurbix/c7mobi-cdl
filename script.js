const slides = [...document.querySelectorAll('.slide')];
const navButtons = [...document.querySelectorAll('[data-go]')];
const progress = document.getElementById('progressBar');
const counter = document.getElementById('counter');
const dots = document.getElementById('dots');
let current = 0;
const pricingLink = ''; // inserir URL definitivo da Precificação Inteligente C7MOVI aqui

slides.forEach((_, i) => {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Ir para slide ${i + 1}`);
  b.onclick = () => go(i);
  dots.appendChild(b);
});
const dotButtons = [...dots.children];

function go(i) {
  current = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((s, n) => s.classList.toggle('active', n === current));
  dotButtons.forEach((d, n) => d.classList.toggle('active', n === current));
  document.querySelectorAll('.nav [data-go]').forEach(b => b.classList.toggle('active', Number(b.dataset.go) === current));
  progress.style.width = `${((current + 1) / slides.length) * 100}%`;
  counter.textContent = `${String(current + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  history.replaceState(null, '', `#${current + 1}`);
}

navButtons.forEach(b => b.addEventListener('click', e => {
  if (b.tagName === 'A') e.preventDefault();
  go(Number(b.dataset.go));
}));
document.querySelectorAll('[data-next]').forEach(b => b.onclick = () => go(current + 1));
document.getElementById('prevBtn').onclick = () => go(current - 1);
document.getElementById('nextBtn').onclick = () => go(current + 1);
document.addEventListener('keydown', e => {
  if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); go(current + 1); }
  if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); go(current - 1); }
  if (e.key === 'Home') go(0);
  if (e.key === 'End') go(slides.length - 1);
});

document.getElementById('fullscreenBtn').onclick = async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (e) {}
};

const ext = document.querySelector('[data-pricing-link]');
if (pricingLink) {
  ext.href = pricingLink;
  ext.target = '_blank';
  ext.rel = 'noopener';
  ext.classList.remove('disabled-link');
} else {
  ext.addEventListener('click', e => {
    e.preventDefault();
    alert('O acesso externo à Precificação Inteligente será conectado aqui assim que o URL definitivo for inserido.');
  });
}

let sx = 0;
document.addEventListener('touchstart', e => { sx = e.changedTouches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - sx;
  if (Math.abs(dx) > 55) go(current + (dx < 0 ? 1 : -1));
}, { passive: true });

function setupExplainers() {
  document.querySelectorAll('[data-explain-group]').forEach(group => {
    const targetId = group.dataset.target;
    const target = document.getElementById(targetId);
    if (!target) return;
    const titleEl = target.querySelector('h3');
    const descEl = target.querySelector('p');
    const buttons = [...group.querySelectorAll('[data-title][data-desc]')];
    const setActive = btn => {
      buttons.forEach(b => b.classList.toggle('active', b === btn));
      titleEl.innerHTML = btn.dataset.title || '';
      descEl.innerHTML = btn.dataset.desc || '';
    };
    buttons.forEach(btn => {
      if (btn.tagName === 'BUTTON') btn.type = 'button';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(btn);
      });
    });
    if (buttons.length) setActive(buttons[0]);
  });
}
setupExplainers();

const fromHash = Number(location.hash.replace('#', '')) - 1;
go(Number.isFinite(fromHash) && fromHash >= 0 ? fromHash : 0);
