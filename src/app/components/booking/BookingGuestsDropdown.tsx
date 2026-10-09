'use client';

import { Minus, Plus } from 'lucide-react';

export interface StayGuests {
  adults: number;
  children: number;
  babies: number;
  pets: number;
}

const MAX_BABIES = 5;
const MAX_PETS = 5;

/** « 3 voyageurs, 1 bébé, 1 animal » comme dans le champ VOYAGEURS d'Airbnb. */
export function formatGuestsLabel(guests: StayGuests): string {
  const travellers = guests.adults + guests.children;
  const parts = [`${travellers} voyageur${travellers > 1 ? 's' : ''}`];
  if (guests.babies > 0) parts.push(`${guests.babies} bébé${guests.babies > 1 ? 's' : ''}`);
  if (guests.pets > 0) parts.push(`${guests.pets} ${guests.pets > 1 ? 'animaux' : 'animal'}`);
  return parts.join(', ');
}

interface BookingGuestsDropdownProps {
  guests: StayGuests;
  onChange: (guests: StayGuests) => void;
  /** Voyageurs maximum, bébés non compris. */
  capacity: number;
  onClose: () => void;
}

/** Panneau ouvert sous le champ VOYAGEURS du bloc de réservation, à la même largeur que lui. */
export function BookingGuestsDropdown({ guests, onChange, capacity, onClose }: BookingGuestsDropdownProps) {
  const seatsLeft = capacity - guests.adults - guests.children;

  const rows: { key: keyof StayGuests; label: string; hint: string; hintUnderline?: boolean; min: number; canAdd: boolean }[] = [
    { key: 'adults', label: 'Adultes', hint: '18 ans et plus', min: 1, canAdd: seatsLeft > 0 },
    { key: 'children', label: 'Enfants', hint: 'De 2 à 17 ans', min: 0, canAdd: seatsLeft > 0 },
    { key: 'babies', label: 'Bébés', hint: '- de 2 ans', min: 0, canAdd: guests.babies < MAX_BABIES },
    {
      key: 'pets',
      label: 'Animaux de compagnie',
      hint: 'Vous voyagez avec un animal d\'assistance ?',
      hintUnderline: true,
      min: 0,
      canAdd: guests.pets < MAX_PETS,
    },
  ];

  const stepperClass = (enabled: boolean) =>
    `w-8 h-8 shrink-0 rounded-full flex items-center justify-center transition-colors ${
      enabled ? 'bg-[#F2F2F2] text-[#222] hover:bg-[#E6E6E6]' : 'bg-[#F7F7F7] text-[#D6D6D6] cursor-not-allowed'
    }`;

  return (
    <div
      className="absolute left-0 right-0 top-full z-30 bg-white rounded px-4 pt-1 pb-4"
      style={{ boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 6px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px' }}
    >
      {rows.map(({ key, label, hint, hintUnderline, min, canAdd }) => {
        const value = guests[key];
        const canRemove = value > min;
        return (
          <div key={key} className="flex items-center justify-between gap-3 py-4 border-b border-[#EBEBEB] last:border-b-0">
            <div className="min-w-0">
              <div className="text-base text-[#222]" style={{ fontWeight: 600 }}>{label}</div>
              <div className={`text-sm text-[#6A6A6A] ${hintUnderline ? 'underline' : ''}`}>{hint}</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={`Retirer : ${label}`}
                disabled={!canRemove}
                onClick={() => onChange({ ...guests, [key]: value - 1 })}
                className={stepperClass(canRemove)}
              >
                <Minus className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
              <span className="w-5 text-center text-base text-[#222]">{value}</span>
              <button
                type="button"
                aria-label={`Ajouter : ${label}`}
                disabled={!canAdd}
                onClick={() => onChange({ ...guests, [key]: value + 1 })}
                className={stepperClass(canAdd)}
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        );
      })}

      <p className="text-xs text-[#6A6A6A] leading-snug mt-2">
        Ce logement peut accueillir {capacity} voyageur{capacity > 1 ? 's' : ''} maximum, sans compter les bébés.
        Si plus de deux animaux de compagnie vous accompagnent, veuillez en informer votre hôte.
      </p>

      <div className="flex justify-end mt-4">
        <button type="button" onClick={onClose} className="text-base text-[#222] underline px-2 py-1 -mr-2 rounded-lg hover:bg-[#F7F7F7]" style={{ fontWeight: 600 }}>
          Fermer
        </button>
      </div>
    </div>
  );
}
