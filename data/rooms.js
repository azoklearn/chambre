// Données des chambres — source unique de vérité (frontend + backend).
// Tarifs communs à toutes les chambres.
const PRICING = {
  rent: 680,        // Loyer mensuel (chambre standard)
  deposit: 900,     // Dépôt de garantie
  insurance: 100,   // Assurance habitation
};
PRICING.total = PRICING.rent + PRICING.deposit + PRICING.insurance; // 1680 €

// Agencement / équipements communs à chaque chambre
const AMENITIES = [
  { icon: 'wifi', label: 'Wifi' },
  { icon: 'bed', label: 'Lit 140×190' },
  { icon: 'wardrobe', label: 'Armoire' },
  { icon: 'desk', label: 'Bureau' },
  { icon: 'chair', label: 'Chaise' },
  { icon: 'nightstand', label: 'Chevet' },
];

function buildRooms(city, cityLabel, count, folder) {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    return {
      id: `${city}-${n}`,
      number: n,
      city,
      cityLabel,
      title: `Chambre ${n} — ${cityLabel}`,
      image: `/images/${folder}/chambre-${n}.jpeg`,
      amenities: AMENITIES,
      ...PRICING,
    };
  });
}

const ROOMS = [
  ...buildRooms('gagny', 'Gagny', 14, 'gagny'),
  ...buildRooms('rosny', 'Rosny-sous-Bois', 6, 'rosny'),
];

module.exports = { ROOMS, PRICING, AMENITIES };
