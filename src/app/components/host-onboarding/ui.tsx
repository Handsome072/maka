'use client';

import type { ReactNode } from 'react';
import { Check, ChevronDown, ImageIcon, Minus, Plus, type LucideIcon } from 'lucide-react';

/**
 * Briques d'interface du parcours « Devenir hôte ».
 * Couleurs : noir #222222 pour les actions, turquoise de la marque pour la progression,
 * turquoise foncé (#0A6E85, contraste AA sur blanc) pour les textes d'accent et les coches.
 */

export const inputClass =
  'w-full h-12 px-4 rounded-xl border border-[#CFCFCF] bg-white text-[15px] text-[#222222] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222] transition-colors';

export const textareaClass =
  'w-full px-4 py-3 rounded-xl border border-[#CFCFCF] bg-white text-[15px] leading-relaxed text-[#222222] placeholder:text-[#8A8A8A] focus:outline-none focus:border-[#222222] focus:ring-1 focus:ring-[#222222] transition-colors resize-y';

type IconType = LucideIcon;

// ─── En-têtes ────────────────────────────────────────────────────────────────

export function StepHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  eyebrowOnMobile = false,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  icon?: IconType;
  /** Le chapitre est déjà affiché par la barre de progression mobile : sur-titre masqué sauf demande. */
  eyebrowOnMobile?: boolean;
}) {
  return (
    <div className="mb-10 space-y-2.5">
      {Icon && (
        <div className="mb-4 w-[52px] h-[52px] rounded-full bg-[#E6F6F9] text-[#0A6E85] flex items-center justify-center">
          <Icon className="w-6 h-6" strokeWidth={2.5} />
        </div>
      )}
      {eyebrow && <p className={`text-sm font-semibold text-[#0A6E85] ${eyebrowOnMobile ? '' : 'hidden lg:block'}`}>{eyebrow}</p>}
      <h1 className="text-[28px] md:text-[32px] leading-tight font-bold tracking-[-0.02em] text-[#222222]">{title}</h1>
      {description && <p className="max-w-[600px] text-base leading-relaxed text-[#555555]">{description}</p>}
    </div>
  );
}

export function SectionTitle({ children, aside, id }: { children: ReactNode; aside?: ReactNode; id?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 mb-4">
      <h2 id={id} className="text-[17px] font-semibold text-[#222222]">{children}</h2>
      {aside && <span className="text-[13px] text-[#6A6A6A]">{aside}</span>}
    </div>
  );
}

// ─── Choix ───────────────────────────────────────────────────────────────────

/**
 * Carte de choix. « tile » : icône en haut et coche en haut à droite ;
 * « row » : pastille radio à gauche, pour les choix en liste.
 */
export function OptionCard({
  selected,
  onClick,
  title,
  description,
  icon: Icon,
  layout = 'tile',
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  description?: string;
  icon?: IconType;
  layout?: 'tile' | 'row';
}) {
  const frame = selected
    ? 'border-[#222222] shadow-[inset_0_0_0_1px_#222222] bg-[#FAFAFA]'
    : 'border-[#DDDDDD] bg-white hover:border-[#9A9A9A]';

  if (layout === 'row') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={selected}
        className={`w-full flex items-start gap-3.5 rounded-2xl border px-5 py-4 text-left transition-colors ${frame}`}
      >
        <span
          className={`mt-0.5 w-[22px] h-[22px] flex-shrink-0 rounded-full border-[1.5px] flex items-center justify-center ${
            selected ? 'border-[#222222]' : 'border-[#BDBDBD]'
          }`}
        >
          {selected && <span className="w-2.5 h-2.5 rounded-full bg-[#222222]" />}
        </span>
        {Icon && <Icon className="w-6 h-6 flex-shrink-0 text-[#222222]" strokeWidth={1.75} />}
        <span className="space-y-1">
          <span className="block text-base font-semibold text-[#222222]">{title}</span>
          {description && <span className="block text-sm leading-snug text-[#6A6A6A]">{description}</span>}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative w-full h-full flex flex-col items-start gap-3.5 rounded-2xl border p-5 text-left transition-colors ${frame}`}
    >
      {Icon && <Icon className="w-7 h-7 text-[#222222]" strokeWidth={1.75} />}
      <span className="space-y-1 pr-6">
        <span className="block text-base font-semibold text-[#222222]">{title}</span>
        {description && <span className="block text-sm leading-snug text-[#6A6A6A]">{description}</span>}
      </span>
      {selected && (
        <span className="absolute top-3.5 right-3.5 w-6 h-6 rounded-full bg-[#0A6E85] flex items-center justify-center">
          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

/** Tuile à cocher (équipements, jours de la semaine). */
export function CheckTile({
  selected,
  onClick,
  label,
  icon: Icon,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
  icon?: IconType;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full min-h-[56px] flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-sm transition-colors ${
        selected
          ? 'border-[#222222] shadow-[inset_0_0_0_1px_#222222] bg-[#FAFAFA] font-semibold'
          : 'border-[#DDDDDD] bg-white font-medium hover:border-[#9A9A9A]'
      }`}
    >
      <span
        className={`w-5 h-5 flex-shrink-0 rounded-md border-[1.5px] flex items-center justify-center ${
          selected ? 'bg-[#222222] border-[#222222]' : 'bg-white border-[#BDBDBD]'
        }`}
      >
        {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3.5} />}
      </span>
      {Icon && <Icon className="w-[18px] h-[18px] flex-shrink-0 text-[#484848]" strokeWidth={1.75} />}
      <span className="text-[#222222]">{label}</span>
    </button>
  );
}

/** Réponse oui / non en deux boutons accolés. */
export function YesNo({
  value,
  onChange,
  yesLabel = 'Oui',
  noLabel = 'Non',
  label,
}: {
  value: boolean | null;
  onChange: (value: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
  label: string;
}) {
  const btn = (active: boolean) =>
    `min-w-[84px] h-11 px-5 text-sm font-semibold transition-colors ${
      active ? 'bg-[#222222] text-white' : 'bg-white text-[#222222] hover:bg-[#F7F7F7]'
    }`;
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-xl border border-[#CFCFCF] overflow-hidden flex-shrink-0">
      <button type="button" aria-pressed={value === true} onClick={() => onChange(true)} className={btn(value === true)}>
        {yesLabel}
      </button>
      <button
        type="button"
        aria-pressed={value === false}
        onClick={() => onChange(false)}
        className={`${btn(value === false)} border-l border-[#CFCFCF]`}
      >
        {noLabel}
      </button>
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-7 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-[#222222]' : 'bg-[#CFCFCF]'}`}
    >
      <span
        className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`}
      />
    </button>
  );
}

export function CheckboxRow({
  id,
  checked,
  onChange,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label htmlFor={id} className="flex items-start gap-3.5 cursor-pointer text-[15px] leading-relaxed text-[#222222]">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-[22px] h-[22px] flex-shrink-0 cursor-pointer accent-[#222222]"
      />
      <span>{children}</span>
    </label>
  );
}

// ─── Nombres ─────────────────────────────────────────────────────────────────

export function StepperRow({
  label,
  help,
  value,
  min,
  max,
  onChange,
  unit,
  dense = false,
}: {
  label: string;
  help?: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
  dense?: boolean;
}) {
  const btn =
    'w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#CFCFCF] bg-white flex items-center justify-center text-[#222222] hover:border-[#222222] transition-colors disabled:opacity-30 disabled:hover:border-[#CFCFCF] disabled:cursor-not-allowed';
  return (
    <div className={`flex items-center justify-between gap-4 px-5 ${dense ? 'py-2.5' : 'py-4'}`}>
      <div className="min-w-0">
        <p className={`${dense ? 'text-[15px] font-medium' : 'text-base font-semibold'} text-[#222222]`}>{label}</p>
        {help && <p className="text-sm text-[#6A6A6A]">{help}</p>}
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button type="button" className={btn} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} aria-label={`Diminuer : ${label}`}>
          <Minus className="w-4 h-4" />
        </button>
        <output aria-live="polite" className="min-w-[32px] text-center text-[17px] font-semibold text-[#222222]">
          {value}
          {unit && <span className="sr-only"> {unit}</span>}
        </output>
        <button type="button" className={btn} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} aria-label={`Augmenter : ${label}`}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Champs ──────────────────────────────────────────────────────────────────

export function Field({
  label,
  htmlFor,
  hint,
  optional,
  error,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  optional?: boolean;
  error?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-[#222222]">
        {label}
        {optional && <span className="ml-1.5 font-normal text-[#6A6A6A]">(facultatif)</span>}
      </label>
      {children}
      {error && <div className="text-sm text-[#B42318]">{error}</div>}
      {hint && !error && <p className="text-[13px] leading-snug text-[#6A6A6A]">{hint}</p>}
    </div>
  );
}

export function SelectInput({
  id,
  value,
  onChange,
  children,
}: {
  id?: string;
  value: string | number;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} appearance-none pr-10 cursor-pointer`}>
        {children}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6A6A6A] pointer-events-none" />
    </div>
  );
}

/** Champ de montant en euros. */
export function AmountInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputClass} pr-10`}
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[15px] text-[#6A6A6A] pointer-events-none">€</span>
    </div>
  );
}

// ─── Récapitulatifs ──────────────────────────────────────────────────────────

export function RecapList({ children }: { children: ReactNode }) {
  return <dl className="rounded-2xl border border-[#E4E4E4] divide-y divide-[#E4E4E4]">{children}</dl>;
}

export function RecapRow({
  label,
  value,
  sub,
  onEdit,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  onEdit?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-5 px-5 py-4">
      <dt className="sm:w-[150px] flex-shrink-0 text-sm text-[#6A6A6A]">{label}</dt>
      <dd className="flex-1 min-w-0">
        <p className="text-[15px] font-medium text-[#222222]">{value}</p>
        {sub && <p className="text-[13px] text-[#6A6A6A] mt-0.5">{sub}</p>}
      </dd>
      {onEdit && (
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Modifier : ${label}`}
          className="self-start sm:self-center min-h-[44px] text-sm font-semibold text-[#222222] underline underline-offset-[3px] hover:text-black"
        >
          Modifier
        </button>
      )}
    </div>
  );
}

export function NextChapterCard({ number, title, summary, count }: { number: number; title: string; summary: string; count: number }) {
  return (
    <div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#F7F7F7] p-5">
      <span className="w-11 h-11 flex-shrink-0 rounded-full bg-[#222222] text-white flex items-center justify-center text-base font-semibold">
        {number}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] font-semibold text-[#6A6A6A]">
          Chapitre suivant · {count} {count > 1 ? 'étapes' : 'étape'}
        </span>
        <span className="block text-[17px] font-semibold text-[#222222]">{title}</span>
        <span className="block text-sm text-[#555555]">{summary}</span>
      </span>
    </div>
  );
}

// ─── Aperçu de l'annonce ─────────────────────────────────────────────────────

export function ListingPreview({
  label = 'Aperçu de votre annonce',
  photo,
  title,
  location,
  details,
  price,
  note,
}: {
  label?: string;
  photo?: string | null;
  title?: string;
  location?: string;
  details?: string;
  price?: string | null;
  note?: ReactNode;
}) {
  return (
    <aside aria-label={label} className="space-y-3">
      <p className="text-[13px] font-semibold text-[#6A6A6A]">{label}</p>
      <div className="rounded-2xl border border-[#E4E4E4] bg-white overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        {photo ? (
          <img src={photo} alt="" className="block w-full h-[210px] object-cover" />
        ) : (
          <div className="h-[200px] bg-[#F2F2F2] flex flex-col items-center justify-center gap-2 text-[13px] text-[#6A6A6A]">
            <ImageIcon className="w-7 h-7" strokeWidth={1.75} />
            Vos photos apparaîtront ici
          </div>
        )}
        <div className="p-4 space-y-1.5">
          <p className={`text-[15px] font-semibold ${title ? 'text-[#222222]' : 'text-[#8A8A8A]'}`}>{title || 'Titre de votre annonce'}</p>
          {location && <p className="text-sm text-[#6A6A6A]">{location}</p>}
          {details && <p className="text-sm leading-snug text-[#484848]">{details}</p>}
          {price && (
            <p className="pt-1.5 text-[15px] text-[#222222]">
              <strong className="font-bold">{price}</strong> par nuit
            </p>
          )}
        </div>
      </div>
      {note && <p className="text-[13px] leading-relaxed text-[#6A6A6A]">{note}</p>}
    </aside>
  );
}
