import { ServiceCategoryCard } from '../components/ServiceCategoryCard';
import { ServiceCard } from '../components/ServiceCard';
import { PropertyCarousel } from '../components/PropertyCarousel';
import { SearchBar } from '../components/SearchBar';
import { useState, useEffect } from 'react';

interface ServicesProps {
  isScrolled: boolean;
  onServiceClick?: (id?: string) => void;
  onSearch?: (params: any) => void;
}

function useWindowWidth() {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
}

function getCardWidth(windowWidth: number): string {
  if (windowWidth < 745) return 'calc((100vw - 48px - 16px) / 2.1)';
  if (windowWidth < 950) return 'calc((100vw - 80px - 48px) / 4)';
  if (windowWidth < 1127) return 'calc((100vw - 80px - 64px) / 5)';
  if (windowWidth < 1285) return 'calc((100vw - 96px - 96px) / 6)';
  return '  calc((100vw - 96px - 112px) / 7)';
}

export function Services({ isScrolled, onServiceClick, onSearch }: ServicesProps) {
  const windowWidth = useWindowWidth();
  const cardWidth = getCardWidth(windowWidth);
  // Données pour la section Chefs privés (nouvelle section horizontale)
  const chefsPrivesSection = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1761095596755-99ba58997720?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb3VybWV0JTIwZm9vZCUyMHBsYXRpbmd8ZW58MXx8fHwxNzY3ODE3NzA5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Repas romain authentique",
      host: "Hôte particulier",
      price: "À partir de 85 € par voyageur",
      rating: 4.57
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1734775506240-8ecd81769e7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGVycmFuZWFuJTIwZGlzaCUyMGZyZXNofGVufDF8fHx8MTc2Nzg1ODk2M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Cuisine hyperlocale par Clair",
      host: "Hôte professionnel",
      price: "À partir de 35 € par voyageur",
      rating: 5.0
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1766232315004-25980447bb19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXNpb24lMjBjdWlzaW5lJTIwcGxhdGluZ3xlbnwxfHx8fDE3Njc4NTg5NjN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Demitsa la Tiannaa et les saveurs fusion par Erok",
      host: "Hôte particulier",
      price: "À partir de 39 € par voyageur",
      rating: 5.0
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1739417083034-4e9118f487be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGFzdGElMjBkaXNofGVufDF8fHx8MTc2NzgzMzI1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Manos californiennes-méditerranéennes célèbres par Lisa",
      host: "Hôte professionnel",
      price: "À partir de 72 € par voyageur",
      rating: 5.0
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1758972574371-57cf8c42bae8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVuY2glMjBjdWlzaW5lJTIwcGxhdGVkfGVufDF8fHx8MTc2Nzg1ODk2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Cuisine catalane par Cristina",
      host: "Hôte particulier",
      price: "À partir de 65 € par voyageur",
      rating: 5.0
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1520583134056-cba33fd93308?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWFyZWQlMjBmaXNoJTIwZ291cm1ldHxlbnwxfHx8fDE3Njc4NTg5NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Cuisine fusion gastronomique internationale par Brían",
      host: "Hôte professionnel",
      price: "À partir de 64 € par voyageur",
      rating: 5.0
    },
    {
      id: "7",
      image: "https://images.unsplash.com/photo-1610643871298-7a097d44b65e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBkZXNzZXJ0JTIwcGxhdGVkfGVufDF8fHx8MTc2Nzg1ODk2NXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Superbes planches de charcuterie par Ronda",
      host: "Hôte particulier",
      price: "À partir de 67 € par voyageur",
      rating: 5.0
    }
  ];

  // Massages
  const massageServices = [
    {
      id: "8",
      image: "https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzY3ODYwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Détendez-vous et revitalisez-vous avec le shiatsu de Laure",
      host: "Hôte particulier",
      price: "À partir de 70 € par voyageur",
      rating: 4.0
    },
    {
      id: "9",
      image: "https://images.unsplash.com/photo-1759216853079-831ef8c8b327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGElMjBzdG9uZXMlMjB0cmVhdG1lbnR8ZW58MXx8fHwxNzY3Nzc3NTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Massage ancestral hawaïen Kahuna par Florant",
      host: "Hôte professionnel",
      price: "À partir de 85 € par voyageur",
      rating: 5.0
    },
    {
      id: "10",
      image: "https://images.unsplash.com/photo-1757689314932-bec6e9c39e51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHRoZXJhcHklMjBoYW5kc3xlbnwxfHx8fDE3Njc4NjAxNjd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Massage sur-mesure par Laurent",
      host: "Hôte professionnel",
      price: "À partir de 85 € par voyageur",
      rating: 5.0
    },
    {
      id: "11",
      image: "https://images.unsplash.com/photo-1537035448858-6d703dbc320f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcm9tYXRoZXJhcHklMjBlc3NlbnRpYWwlMjBvaWxzfGVufDF8fHx8MTc2Nzc4NTk4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Massage et rituel de soulagement par la méthode Cypher",
      host: "Hôte professionnel",
      price: "À partir de 95 € par voyageur",
      rating: 4.0
    },
    {
      id: "12",
      image: "https://images.unsplash.com/photo-1672015521020-ab4f86d5cc00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHNwYSUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzY3ODM3NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Massage personnalisé aux huiles chaudes par Marine",
      host: "Hôte particulier",
      price: "À partir de 80 € par groupe",
      rating: 5.0
    },
    {
      id: "13",
      image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrJTIwbWFzc2FnZSUyMHRoZXJhcHl8ZW58MXx8fHwxNzY3Nzc1OTMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Massages Ayurvédiques et Réflexologie par Sandrine",
      host: "Hôte professionnel",
      price: "À partir de 65 € par voyageur",
      rating: 5.0
    },
    {
      id: "14",
      image: "https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXNzYWdlJTIwdGhlcmFweSUyMHJlbGF4YXRpb258ZW58MXx8fHwxNzY3ODYwMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Massages indiens et sonores",
      host: "Hôte particulier",
      price: "À partir de 88 € par voyageur",
      rating: 4.0
    }
  ];

  // Coaching privé
  const coachingServices = [
    {
      id: "15",
      image: "https://images.unsplash.com/photo-1652191090258-5a2df9ad6723?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwdHJhaW5pbmclMjBvdXRkb29yfGVufDF8fHx8MTc2Nzg1MTM1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Coaching sportif personnalisé en plein air",
      host: "Hôte professionnel",
      price: "À partir de 60 € par séance",
      rating: 5.0
    },
    {
      id: "16",
      image: "https://images.unsplash.com/photo-1651077837628-52b3247550ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b2dhJTIwY2xhc3MlMjBzdHVkaW98ZW58MXx8fHwxNzY3NzgyNDU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Séance de yoga privée pour débutants",
      host: "Hôte particulier",
      price: "À partir de 50 € par séance",
      rating: 4.9
    },
    {
      id: "17",
      image: "https://images.unsplash.com/photo-1585484764802-387ea30e8432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB3b3Jrb3V0JTIwd2VpZ2h0c3xlbnwxfHx8fDE3Njc4NTUxMzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Personal training intensif à domicile",
      host: "Hôte professionnel",
      price: "À partir de 75 € par séance",
      rating: 5.0
    },
    {
      id: "18",
      image: "https://images.unsplash.com/photo-1731325632687-51e90609e700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWxhdGVzJTIwZXhlcmNpc2UlMjBtYXR8ZW58MXx8fHwxNzY3ODYwMTY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Pilates privé avec équipements professionnels",
      host: "Hôte professionnel",
      price: "À partir de 65 € par séance",
      rating: 4.95
    },
    {
      id: "19",
      image: "https://images.unsplash.com/photo-1540205453279-389ebbc43b5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHRyYWluZXIlMjBjb2FjaGluZ3xlbnwxfHx8fDE3Njc4MjY4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Coaching nutrition et remise en forme",
      host: "Hôte particulier",
      price: "À partir de 70 € par séance",
      rating: 4.88
    },
    {
      id: "20",
      image: "https://images.unsplash.com/photo-1574406280735-351fc1a7c5e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJldGNoaW5nJTIwZmxleGliaWxpdHklMjBleGVyY2lzZXxlbnwxfHx8fDE3Njc4NjAxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Entraînement fonctionnel en groupe",
      host: "Hôte professionnel",
      price: "À partir de 40 € par séance",
      rating: 5.0
    },
    {
      id: "21",
      image: "https://images.unsplash.com/photo-1766524791322-8753e582e652?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjB6ZW58ZW58MXx8fHwxNzY3ODE2NTU0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Méditation et gestion du stress",
      host: "Hôte particulier",
      price: "À partir de 55 € par séance",
      rating: 4.92
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search bar - hidden on mobile (S < 745) */}
      <div className="hidden md:block">
        <SearchBar type="services" onSearch={onSearch} />
      </div>

      <main className="pb-12">
        {/* Section Chefs privés avec défilement horizontal */}
        <PropertyCarousel
          title="Chefs privés"
          showMoreLink={true}
        >
          {chefsPrivesSection.map((service) => (
            <div key={service.id} style={{ width: cardWidth }} className="transition-all duration-300">
              <ServiceCard {...service} onClick={onServiceClick} />
            </div>
          ))}
        </PropertyCarousel>


        {/* Coaching privé */}
        <PropertyCarousel
          title="Coaching privé"
          showMoreLink={true}
        >
          {coachingServices.map((service) => (
            <div key={service.id} style={{ width: cardWidth }} className="transition-all duration-300">
              <ServiceCard {...service} onClick={onServiceClick} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Massage */}
        <PropertyCarousel
          title="Massage"
          showMoreLink={true}
        >
          {massageServices.map((service) => (
            <div key={service.id} style={{ width: cardWidth }} className="transition-all duration-300">
              <ServiceCard {...service} onClick={onServiceClick} />
            </div>
          ))}
        </PropertyCarousel>
      </main>
    </div>
  );
}