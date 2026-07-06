# Student Flat Room Paris 🏠

Site de location de chambres meublées à **Gagny** (14 chambres) et **Rosny-sous-Bois** (6 chambres).
Présentation des chambres, réservation et **paiement en ligne sécurisé via Stripe**.

- Loyer chambre standard : **680 €/mois**
- Dépôt de garantie : **900 €**
- Assurance habitation : **100 €**
- Total à la réservation : **1 680 €** (1er mois + dépôt + assurance)
- Contact : WhatsApp **+33 6 72 29 47 51**

## Démarrer le site

```bash
npm install
npm start
```

Le site est disponible sur http://localhost:3000

## Activer les paiements Stripe

Le site fonctionne dès l'installation, mais le paiement en ligne nécessite une clé Stripe.

1. Créez un compte sur https://stripe.com
2. Récupérez votre **clé secrète** dans *Développeurs → Clés API*
   (clé de test `sk_test_...` pour essayer, `sk_live_...` en production)
3. Copiez le fichier d'exemple puis collez votre clé :

```bash
cp .env.example .env
```

4. Ouvrez `.env` et renseignez :

```
STRIPE_SECRET_KEY=sk_test_votre_cle
BASE_URL=http://localhost:3000
```

5. Redémarrez le serveur (`npm start`).

> En **test**, utilisez la carte `4242 4242 4242 4242`, une date future et n'importe quel CVC.

En production, remplacez `BASE_URL` par l'adresse réelle du site (ex. `https://votredomaine.fr`).

## Structure

```
server.js            Serveur Express + intégration Stripe Checkout
data/rooms.js        Liste des chambres et tarifs (source unique)
public/
  index.html         Page principale
  styles.css         Design (mobile + desktop)
  app.js             Affichage des chambres, filtres, réservation
  success.html       Page de confirmation après paiement
  images/            Photos des chambres (1 image = 1 chambre)
```

## Ajouter / modifier des chambres

Tout est centralisé dans `data/rooms.js`. Les images sont dans
`public/images/gagny/` et `public/images/rosny/`, nommées `chambre-1.jpeg`, `chambre-2.jpeg`, etc.
Modifiez le nombre de chambres ou les tarifs dans ce fichier, l'affichage se met à jour automatiquement.
