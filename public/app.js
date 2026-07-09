const grid = document.getElementById('rooms-grid');
const filters = document.getElementById('filters');
const modal = document.getElementById('modal');
const euro = (n) => n.toLocaleString(LANG === 'en' ? 'en-GB' : 'fr-FR') + ' €';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let rooms = [];
let activeCity = 'all';
let selectedRoom = null;

document.getElementById('year').textContent = new Date().getFullYear();

/* ============================================================
   INTERNATIONALISATION (FR / EN)
   ============================================================ */
const I18N = {
  fr: {
    'meta.title': 'Student Flat Room Paris — Chambres meublées à Gagny & Rosny-sous-Bois',
    'meta.desc': 'Chambres meublées tout confort à Gagny et Rosny-sous-Bois, proche Paris. Loyer 680€/mois. Réservez et payez en ligne en toute sécurité.',
    'nav.menu': 'Menu',
    'nav.rooms': 'Chambres',
    'nav.info': 'Infos &amp; tarifs',
    'nav.contact': 'Contact',
    'nav.book': 'Réserver',
    'nav.bookRoom': 'Réserver une chambre',
    'hero.title': 'Votre chambre meublée,<br /><em>aux portes de Paris.</em>',
    'hero.sub': 'Des chambres tout confort, prêtes à vivre, à deux pas des transports. Réservez et payez en ligne en quelques minutes.',
    'hero.cta1': 'Voir les chambres',
    'hero.cta2': 'Tarifs &amp; conditions',
    'hero.stat1': 'chambres',
    'hero.stat2': 'par mois',
    'hero.stat3': 'résidences',
    'hero.scroll': 'Découvrir',
    'marquee': 'Chambres meublées ✦ Gagny ✦ Rosny-sous-Bois ✦ 680 € par mois ✦ Paiement en ligne sécurisé',
    'rooms.title': 'Nos chambres <em>disponibles</em>',
    'rooms.sub': 'Chaque photo correspond à une chambre réelle. Choisissez la vôtre.',
    'filters.all': 'Toutes',
    'band.quote': 'Des espaces pensés pour vivre, pas seulement pour dormir.',
    'band.cap': 'Salle de bain — Résidence de Gagny',
    'info.title': 'Tarifs &amp; <em>conditions</em>',
    'info.sub': 'Une tarification claire, identique pour toutes les chambres.',
    'price.rentLabel': 'Loyer mensuel',
    'price.rentNote': 'chambre standard, charges comprises',
    'price.depositLabel': 'Dépôt de garantie',
    'price.depositNote': 'restitué en fin de séjour',
    'price.insuranceLabel': 'Assurance habitation',
    'price.insuranceNote': 'couverture obligatoire',
    'total.label': 'À régler pour réserver votre entrée',
    'total.sub': '1<sup>er</sup> mois + dépôt + assurance',
    'features.f1': 'Chambres entièrement meublées &amp; équipées',
    'features.f2': 'Salle de bain moderne',
    'features.f3': 'Proche transports vers Paris',
    'features.f4': 'Paiement sécurisé par Stripe',
    'contact.title': 'Une question&nbsp;? <em>Parlons-en.</em>',
    'contact.sub': 'Écrivez-nous directement sur WhatsApp, réponse rapide — ou appelez-nous.',
    'contact.or': 'ou par téléphone :',
    'footer.sub': 'Paiement sécurisé · Chambres meublées · Île-de-France',
    'modal.amenTitle': 'Agencement de la chambre',
    'modal.rent': '1<sup>er</sup> mois de loyer',
    'modal.deposit': 'Dépôt de garantie',
    'modal.insurance': 'Assurance habitation',
    'modal.total': 'Total à régler',
    'modal.emailLabel': 'Votre e-mail (pour le reçu)',
    'modal.emailPh': 'prenom@email.com',
    'modal.emailErr': 'Adresse e-mail invalide.',
    'modal.payBtn': 'Réserver &amp; payer en ligne',
    'modal.processing': 'Redirection vers le paiement…',
    'modal.secure': 'Paiement sécurisé via Stripe — aucune donnée bancaire ne transite par ce site.',
    'modal.wa': 'Préférez réserver via WhatsApp&nbsp;?',
    'card.available': 'Disponible',
    'card.room': 'Chambre n°',
    'card.perMonth': '/ mois',
    'card.book': 'Réserver',
    'error.unknown': 'Erreur inconnue',
  },
  en: {
    'meta.title': 'Student Flat Room Paris — Furnished rooms in Gagny & Rosny-sous-Bois',
    'meta.desc': 'Comfortable furnished rooms in Gagny and Rosny-sous-Bois, near Paris. Rent €680/month. Book and pay online securely.',
    'nav.menu': 'Menu',
    'nav.rooms': 'Rooms',
    'nav.info': 'Info &amp; pricing',
    'nav.contact': 'Contact',
    'nav.book': 'Book',
    'nav.bookRoom': 'Book a room',
    'hero.title': 'Your furnished room,<br /><em>at the gates of Paris.</em>',
    'hero.sub': 'Fully-equipped, move-in-ready rooms, moments from public transport. Book and pay online in just a few minutes.',
    'hero.cta1': 'See the rooms',
    'hero.cta2': 'Pricing &amp; terms',
    'hero.stat1': 'rooms',
    'hero.stat2': 'per month',
    'hero.stat3': 'residences',
    'hero.scroll': 'Discover',
    'marquee': 'Furnished rooms ✦ Gagny ✦ Rosny-sous-Bois ✦ €680 per month ✦ Secure online payment',
    'rooms.title': 'Our <em>available</em> rooms',
    'rooms.sub': 'Each photo shows a real room. Choose yours.',
    'filters.all': 'All',
    'band.quote': 'Spaces designed for living, not just for sleeping.',
    'band.cap': 'Bathroom — Gagny residence',
    'info.title': 'Pricing &amp; <em>terms</em>',
    'info.sub': 'Clear pricing, identical for every room.',
    'price.rentLabel': 'Monthly rent',
    'price.rentNote': 'standard room, utilities included',
    'price.depositLabel': 'Security deposit',
    'price.depositNote': 'refunded at the end of your stay',
    'price.insuranceLabel': 'Home insurance',
    'price.insuranceNote': 'mandatory coverage',
    'total.label': 'Due to secure your move-in',
    'total.sub': '1st month + deposit + insurance',
    'features.f1': 'Fully furnished &amp; equipped rooms',
    'features.f2': 'Modern bathroom',
    'features.f3': 'Close to transport to Paris',
    'features.f4': 'Secure payment via Stripe',
    'contact.title': 'A question? <em>Let’s talk.</em>',
    'contact.sub': 'Message us directly on WhatsApp — quick reply. Or give us a call.',
    'contact.or': 'or by phone:',
    'footer.sub': 'Secure payment · Furnished rooms · Greater Paris',
    'modal.amenTitle': 'Room layout',
    'modal.rent': "First month's rent",
    'modal.deposit': 'Security deposit',
    'modal.insurance': 'Home insurance',
    'modal.total': 'Total due',
    'modal.emailLabel': 'Your email (for the receipt)',
    'modal.emailPh': 'firstname@email.com',
    'modal.emailErr': 'Invalid email address.',
    'modal.payBtn': 'Book &amp; pay online',
    'modal.processing': 'Redirecting to payment…',
    'modal.secure': 'Secure payment via Stripe — no bank details pass through this site.',
    'modal.wa': 'Prefer to book via WhatsApp?',
    'card.available': 'Available',
    'card.room': 'Room ',
    'card.perMonth': '/ month',
    'card.book': 'Book',
    'error.unknown': 'Unknown error',
  },
};

const AMENITY_LABELS = {
  fr: { wifi: 'Wifi', bed: 'Lit 140×190', wardrobe: 'Armoire', desk: 'Bureau', chair: 'Chaise', nightstand: 'Chevet' },
  en: { wifi: 'Wi-Fi', bed: 'Bed 140×190', wardrobe: 'Wardrobe', desk: 'Desk', chair: 'Chair', nightstand: 'Nightstand' },
};

let LANG = (() => {
  const saved = localStorage.getItem('lang');
  if (saved === 'fr' || saved === 'en') return saved;
  return (navigator.language || 'fr').toLowerCase().startsWith('en') ? 'en' : 'fr';
})();

const t = (key) => (I18N[LANG] && I18N[LANG][key]) || I18N.fr[key] || key;
const amenityLabel = (icon) => (AMENITY_LABELS[LANG] || AMENITY_LABELS.fr)[icon] || icon;
const stripTags = (html) => html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-ph]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPh);
  });
  document.documentElement.lang = LANG;
  document.title = stripTags(t('meta.title'));
  const md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute('content', stripTags(t('meta.desc')));
}

/* Titre du hero découpé ligne à ligne pour la révélation en masque */
function splitHeroTitle() {
  const h1 = document.getElementById('hero-title');
  if (!h1) return;
  const parts = t('hero.title').split(/<br\s*\/?>/i);
  h1.innerHTML = parts
    .map((p, i) => `<span class="hline"><span class="hline-in" style="transition-delay:${0.55 + i * 0.14}s">${p}</span></span>`)
    .join('');
}

/* Bandeau défilant : deux segments identiques pour une boucle sans couture */
function buildMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  const seg = (t('marquee') + ' ✦ ').repeat(3);
  track.innerHTML = `<span class="marquee-seg">${seg}</span><span class="marquee-seg">${seg}</span>`;
}

function updateLangToggle() {
  document.querySelectorAll('#lang-toggle button').forEach((b) => {
    b.classList.toggle('is-active', b.dataset.lang === LANG);
  });
}

function setLang(lang) {
  LANG = lang === 'en' ? 'en' : 'fr';
  localStorage.setItem('lang', LANG);
  applyStaticI18n();
  splitHeroTitle();
  buildMarquee();
  updateLangToggle();
  render();
  refreshModalIfOpen();
}

document.getElementById('lang-toggle').addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-lang]');
  if (btn) setLang(btn.dataset.lang);
});

// --- Icônes des équipements (SVG inline) ---
const AMENITY_ICONS = {
  wifi: '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M5 12.5a10 10 0 0 1 14 0M8 15.5a6 6 0 0 1 8 0"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/>',
  bed: '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M3 18v-6h18v6M3 12V7m18 5V9a2 2 0 0 0-2-2H8v5M3 18v2m18-2v2"/>',
  wardrobe: '<rect x="5" y="3" width="14" height="18" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M12 3v18M9.5 9.5v2m5-2v2"/>',
  desk: '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M3 8h18M4 8v12m16-12v12M4 20h5v-4a2 2 0 0 1 2-2h0"/>',
  chair: '<path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" d="M7 3v9m10-9v9M6 12h12M8 12l-1 8m9-8 1 8M7 16h10"/>',
  nightstand: '<rect x="5" y="6" width="14" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" d="M5 12h14M11 9h2m-2 6h2M7 20v1m10-1v1"/>',
};
const amenityIcon = (name) =>
  `<svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">${AMENITY_ICONS[name] || ''}</svg>`;

// --- Chargement des chambres ---
async function load() {
  try {
    const res = await fetch('/api/rooms');
    const data = await res.json();
    rooms = data.rooms;
    render();
  } catch (e) {
    grid.innerHTML = '<p class="grid-msg">Impossible de charger les chambres. Réessayez plus tard.</p>';
  }
}

function render() {
  const list = activeCity === 'all' ? rooms : rooms.filter((r) => r.city === activeCity);
  grid.innerHTML = list.map(cardHTML).join('');
  // (re)brancher le scroll-reveal sur les cartes fraîchement rendues, avec stagger
  observeReveals(grid.querySelectorAll('.card.reveal'));
}

function cardHTML(r, i) {
  const num = String(r.number).padStart(2, '0');
  return `
    <article class="card reveal" style="animation-delay:${(i % 9) * 70}ms">
      <div class="card-media">
        <img src="${r.image}" alt="${r.title}" loading="lazy" />
        <span class="card-num" aria-hidden="true">${num}</span>
        <span class="card-avail">${t('card.available')}</span>
      </div>
      <div class="card-body">
        <div class="card-head">
          <h3 class="card-title">${t('card.room')}${num}</h3>
          <span class="card-loc">${r.cityLabel}</span>
        </div>
        <ul class="card-amenities">
          ${(r.amenities || []).map((a) => `<li title="${amenityLabel(a.icon)}" aria-label="${amenityLabel(a.icon)}">${amenityIcon(a.icon)}</li>`).join('')}
        </ul>
        <div class="card-foot">
          <p class="card-price"><strong>${euro(r.rent)}</strong><span>${t('card.perMonth')}</span></p>
          <button class="card-btn" data-room="${r.id}">
            ${t('card.book')}
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg>
          </button>
        </div>
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
  const num = String(r.number).padStart(2, '0');
  document.getElementById('modal-img').src = r.image;
  document.getElementById('modal-img').alt = r.title;
  document.getElementById('modal-title').textContent = `${t('card.room')}${num}`;
  document.getElementById('modal-city').textContent = `${r.cityLabel} · Île-de-France`;
  document.getElementById('modal-amenities').innerHTML = (r.amenities || [])
    .map((a) => `<li>${amenityIcon(a.icon)}<span>${amenityLabel(a.icon)}</span></li>`)
    .join('');
  document.getElementById('modal-error').hidden = true;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

// Rafraîchir le contenu dynamique du modal si ouvert (changement de langue)
function refreshModalIfOpen() {
  if (!modal.hidden && selectedRoom) {
    const num = String(selectedRoom.number).padStart(2, '0');
    document.getElementById('modal-title').textContent = `${t('card.room')}${num}`;
    document.getElementById('modal-city').textContent = `${selectedRoom.cityLabel} · Île-de-France`;
    document.getElementById('modal-amenities').innerHTML = (selectedRoom.amenities || [])
      .map((a) => `<li>${amenityIcon(a.icon)}<span>${amenityLabel(a.icon)}</span></li>`)
      .join('');
  }
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

  // Validation simple de l'e-mail (optionnel, mais s'il est saisi il doit être valide)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errEl.textContent = t('modal.emailErr');
    errEl.hidden = false;
    return;
  }

  payBtn.disabled = true;
  payBtn.textContent = stripTags(t('modal.processing'));

  try {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roomId: selectedRoom.id, email, lang: LANG }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || t('error.unknown'));
    window.location.href = data.url;
  } catch (err) {
    errEl.textContent = err.message;
    errEl.hidden = false;
    payBtn.disabled = false;
    payBtn.innerHTML = t('modal.payBtn');
  }
});

// Message si paiement annulé
if (new URLSearchParams(location.search).get('canceled')) {
  // nettoyage de l'URL
  history.replaceState({}, '', location.pathname + '#chambres');
}

/* ============================================================
   PRELOADER — ouverture de séance
   ============================================================ */
function initLoader() {
  const done = () => {
    if (document.body.classList.contains('is-ready')) return;
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-ready');
    // les compteurs démarrent quand le rideau est levé
    setTimeout(animateCounters, reduceMotion ? 0 : 1000);
  };
  if (reduceMotion) {
    done();
    return;
  }
  const MIN = 1100; // durée minimale d'affichage du loader
  const t0 = performance.now();
  window.addEventListener('load', () => {
    const wait = Math.max(0, MIN - (performance.now() - t0));
    setTimeout(done, wait);
  });
  // garde-fou si l'évènement load tarde (image lente, etc.)
  setTimeout(done, 3200);
}

/* ============================================================
   HERO — diaporama Ken Burns
   ============================================================ */
function initSlideshow() {
  const slides = [...document.querySelectorAll('.hero-slide')];
  const idxEl = document.getElementById('slide-idx');
  if (slides.length < 2 || reduceMotion) return;
  let i = 0;
  setInterval(() => {
    if (document.hidden) return; // onglet en arrière-plan
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
    if (idxEl) idxEl.textContent = String(i + 1).padStart(2, '0');
  }, 6500);
}

/* ============================================================
   PARALLAXE — hero + bandes immersives
   ============================================================ */
function initParallax() {
  if (reduceMotion) return;
  const heroBg = document.getElementById('hero-bg');
  const els = [...document.querySelectorAll('[data-parallax]')];
  if (!heroBg && !els.length) return;

  let ticking = false;
  const update = () => {
    ticking = false;
    if (heroBg) {
      const y = Math.min(window.scrollY, window.innerHeight);
      heroBg.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
    }
    els.forEach((el) => {
      const rate = parseFloat(el.dataset.parallax) || 0.15;
      const rect = el.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translate3d(0, ${-delta * rate}px, 0)`;
    });
  };
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* ============================================================
   BARRE DE PROGRESSION DE LECTURE
   ============================================================ */
function initProgress() {
  const bar = document.getElementById('progress');
  if (!bar) return;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

/* ============================================================
   CURSEUR CUSTOM (desktop uniquement)
   ============================================================ */
function initCursor() {
  if (reduceMotion || !window.matchMedia('(pointer: fine)').matches) return;
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  document.body.classList.add('has-cursor');
  let x = innerWidth / 2, y = innerHeight / 2;
  let rx = x, ry = y;
  let visible = false;

  window.addEventListener('mousemove', (e) => {
    x = e.clientX;
    y = e.clientY;
    dot.style.transform = `translate(${x}px, ${y}px)`;
    if (!visible) {
      visible = true;
      rx = x; ry = y;
      document.body.classList.add('cursor-visible');
    }
  }, { passive: true });

  document.documentElement.addEventListener('mouseleave', () => {
    visible = false;
    document.body.classList.remove('cursor-visible');
  });

  // L'anneau suit avec inertie
  (function loop() {
    rx += (x - rx) * 0.16;
    ry += (y - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(loop);
  })();

  // Grossit sur les éléments interactifs
  const HOVERABLE = 'a, button, .chip, [data-cursor]';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(HOVERABLE)) ring.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(HOVERABLE)) ring.classList.remove('is-hover');
  });
}

/* ============================================================
   ANIMATIONS AU SCROLL
   ============================================================ */

// --- Scroll reveal (IntersectionObserver) ---
const revealObserver = reduceMotion
  ? null
  : new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            // Élément déjà dépassé (arrivée via ancre / restauration de scroll) : afficher sans animer
            if (entry.boundingClientRect.bottom < 0) {
              entry.target.classList.add('in');
              if (entry.target.classList.contains('features')) {
                [...entry.target.children].forEach((li) => li.classList.add('in-tick'));
              }
              obs.unobserve(entry.target);
            }
            return;
          }
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('in'), delay);
          // animer les tirets des "features" un à un
          if (el.classList.contains('features')) {
            [...el.children].forEach((li, i) => {
              setTimeout(() => li.classList.add('in-tick'), delay + 400 + i * 140);
            });
          }
          obs.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

function observeReveals(nodes) {
  if (reduceMotion) {
    nodes.forEach((n) => {
      n.classList.add('in');
      if (n.classList.contains('features')) {
        [...n.children].forEach((li) => li.classList.add('in-tick'));
      }
    });
    return;
  }
  nodes.forEach((n) => revealObserver.observe(n));
}

// --- Compteurs animés dans le hero ---
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) {
      el.innerHTML = target.toLocaleString('fr-FR') + suffix;
      return;
    }
    const duration = 1500;
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

// --- Header : verre fumé au scroll ---
const nav = document.querySelector('.nav');
const onScrollNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

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

/* ============================================================
   INITIALISATION
   ============================================================ */
applyStaticI18n();
splitHeroTitle();
buildMarquee();
updateLangToggle();
initLoader();
initSlideshow();
initParallax();
initProgress();
initCursor();
observeReveals(document.querySelectorAll('.reveal'));
load();
