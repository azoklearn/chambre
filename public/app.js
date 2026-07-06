const grid = document.getElementById('rooms-grid');
const filters = document.getElementById('filters');
const modal = document.getElementById('modal');
const euro = (n) => n.toLocaleString('fr-FR') + ' €';

let rooms = [];
let activeCity = 'all';
let selectedRoom = null;

document.getElementById('year').textContent = new Date().getFullYear();

// --- Icônes des équipements (SVG inline) ---
const AMENITY_ICONS = {
  wifi: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="19" r="1.4" fill="currentColor"/>',
  bed: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6h18v6M3 12V7m18 5V9a2 2 0 0 0-2-2H8v5M3 18v2m18-2v2"/>',
  wardrobe: '<rect x="5" y="3" width="14" height="18" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 3v18M9.5 9.5v2m5-2v2"/>',
  desk: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M3 8h18M4 8v12m16-12v12M4 20h5v-4a2 2 0 0 1 2-2h0"/>',
  chair: '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M7 3v9m10-9v9M6 12h12M8 12l-1 8m9-8 1 8M7 16h10"/>',
  nightstand: '<rect x="5" y="6" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M5 12h14M11 9h2m-2 6h2M7 20v1m10-1v1"/>',
};
const amenityIcon = (name) =>
  `<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">${AMENITY_ICONS[name] || ''}</svg>`;

// --- Chargement des chambres ---
async function load() {
  try {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    rooms = data.rooms;
    render();
  } catch (e) {
    grid.innerHTML = '<p style="color:var(--ink-soft)">Impossible de charger les chambres. Réessayez plus tard.</p>';
  }
}

function render() {
  const list = activeCity === 'all' ? rooms : rooms.filter((r) => r.city === activeCity);
  grid.innerHTML = list.map(cardHTML).join('');
  // (re)brancher le scroll-reveal sur les cartes fraîchement rendues, avec stagger
  observeReveals(grid.querySelectorAll('.card.reveal'));
}

function cardHTML(r, i) {
  return `
    <article class="card reveal" style="animation-delay:${(i % 8) * 80}ms">
      <div class="card-media">
        <img src="${r.image}" alt="${r.title}" loading="lazy" />
        <span class="card-badge">${r.cityLabel}</span>
        <span class="card-avail">Disponible</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">Chambre n°${r.number}</h3>
        <p class="card-loc">📍 ${r.cityLabel}</p>
        <ul class="card-amenities">
          ${(r.amenities || []).map((a) => `<li title="${a.label}">${amenityIcon(a.icon)}<span>${a.label}</span></li>`).join('')}
        </ul>
        <p class="card-price"><strong>${euro(r.rent)}</strong> / mois</p>
        <button class="btn btn-primary card-btn" data-room="${r.id}">Réserver cette chambre</button>
      </div>
    </article>`;
}

// --- Filtres ---
filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  activeCity = btn.dataset.city;
  filters.querySelectorAll('.chip').forEach((c) => c.classList.toggle('is-active', c === btn));
  render();
});

// --- Ouverture du modal ---
grid.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-room]');
  if (!btn) return;
  selectedRoom = rooms.find((r) => r.id === btn.dataset.room);
  openModal(selectedRoom);
});

function openModal(r) {
  document.getElementById('modal-img').src = r.image;
  document.getElementById('modal-img').alt = r.title;
  document.getElementById('modal-title').textContent = `Chambre n°${r.number}`;
  document.getElementById('modal-city').textContent = `📍 ${r.cityLabel}`;
  document.getElementById('modal-amenities').innerHTML = (r.amenities || [])
    .map((a) => `<li>${amenityIcon(a.icon)}<span>${a.label}</span></li>`)
    .join('');
  document.getElementById('modal-error').hidden = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close')) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

// --- Paiement Stripe ---
const payBtn = document.getElementById('pay-btn');
payBtn.addEventListener('click', async () => {
  if (!selectedRoom) return;
  const email = document.getElementById('modal-email').value.trim();
  const errEl = document.getElementById('modal-error');
  errEl.hidden = true;

  payBtn.disabled = true;
  payBtn.textContent = 'Redirection vers le paiement…';

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: selectedRoom.id, email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
    window.location.href = data.url;
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
    payBtn.disabled = false;
    payBtn.textContent = 'Réserver & payer en ligne';
  }
});

// Message si paiement annulé
if (new URLSearchParams(location.search).get('canceled')) {
  // nettoyage de l'URL
  history.replaceState({}, '', location.pathname + '#chambres');
}

/* ============================================================
   ANIMATIONS
   ============================================================ */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- Scroll reveal (IntersectionObserver) ---
const revealObserver = reduceMotion
  ? null
  : new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('in'), delay);
          // animer les coches des "features" une à une
          if (el.classList.contains('features')) {
            [...el.children].forEach((li, i) => {
              setTimeout(() => li.classList.add('in-tick'), delay + i * 120);
            });
          }
          obs.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

function observeReveals(nodes) {
  if (reduceMotion) {
    nodes.forEach((n) => n.classList.add('in'));
    return;
  }
  nodes.forEach((n) => revealObserver.observe(n));
}

// Révéler tous les éléments .reveal statiques déjà présents
observeReveals(document.querySelectorAll('.reveal'));

// --- Compteurs animés dans le hero ---
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.innerHTML = target.toLocaleString('fr-FR') + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.innerHTML = Math.round(target * eased).toLocaleString('fr-FR') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
// démarrer après l'entrée du hero
setTimeout(animateCounters, reduceMotion ? 0 : 850);

// --- Ombre du header au scroll ---
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- Menu hamburger (mobile) ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
function setMenu(open) {
  navLinks.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}
navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
// Fermer le menu après un clic sur un lien
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
// Fermer avec Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) setMenu(false);
});

load();
