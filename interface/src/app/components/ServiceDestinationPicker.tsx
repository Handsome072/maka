import { Navigation, Landmark } from 'lucide-react';

interface ServiceDestinationPickerProps {
  onClose: () => void;
  onSelect: (destination: string) => void;
}

const destinations = [
  {
    icon: Navigation,
    title: "À proximité",
    description: "Découvrez les options à proximité",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Landmark,
    title: "Marseille, Provence-Alpes-Côte d'Azur",
    description: "Destination balnéaire prisée",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Landmark,
    title: "Lyon, Auvergne-Rhône-Alpes",
    description: "Célèbre pour des sites comme : Basilique Notre-Dame de Fourvière",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: Landmark,
    title: "Montpellier, Occitanie",
    description: "Populaire auprès des voyageurs à proximité",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Landmark,
    title: "Toulouse, Occitanie",
    description: "Célèbre pour des sites comme : Basilique Saint-Sernin",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    icon: Landmark,
    title: "Barcelone, Espagne",
    description: "Destination balnéaire prisée",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Landmark,
    title: "Bordeaux, Nouvelle-Aquitaine",
    description: "À 415 km",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
  },
];

export function ServiceDestinationPicker({ onClose, onSelect }: ServiceDestinationPickerProps) {
  const handleSelect = (destination: string) => {
    onSelect(destination);
    // Ne pas fermer automatiquement
  };

  return (
    <div 
      className="absolute top-full left-0 mt-2 bg-white z-50"
      style={{ 
        borderRadius: '20px', 
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        width: '500px'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="max-h-[420px] overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {/* À proximité - First item with larger spacing */}
        <button
          className="w-full flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left mb-4"
          onClick={() => handleSelect("À proximité")}
        >
          <div 
            className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-blue-100 text-blue-600"
            style={{ borderRadius: '8px' }}
          >
            <Navigation className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="text-[15px] mb-0.5" style={{ fontWeight: 600, color: '#222222' }}>
              À proximité
            </p>
            <p className="text-[13px]" style={{ color: '#717171' }}>
              Découvrez les options à proximité
            </p>
          </div>
        </button>

        {/* Suggestions de destinations */}
        <h3 className="text-[13px] mb-4 px-2" style={{ fontWeight: 500, color: '#717171' }}>
          Suggestions de destinations
        </h3>
        
        <div className="space-y-0">
          {destinations.slice(1).map((destination, index) => {
            const Icon = destination.icon;
            return (
              <button
                key={index}
                className="w-full flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleSelect(destination.title)}
              >
                <div 
                  className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${destination.bgColor} ${destination.iconColor}`}
                  style={{ borderRadius: '8px' }}
                >
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[15px] mb-0.5" style={{ fontWeight: 600, color: '#222222' }}>
                    {destination.title}
                  </p>
                  <p className="text-[13px]" style={{ color: '#717171' }}>
                    {destination.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
