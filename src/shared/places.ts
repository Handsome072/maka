/**
 * Lieux des annonces : noms lisibles des provinces et pays, recherche par destination
 * et suggestions de destinations. Partagé entre l'API publique et les pages.
 */

const PROVINCE_NAMES: Record<string, string> = {
  QC: 'Québec',
  ON: 'Ontario',
  BC: 'Colombie-Britannique',
  AB: 'Alberta',
  MB: 'Manitoba',
  SK: 'Saskatchewan',
  NB: 'Nouveau-Brunswick',
  NS: 'Nouvelle-Écosse',
  PE: 'Île-du-Prince-Édouard',
  NL: 'Terre-Neuve-et-Labrador',
  YT: 'Yukon',
  NT: 'Territoires du Nord-Ouest',
  NU: 'Nunavut',
};

const COUNTRY_NAMES: Record<string, string> = {
  CA: 'Canada',
  US: 'États-Unis',
  FR: 'France',
};

/** « QC » → « Québec » ; vide pour « Other » ou une valeur absente. */
export function provinceName(code: string | null | undefined): string {
  if (!code || code === 'Other') return '';
  return PROVINCE_NAMES[code.toUpperCase()] ?? code;
}

/** « CA » → « Canada » ; vide pour « Other » ou une valeur absente. */
export function countryName(code: string | null | undefined): string {
  if (!code || code === 'Other') return '';
  return COUNTRY_NAMES[code.toUpperCase()] ?? code;
}

/** Minuscules sans accents ni ponctuation : « Île d'Orléans » → « ile d orleans ». */
export function normalizePlace(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

export interface PlaceFields {
  title?: string | null;
  subtitle?: string | null;
  city?: string | null;
  county?: string | null;
  mrc?: string | null;
  province?: string | null;
  country?: string | null;
}

/** Texte normalisé, entouré d'espaces : un terme y est cherché en début de mot. */
function haystack(values: Array<string | null | undefined>): string {
  return ` ${values.filter(Boolean).map((value) => normalizePlace(String(value))).join(' ')} `;
}

function regionFields(listing: PlaceFields): Array<string | null | undefined> {
  return [listing.province, provinceName(listing.province), listing.country, countryName(listing.country)];
}

/**
 * Vrai si l'annonce correspond à la destination saisie.
 * « Tremblant » ou « Québec » : cherché partout (ville, titre, région, province, pays).
 * « Mont-Tremblant, Québec » : la première partie désigne le lieu (ville, titre, région),
 * les suivantes la province ou le pays — « Quebec, Québec » ne renvoie donc que la ville.
 */
export function matchesDestination(listing: PlaceFields, destination: string): boolean {
  const parts = destination.split(',').map(normalizePlace).filter(Boolean);
  if (parts.length === 0) return true;

  const local = haystack([listing.title, listing.subtitle, listing.city, listing.county, listing.mrc]);
  const region = haystack(regionFields(listing));
  const found = (text: string, part: string) => text.includes(` ${part}`);

  if (parts.length === 1) {
    return found(local, parts[0]) || found(region, parts[0]);
  }
  return found(local, parts[0]) && parts.slice(1).every((part) => found(region, part));
}

/** « Mont-Tremblant, Québec » : ville suivie de la province (ou du pays). */
export function placeLabel(listing: PlaceFields): string {
  return [listing.city?.trim(), provinceName(listing.province) || countryName(listing.country)]
    .filter(Boolean)
    .join(', ');
}

export interface DestinationSuggestion {
  label: string;
  kind: 'province' | 'city';
  count: number;
}

/**
 * Destinations où il existe au moins une annonce : les provinces qui en comptent plusieurs,
 * puis les villes, chacune avec son nombre d'annonces, des plus fournies aux moins fournies.
 */
export function destinationSuggestions(listings: PlaceFields[]): DestinationSuggestion[] {
  const provinces = new Map<string, number>();
  const cities = new Map<string, { label: string; count: number }>();

  for (const listing of listings) {
    const province = provinceName(listing.province);
    if (province) provinces.set(province, (provinces.get(province) ?? 0) + 1);

    if (listing.city?.trim()) {
      const label = placeLabel(listing);
      const key = normalizePlace(label);
      const entry = cities.get(key) ?? { label, count: 0 };
      entry.count += 1;
      cities.set(key, entry);
    }
  }

  const byCount = (a: DestinationSuggestion, b: DestinationSuggestion) =>
    b.count - a.count || a.label.localeCompare(b.label, 'fr');

  return [
    ...[...provinces]
      .filter(([, count]) => count > 1)
      .map(([label, count]): DestinationSuggestion => ({ label, kind: 'province', count }))
      .sort(byCount),
    ...[...cities.values()].map((city): DestinationSuggestion => ({ ...city, kind: 'city' })).sort(byCount),
  ];
}

/** Suggestions dont le libellé contient le texte saisi (en début de mot). */
export function filterSuggestions(suggestions: DestinationSuggestion[], typed: string): DestinationSuggestion[] {
  const query = normalizePlace(typed);
  if (!query) return suggestions;
  return suggestions.filter((suggestion) => haystack([suggestion.label]).includes(` ${query}`));
}
