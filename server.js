require('dotenv').config();
const express = require('express');
const path = require('path');
const { ROOMS, PRICING } = require('./data/rooms');

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// Stripe — la clé secrète vit uniquement côté serveur (voir .env)
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? require('stripe')(stripeKey) : null;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Liste des chambres (sans données sensibles)
app.get('/api/rooms', (req, res) => {
  res.json({ rooms: ROOMS, pricing: PRICING });
});

// Création d'une session de paiement Stripe Checkout
app.post('/api/checkout', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(503).json({
        error:
          "Le paiement en ligne n'est pas encore configuré. Ajoutez STRIPE_SECRET_KEY dans le fichier .env.",
      });
    }

    const room = ROOMS.find((r) => r.id === req.body.roomId);
    if (!room) return res.status(400).json({ error: 'Chambre introuvable.' });

    const lang = req.body.lang === 'en' ? 'en' : 'fr';

    const line = (name, description, amount) => ({
      quantity: 1,
      price_data: {
        currency: 'eur',
        unit_amount: amount * 100, // centimes
        product_data: { name, description },
      },
    });

    const labels = {
      fr: { rent: 'Premier mois de loyer', deposit: 'Dépôt de garantie', insurance: 'Assurance habitation' },
      en: { rent: 'First month of rent', deposit: 'Security deposit', insurance: 'Home insurance' },
    }[lang];

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        line(labels.rent, room.title, room.rent),
        line(labels.deposit, room.title, room.deposit),
        line(labels.insurance, room.title, room.insurance),
      ],
      customer_email: req.body.email || undefined,
      metadata: { roomId: room.id, roomTitle: room.title },
      success_url: `${BASE_URL}/success.html?room=${encodeURIComponent(room.title)}&lang=${lang}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/?canceled=1#chambres`,
      locale: lang,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Erreur Stripe:', err.message);
    res.status(500).json({ error: 'Impossible de créer la session de paiement.' });
  }
});

app.listen(PORT, () => {
  console.log(`Student Flat Room Paris — http://localhost:${PORT}`);
  console.log(stripe ? '✓ Stripe configuré' : '⚠ Stripe non configuré (mode démo)');
});
