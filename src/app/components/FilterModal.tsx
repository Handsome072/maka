import { useState } from 'react';
import { X, ChevronUp, ChevronDown, Minus, Plus } from 'lucide-react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [propertyType, setPropertyType] = useState<'all' | 'room' | 'entire'>('all');
  const [minPrice, setMinPrice] = useState(220);
  const [maxPrice, setMaxPrice] = useState(11000);
  const [bedrooms, setBedrooms] = useState<number | 'any'>('any');
  const [beds, setBeds] = useState<number | 'any'>('any');
  const [bathrooms, setBathrooms] = useState<number | 'any'>('any');
  const [propertyTypeExpanded, setPropertyTypeExpanded] = useState(true);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleClearAll = () => {
    setPropertyType('all');
    setMinPrice(220);
    setMaxPrice(11000);
    setBedrooms('any');
    setBeds('any');
    setBathrooms('any');
    setSelectedPropertyTypes([]);
  };

  const togglePropertyType = (type: string) => {
    if (selectedPropertyTypes.includes(type)) {
      setSelectedPropertyTypes(selectedPropertyTypes.filter(t => t !== type));
    } else {
      setSelectedPropertyTypes([...selectedPropertyTypes, type]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
            Filtres
          </h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#222222' }} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          {/* Type de logement */}
          <div className="mb-10">
            <h3 className="text-[22px] mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Type de logement
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => setPropertyType('all')}
                className={`flex-1 px-6 py-3 rounded-full border-2 text-sm transition-colors ${
                  propertyType === 'all'
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Tous les types
              </button>
              <button
                onClick={() => setPropertyType('room')}
                className={`flex-1 px-6 py-3 rounded-full border-2 text-sm transition-colors ${
                  propertyType === 'room'
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Chambre
              </button>
              <button
                onClick={() => setPropertyType('entire')}
                className={`flex-1 px-6 py-3 rounded-full border-2 text-sm transition-colors ${
                  propertyType === 'entire'
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
                style={{ fontWeight: 600, color: '#222222' }}
              >
                Logement entier
              </button>
            </div>
          </div>

          {/* Fourchette de prix */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <h3 className="text-[22px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
              Fourchette de prix
            </h3>
            <p className="text-sm mb-6" style={{ color: '#717171' }}>
              Prix du voyage, tous frais compris
            </p>

            {/* Price histogram */}
            <div className="mb-6 px-4">
              <div className="flex items-end justify-between h-20 gap-[2px]">
                {[12, 18, 25, 35, 45, 52, 58, 62, 68, 72, 78, 82, 85, 88, 90, 92, 94, 95, 96, 97, 98, 96, 94, 92, 88, 85, 80, 75, 70, 65, 58, 52, 48, 42, 38, 32, 28, 24, 20, 18].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-[#E91E63] rounded-t-sm"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Price inputs */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs mb-2 block" style={{ color: '#717171' }}>
                  Minimum
                </label>
                <input
                  type="text"
                  value={`€${minPrice}`}
                  onChange={(e) => setMinPrice(parseInt(e.target.value.replace('€', '')) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs mb-2 block" style={{ color: '#717171' }}>
                  Maximum
                </label>
                <input
                  type="text"
                  value={maxPrice >= 11000 ? '€11000+' : `€${maxPrice}`}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value.replace(/[€+]/g, '')) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Chambres et lits */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <h3 className="text-[22px] mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Chambres et lits
            </h3>

            {/* Chambres */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-base" style={{ color: '#222222' }}>
                Chambres
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBedrooms(bedrooms === 'any' ? 'any' : Math.max(0, (bedrooms as number) - 1))}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors"
                  disabled={bedrooms === 0 || bedrooms === 'any'}
                >
                  <Minus className="w-4 h-4" style={{ color: bedrooms === 0 || bedrooms === 'any' ? '#EBEBEB' : '#222222' }} />
                </button>
                <span className="text-base min-w-[60px] text-center" style={{ color: '#717171' }}>
                  {bedrooms === 'any' ? 'Tout' : bedrooms}
                </span>
                <button
                  onClick={() => setBedrooms(bedrooms === 'any' ? 1 : (bedrooms as number) + 1)}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" style={{ color: '#222222' }} />
                </button>
              </div>
            </div>

            {/* Lits */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-base" style={{ color: '#222222' }}>
                Lits
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBeds(beds === 'any' ? 'any' : Math.max(0, (beds as number) - 1))}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors"
                  disabled={beds === 0 || beds === 'any'}
                >
                  <Minus className="w-4 h-4" style={{ color: beds === 0 || beds === 'any' ? '#EBEBEB' : '#222222' }} />
                </button>
                <span className="text-base min-w-[60px] text-center" style={{ color: '#717171' }}>
                  {beds === 'any' ? 'Tout' : beds}
                </span>
                <button
                  onClick={() => setBeds(beds === 'any' ? 1 : (beds as number) + 1)}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" style={{ color: '#222222' }} />
                </button>
              </div>
            </div>

            {/* Salles de bain */}
            <div className="flex items-center justify-between">
              <span className="text-base" style={{ color: '#222222' }}>
                Salles de bain
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setBathrooms(bathrooms === 'any' ? 'any' : Math.max(0, (bathrooms as number) - 1))}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors"
                  disabled={bathrooms === 0 || bathrooms === 'any'}
                >
                  <Minus className="w-4 h-4" style={{ color: bathrooms === 0 || bathrooms === 'any' ? '#EBEBEB' : '#222222' }} />
                </button>
                <span className="text-base min-w-[60px] text-center" style={{ color: '#717171' }}>
                  {bathrooms === 'any' ? 'Tout' : bathrooms}
                </span>
                <button
                  onClick={() => setBathrooms(bathrooms === 'any' ? 1 : (bathrooms as number) + 1)}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-gray-900 transition-colors"
                >
                  <Plus className="w-4 h-4" style={{ color: '#222222' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Logements exceptionnels */}
          <div className="mb-10 pb-10 border-b border-gray-200">
            <h3 className="text-[22px] mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Logements exceptionnels
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Coup de cœur voyageurs */}
              <button className="p-6 border border-gray-300 rounded-xl hover:border-gray-900 transition-colors text-left">
                <div className="mb-3">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M16 6L18.5 11L24 12L20 16.5L21 22L16 19L11 22L12 16.5L8 12L13.5 11L16 6Z" fill="none" stroke="#222222" strokeWidth="2"/>
                  </svg>
                </div>
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Coup de cœur voyageurs
                </h4>
                <p className="text-sm" style={{ color: '#717171' }}>
                  Les logements les plus appréciés sur Airbnb
                </p>
              </button>

              {/* Luxe */}
              <button className="p-6 border border-gray-300 rounded-xl hover:border-gray-900 transition-colors text-left">
                <div className="mb-3">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M8 24L16 8L24 24M10 20H22" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h4 className="text-base mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                  Luxe
                </h4>
                <p className="text-sm" style={{ color: '#717171' }}>
                  Des logements de luxe au design exceptionnel
                </p>
              </button>
            </div>
          </div>

          {/* Type de propriété */}
          <div>
            <button
              onClick={() => setPropertyTypeExpanded(!propertyTypeExpanded)}
              className="w-full flex items-center justify-between mb-6"
            >
              <h3 className="text-[22px]" style={{ fontWeight: 600, color: '#222222' }}>
                Type de propriété
              </h3>
              {propertyTypeExpanded ? (
                <ChevronUp className="w-5 h-5" style={{ color: '#222222' }} />
              ) : (
                <ChevronDown className="w-5 h-5" style={{ color: '#222222' }} />
              )}
            </button>

            {propertyTypeExpanded && (
              <div className="flex flex-wrap gap-3">
                {[
                  { id: 'maison', label: 'Maison', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                  { id: 'appartement', label: 'Appartement', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
                  { id: 'maison-hotes', label: "Maison d'hôtes", icon: 'M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z' },
                  { id: 'hotel', label: 'Hôtel', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => togglePropertyType(type.id)}
                    className={`px-6 py-3 rounded-full border-2 text-sm transition-colors flex items-center gap-2 ${
                      selectedPropertyTypes.includes(type.id)
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-300 hover:border-gray-900'
                    }`}
                    style={{ fontWeight: 600, color: '#222222' }}
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={type.icon} />
                    </svg>
                    {type.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClearAll}
            className="text-base underline hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Tout effacer
          </button>
          <button
            className="px-6 py-3 rounded-lg text-base text-white transition-colors"
            style={{ fontWeight: 600, backgroundColor: '#222222' }}
            onClick={onClose}
          >
            Afficher plus de 1 000 logements
          </button>
        </div>
      </div>
    </div>
  );
}
