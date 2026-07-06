// Données des chambres — source unique de vérité (frontend + backend).
// Tarifs communs à toutes les chambres.
const PRICING = {
  rent: 680,        // Loyer mensuel (chambre standard)
  deposit: 900,     // Dépôt de garantie
  insurance: 100,   // Assurance habitation
};
PRICING.total = PRICING.rent + PRICING.deposit + PRICING.insurance; // 1680 €

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
      ...PRICING,
    };
  });
}

const ROOMS = [
  ...buildRooms('gagny', 'Gagny', 14, 'gagny'),
  ...buildRooms('rosny', 'Rosny-sous-Bois', 6, 'rosny'),
];

module.exports = { ROOMS, PRICING };
