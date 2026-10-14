// Libellés des lits, pour les deux formats stockés :
// { simple: 1, double: 0, … } (parcours hôte) et [{ type: 'single', count: 1 }] (annonces importées).
export const BED_TYPE_LABELS: Record<string, string> = {
  simple: 'Lit simple',
  single: 'Lit simple',
  double: 'Lit double',
  queen: 'Lit Queen',
  king: 'Lit King',
  simple_bunk: 'Lit simple superposé',
  double_bunk: 'Lit double superposé',
  queen_bunk: 'Lit queen superposé',
  king_bunk: 'Lit king superposé',
  sofa_bed: 'Canapé-lit',
  other: "Matériel d'appoint",
};
