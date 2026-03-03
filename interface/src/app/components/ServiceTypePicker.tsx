import { Camera } from 'lucide-react';

interface ServiceTypePickerProps {
  onClose: () => void;
  onSelect: (serviceType: string) => void;
  currentService?: string;
}

const serviceTypes = [
  { id: 'photographie', label: 'Photographie' },
  { id: 'chefs-prives', label: 'Chefs privés' },
  { id: 'plats-prepares', label: 'Plats préparés' },
  { id: 'massage', label: 'Massage' },
  { id: 'coaching-prive', label: 'Coaching privé' },
  { id: 'maquillage', label: 'Maquillage' },
  { id: 'coiffure', label: 'Coiffure' },
  { id: 'soins-bien-etre', label: 'Soins bien-être' },
  { id: 'service-traiteur', label: 'Service de traiteur' },
  { id: 'mani-pedi', label: 'Mani-pédi' },
];

export function ServiceTypePicker({ onClose, onSelect, currentService }: ServiceTypePickerProps) {
  const handleSelect = (serviceType: string) => {
    onSelect(serviceType);
    // Ne pas fermer automatiquement
  };

  return (
    <div 
      className="absolute top-full right-0 mt-2 bg-white z-50"
      style={{ 
        borderRadius: '24px', 
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        width: '650px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="px-8 py-8">
        {/* Grid of service type buttons */}
        <div className="grid grid-cols-3 gap-3">
          {serviceTypes.map((service) => {
            const isSelected = currentService === service.label;
            
            return (
              <button
                key={service.id}
                onClick={() => handleSelect(service.label)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-colors justify-center ${
                  isSelected 
                    ? 'border-black' 
                    : 'border-gray-300 hover:border-gray-900'
                }`}
                style={{
                  backgroundColor: '#FFFFFF',
                }}
              >
                <Camera className="w-4 h-4" style={{ color: '#222222' }} strokeWidth={1.5} />
                <span className="text-[14px]" style={{ fontWeight: 400, color: '#222222' }}>
                  {service.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}