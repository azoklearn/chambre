const grid = document.getElementById('rooms-grid');
const filters = document.getElementById('filters');
const modal = document.getElementById('modal');
const euro = (n) => n.toLocaleString('fr-FR') + ' €';

let rooms = [];
let activeCity = 'all';
let selectedRoom = null;

document.getElementById('year').textContent = new Date().getFullYear();

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
}

function cardHTML(r) {
  return `
    <article class="card">
      <div class="card-media">
        <img src="${r.image}" alt="${r.title}" loading="lazy" />
        <span class="card-badge">${r.cityLabel}</span>
        <span class="card-avail">Disponible</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">Chambre n°${r.number}</h3>
        <p class="card-loc">📍 ${r.cityLabel}</p>
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

load();
