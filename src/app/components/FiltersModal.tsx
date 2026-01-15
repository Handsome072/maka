import { X, Home, Building2, Castle, Warehouse, LayoutGrid, Wifi, UtensilsCrossed, WashingMachine, Snowflake, Waves, Car, Minus, Plus, Check } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters?: (filters: FilterState) => void;
}

interface FilterState {
  priceMin: number;
  priceMax: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  propertyTypes: string[];
  amenities: string[];
}

const propertyTypes = [
  { id: 'apartment', label: 'Appartement', icon: Building2 },
  { id: 'house', label: 'Maison', icon: Home },
  { id: 'villa', label: 'Villa', icon: Castle },
  { id: 'loft', label: 'Loft', icon: Warehouse },
  { id: 'studio', label: 'Studio', icon: LayoutGrid },
];

const amenities = [
  { id: 'wifi', label: 'Wifi', icon: Wifi },
  { id: 'kitchen', label: 'Cuisine', icon: UtensilsCrossed },
  { id: 'washer', label: 'Lave-linge', icon: WashingMachine },
  { id: 'aircon', label: 'Climatisation', icon: Snowflake },
  { id: 'pool', label: 'Piscine', icon: Waves },
  { id: 'parking', label: 'Parking gratuit', icon: Car },
];

// Price range constants
const MIN_PRICE = 0;
const MAX_PRICE = 2000;
const PRICE_STEP = 50;

export function FiltersModal({ isOpen, onClose, onApplyFilters }: FiltersModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceMin: MIN_PRICE,
    priceMax: MAX_PRICE,
    bedrooms: 0,
    beds: 0,
    bathrooms: 0,
    propertyTypes: [],
    amenities: [],
  });

  // Handle opening/closing animations
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleApply = useCallback(() => {
    onApplyFilters?.(filters);
    onClose();
  }, [filters, onApplyFilters, onClose]);

  const handleClear = useCallback(() => {
    setFilters({
      priceMin: MIN_PRICE,
      priceMax: MAX_PRICE,
      bedrooms: 0,
      beds: 0,
      bathrooms: 0,
      propertyTypes: [],
      amenities: [],
    });
  }, []);

  const togglePropertyType = useCallback((id: string) => {
    setFilters(prev => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(id)
        ? prev.propertyTypes.filter(t => t !== id)
        : [...prev.propertyTypes, id]
    }));
  }, []);

  const toggleAmenity = useCallback((id: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter(a => a !== id)
        : [...prev.amenities, id]
    }));
  }, []);

  const updateRoomCount = useCallback((key: 'bedrooms' | 'beds' | 'bathrooms', delta: number) => {
    setFilters(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(8, prev[key] + delta))
    }));
  }, []);

  // Calculate active filter count for the button
  const activeFilterCount =
    (filters.priceMin > MIN_PRICE || filters.priceMax < MAX_PRICE ? 1 : 0) +
    (filters.bedrooms > 0 ? 1 : 0) +
    (filters.beds > 0 ? 1 : 0) +
    (filters.bathrooms > 0 ? 1 : 0) +
    filters.propertyTypes.length +
    filters.amenities.length;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-modal-title"
    >
      {/* Overlay background with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal - continued in next section */}
      <div
        ref={modalRef}
        className={`relative bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl transform transition-all duration-300 ${
          isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
          <h2 id="filters-modal-title" className="text-lg font-semibold text-gray-900">
            Filtres
          </h2>
          <div className="w-9" aria-hidden="true" />
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Price Range Section */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Fourchette de prix</h3>
            <p className="text-sm text-gray-500 mb-4">Prix par nuit, frais et taxes compris</p>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Minimum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMin: Math.min(Number(e.target.value), prev.priceMax) }))}
                    min={MIN_PRICE}
                    max={filters.priceMax}
                    step={PRICE_STEP}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5EC6D8] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <span className="text-gray-400 mt-5">—</span>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Maximum</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters(prev => ({ ...prev, priceMax: Math.max(Number(e.target.value), prev.priceMin) }))}
                    min={filters.priceMin}
                    max={MAX_PRICE}
                    step={PRICE_STEP}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5EC6D8] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Rooms Section */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Chambres et lits</h3>
            <div className="space-y-4">
              {[
                { key: 'bedrooms' as const, label: 'Chambres' },
                { key: 'beds' as const, label: 'Lits' },
                { key: 'bathrooms' as const, label: 'Salles de bain' },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-gray-700">{label}</span>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => updateRoomCount(key, -1)}
                      disabled={filters[key] === 0}
                      className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      aria-label={`Diminuer ${label.toLowerCase()}`}
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-6 text-center font-medium text-gray-900">
                      {filters[key] === 0 ? 'Tous' : filters[key]}
                    </span>
                    <button
                      onClick={() => updateRoomCount(key, 1)}
                      disabled={filters[key] === 8}
                      className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-full hover:border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                      aria-label={`Augmenter ${label.toLowerCase()}`}
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Property Types Section */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Type de logement</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {propertyTypes.map(({ id, label, icon: Icon }) => {
                const isSelected = filters.propertyTypes.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => togglePropertyType(id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#5EC6D8] bg-[#5EC6D8]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-[#5EC6D8]' : 'text-gray-600'}`} />
                    <span className={`text-sm ${isSelected ? 'text-[#5EC6D8] font-medium' : 'text-gray-700'}`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Amenities Section */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Équipements</h3>
            <div className="grid grid-cols-2 gap-3">
              {amenities.map(({ id, label, icon: Icon }) => {
                const isSelected = filters.amenities.includes(id);
                return (
                  <button
                    key={id}
                    onClick={() => toggleAmenity(id)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-[#5EC6D8] bg-[#5EC6D8]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-[#5EC6D8]' : 'text-gray-600'}`} />
                    <span className={`text-sm ${isSelected ? 'text-[#5EC6D8] font-medium' : 'text-gray-700'}`}>
                      {label}
                    </span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#5EC6D8] ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-5 border-t border-gray-100 bg-white rounded-b-3xl">
          <button
            onClick={handleClear}
            className="text-gray-700 font-medium underline hover:text-gray-900 transition-colors"
          >
            Tout effacer
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-3 bg-[#5EC6D8] text-white font-semibold rounded-xl hover:bg-[#4db5c7] transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
          >
            Afficher {activeFilterCount > 0 ? `(${activeFilterCount})` : 'les résultats'}
          </button>
        </div>
      </div>
    </div>
  );
}

