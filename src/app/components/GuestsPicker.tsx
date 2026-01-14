import { Minus, Plus } from 'lucide-react';

interface GuestsPickerProps {
  onClose: () => void;
  onGuestsChange?: (guests: { adults: number; children: number; babies: number; pets: number }) => void;
  currentGuests?: { adults: number; children: number; babies: number; pets: number };
}

export function GuestsPicker({ onClose, onGuestsChange, currentGuests }: GuestsPickerProps) {
  const adults = currentGuests?.adults ?? 0;
  const children = currentGuests?.children ?? 0;
  const babies = currentGuests?.babies ?? 0;
  const pets = currentGuests?.pets ?? 0;

  const updateCount = (
    current: number,
    delta: number,
    min: number = 0,
    key: 'adults' | 'children' | 'babies' | 'pets'
  ) => {
    const newValue = Math.max(min, current + delta);
    
    // Notify parent component
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
              13 ans et plus
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateCount(adults, -1, 0, 'adults')}
              disabled={adults <= 0}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                adults <= 0
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
              onClick={() => updateCount(adults, 1, 0, 'adults')}
              className="w-8 h-8 rounded-full border border-gray-400 hover:border-gray-900 flex items-center justify-center transition-all"
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
              De 2 à 12 ans
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
              className="w-8 h-8 rounded-full border border-gray-400 hover:border-gray-900 flex items-center justify-center transition-all"
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

        {/* Animaux domestiques */}
        <div className="flex items-center justify-between pt-6">
          <div className="flex-1 pr-4">
            <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Animaux domestiques
            </div>
            <div className="text-[14px] underline" style={{ color: '#717171' }}>
              Vous voyagez avec un animal d'assistance ?
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
      </div>
    </div>
  );
}