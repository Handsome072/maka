import { Minus, Plus } from 'lucide-react';

interface GuestsPickerProps {
  onClose: () => void;
  onGuestsChange?: (guests: { adults: number; children: number; babies: number; pets: number }) => void;
  currentGuests?: { adults: number; children: number; babies: number; pets: number };
  maxCapacity?: number;
  showCapacityInfo?: boolean;
  showPets?: boolean;
}

export function GuestsPicker({ onClose, onGuestsChange, currentGuests, maxCapacity, showCapacityInfo }: GuestsPickerProps) {
  const adults = currentGuests?.adults ?? 1;
  const children = currentGuests?.children ?? 0;
  const babies = currentGuests?.babies ?? 0;
  const pets = currentGuests?.pets ?? 0;

  const totalGuests = adults + children;
  const maxReached = maxCapacity ? totalGuests >= maxCapacity : false;

  const updateCount = (
    current: number,
    delta: number,
    min: number = 0,
    key: 'adults' | 'children' | 'babies' | 'pets'
  ) => {
    const newValue = Math.max(min, current + delta);

    if (onGuestsChange && currentGuests) {
      const updatedGuests = {
        ...currentGuests,
        [key]: newValue
      };
      onGuestsChange(updatedGuests);
    }
  };

  return (
    <div
      className="absolute top-full right-0 mt-2 bg-white z-50"
      style={{
        borderRadius: '24px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        width: '400px'
      }}
    >
      <div className="px-8 py-8">
        {/* Adultes */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Adultes
            </div>
            <div className="text-[14px]" style={{ color: '#717171' }}>
              18 ans et plus
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateCount(adults, -1, 1, 'adults')}
              disabled={adults <= 1}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                adults <= 1
                  ? 'border-gray-200 cursor-not-allowed opacity-40'
                  : 'border-gray-400 hover:border-gray-900'
              }`}
            >
              <Minus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
            <span className="text-[16px] w-6 text-center" style={{ fontWeight: 400, color: '#222222' }}>
              {adults}
            </span>
            <button
              onClick={() => updateCount(adults, 1, 1, 'adults')}
              disabled={maxReached}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                maxReached
                  ? 'border-gray-200 cursor-not-allowed opacity-40'
                  : 'border-gray-400 hover:border-gray-900'
              }`}
            >
              <Plus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Enfants */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200">
          <div>
            <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Enfants
            </div>
            <div className="text-[14px]" style={{ color: '#717171' }}>
              De 2 à 17 ans
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateCount(children, -1, 0, 'children')}
              disabled={children <= 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                children <= 0
                  ? 'border-gray-200 cursor-not-allowed opacity-40'
                  : 'border-gray-400 hover:border-gray-900'
              }`}
            >
              <Minus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
            <span className="text-[16px] w-6 text-center" style={{ fontWeight: 400, color: '#222222' }}>
              {children}
            </span>
            <button
              onClick={() => updateCount(children, 1, 0, 'children')}
              disabled={maxReached}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                maxReached
                  ? 'border-gray-200 cursor-not-allowed opacity-40'
                  : 'border-gray-400 hover:border-gray-900'
              }`}
            >
              <Plus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Bébés */}
        <div className="flex items-center justify-between py-6 border-b border-gray-200">
          <div>
            <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Bébés
            </div>
            <div className="text-[14px]" style={{ color: '#717171' }}>
              - de 2 ans
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateCount(babies, -1, 0, 'babies')}
              disabled={babies <= 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                babies <= 0
                  ? 'border-gray-200 cursor-not-allowed opacity-40'
                  : 'border-gray-400 hover:border-gray-900'
              }`}
            >
              <Minus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
            <span className="text-[16px] w-6 text-center" style={{ fontWeight: 400, color: '#222222' }}>
              {babies}
            </span>
            <button
              onClick={() => updateCount(babies, 1, 0, 'babies')}
              className="w-8 h-8 rounded-full border border-gray-400 hover:border-gray-900 flex items-center justify-center transition-all"
            >
              <Plus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Animaux de compagnie */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex-1 pr-4">
            <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Animaux de compagnie
            </div>
            <div className="text-[14px] underline" style={{ color: '#717171' }}>
              Vous voyagez avec un animal d&apos;assistance ?
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateCount(pets, -1, 0, 'pets')}
              disabled={pets <= 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                pets <= 0
                  ? 'border-gray-200 cursor-not-allowed opacity-40'
                  : 'border-gray-400 hover:border-gray-900'
              }`}
            >
              <Minus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
            <span className="text-[16px] w-6 text-center" style={{ fontWeight: 400, color: '#222222' }}>
              {pets}
            </span>
            <button
              onClick={() => updateCount(pets, 1, 0, 'pets')}
              className="w-8 h-8 rounded-full border border-gray-400 hover:border-gray-900 flex items-center justify-center transition-all"
            >
              <Plus className="w-4 h-4" style={{ color: '#717171' }} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Capacity info */}
        {showCapacityInfo && maxCapacity && (
          <p className="text-[14px] mt-6 leading-relaxed" style={{ color: '#717171' }}>
            La capacité d&apos;accueil de ce logement est limitée à {maxCapacity} voyageur{maxCapacity > 1 ? 's' : ''}, sans compter les bébés. Si plus de deux animaux de compagnie vous accompagnent, veuillez en informer votre hôte.
          </p>
        )}

        {/* Fermer button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="text-[16px] underline"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}