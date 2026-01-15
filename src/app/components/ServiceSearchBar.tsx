import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { ServiceDestinationPicker } from './ServiceDestinationPicker';
import { ServiceDatePicker } from './ServiceDatePicker';
import { ServiceTypePicker } from './ServiceTypePicker';
import backgroundImage from '@/assets/ea9a43f19f699f5eeca472b649d75293c416f15e.png';

interface ServiceSearchBarProps {
  onSearch?: (params: any) => void;
}

export function ServiceSearchBar({ onSearch }: ServiceSearchBarProps) {
  const [activeDropdown, setActiveDropdown] = useState<'destination' | 'dates' | 'service' | null>(null);
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDestinationSelect = (dest: string) => {
    setDestination(dest);
  };

  const handleDateSelect = (selectedDate: string) => {
    setDate(selectedDate);
  };

  const handleServiceTypeSelect = (type: string) => {
    setServiceType(type);
  };

  const handleClearServiceType = () => {
    setServiceType('');
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch({
        destination,
        checkInDate,
        checkOutDate: null,
        guestsCount: {
          adults: 0,
          children: 0,
          babies: 0,
          pets: 0,
        },
        serviceType,
      });
    }
    setActiveDropdown(null);
  };

  return (
    <div 
      className="relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-20 py-6">
        <div className="max-w-5xl mx-auto relative" ref={searchBarRef}>
          <div 
            className="flex items-center rounded-full shadow-sm hover:shadow-md transition-shadow relative"
            style={{ backgroundColor: activeDropdown ? '#EBEBEB' : 'white' }}
          >
            {/* Destination */}
            <div 
              className={`flex-1 px-8 py-4 cursor-pointer relative transition-all ${
                activeDropdown === 'destination' 
                  ? 'bg-white shadow-md z-10' 
                  : 'bg-transparent'
              }`}
              style={{
                borderRadius: activeDropdown === 'destination' ? '100px' : '32px 0 0 32px',
                ...(!activeDropdown ? {
                  borderTop: '1px solid #DDDDDD',
                  borderBottom: '1px solid #DDDDDD',
                  borderLeft: '1px solid #DDDDDD',
                  borderRight: 'none'
                } : {})
              }}
              onClick={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
            >
              <label className="block text-xs mb-1 cursor-pointer" style={{ fontWeight: 600, color: '#222222' }}>Destination</label>
              <input 
                type="text" 
                placeholder="Rechercher une destination" 
                value={destination}
                readOnly
                className="w-full outline-none text-sm placeholder:text-gray-400 cursor-pointer bg-transparent"
                style={{ color: '#717171' }}
              />
            </div>

            {/* Separator */}
            {activeDropdown !== 'destination' && activeDropdown !== 'dates' && (
              <div className="w-px h-8 bg-gray-300"></div>
            )}

            {/* Dates */}
            <div 
              className={`flex-1 px-8 py-4 cursor-pointer relative transition-all ${
                activeDropdown === 'dates' 
                  ? 'bg-white shadow-md z-10' 
                  : 'bg-transparent'
              }`}
              style={{
                borderRadius: activeDropdown === 'dates' ? '100px' : '0',
                ...(!activeDropdown ? {
                  borderTop: '1px solid #DDDDDD',
                  borderBottom: '1px solid #DDDDDD',
                  borderLeft: 'none',
                  borderRight: 'none'
                } : {})
              }}
              onClick={() => setActiveDropdown(activeDropdown === 'dates' ? null : 'dates')}
            >
              <label className="block text-xs mb-1 cursor-pointer" style={{ fontWeight: 600, color: '#222222' }}>Dates</label>
              <input 
                type="text" 
                placeholder="Quand ?" 
                value={date}
                readOnly
                className="w-full outline-none text-sm placeholder:text-gray-400 cursor-pointer bg-transparent"
                style={{ color: '#717171' }}
              />
            </div>

            {/* Separator */}
            {activeDropdown !== 'dates' && activeDropdown !== 'service' && (
              <div className="w-px h-8 bg-gray-300"></div>
            )}

            {/* Type de service + Rechercher */}
            <div 
              className={`flex-1 py-0.5 flex items-center relative transition-all ${
                activeDropdown === 'service' 
                  ? 'bg-white shadow-md z-10' 
                  : 'bg-transparent'
              }`}
              style={{
                borderRadius: activeDropdown === 'service' ? '100px' : '0 32px 32px 0',
                ...((!activeDropdown) ? {
                  borderTop: '1px solid #DDDDDD',
                  borderBottom: '1px solid #DDDDDD',
                  borderRight: '1px solid #DDDDDD',
                  borderLeft: 'none'
                } : {})
              }}
            >
              <div 
                className="w-full flex-1 flex flex-row items-center px-8 py-4 cursor-pointer relative"
                onClick={() => setActiveDropdown(activeDropdown === 'service' ? null : 'service')}
              >
                <div className='w-1/3'>
                <label className="block text-xs mb-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap" style={{ fontWeight: 600, color: '#222222' }}>Type de service</label>
                <div 
                  className="w-full outline-none text-sm cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap" 
                  style={{ 
                    color: serviceType ? '#717171' : '#9CA3AF'
                  }}
                >
                  {serviceType || 'Ajouter'}
                </div>
                  </div>
                {serviceType && activeDropdown == 'service' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearServiceType();
                    }}
                    className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-20"
                    style={{ 
                      right: activeDropdown ? '165px' : '60px'
                    }}
                  >
                    <X className="w-3 h-3 text-gray-700" />
                  </button>
                )}
              </div>

              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white rounded-full transition-all flex items-center gap-2"
                style={{
                  backgroundColor: '#5EC6D8',
                  padding: activeDropdown ? '14px 24px' : '14px'
                }}
                onClick={handleSearch}
              >
                <Search className="w-4 h-4" />
                {activeDropdown && (
                  <span className="text-sm" style={{ fontWeight: 600 }}>Rechercher</span>
                )}
              </button>
            </div>
          </div>

          {/* Dropdowns positioned relative to search bar container */}
          {activeDropdown === 'destination' && (
            <ServiceDestinationPicker 
              onClose={() => setActiveDropdown(null)}
              onSelect={handleDestinationSelect}
            />
          )}
          
          {activeDropdown === 'dates' && (
            <ServiceDatePicker 
              onClose={() => setActiveDropdown(null)}
              onSelect={handleDateSelect}
            />
          )}
          
          {activeDropdown === 'service' && (
            <ServiceTypePicker 
              onClose={() => setActiveDropdown(null)}
              onSelect={handleServiceTypeSelect}
              currentService={serviceType}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function CompactServiceSearchBar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-20 py-4">
        <div className="w-fit mx-auto">
          <div className="flex items-center gap-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white px-6 py-2.5">
            <button className="text-sm hover:underline" style={{ fontWeight: 600 }}>N'importe où</button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button className="text-sm hover:underline" style={{ fontWeight: 600 }}>Dates flexibles</button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button className="text-sm text-gray-500 hover:underline">Ajouter</button>
            <div className="ml-auto bg-[#10B981] hover:bg-[#047857] text-white p-2 rounded-full transition-colors">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}