import { PropertyCard } from '../components/PropertyCard';
import { PropertyCarousel } from '../components/PropertyCarousel';
import { SearchBar } from '../components/SearchBar';
import { useAuth } from '../context/AuthContext';

interface HomeProps {
  isScrolled: boolean;
  onPropertyClick: (id?: string) => void;
  onSearch?: (params: any) => void;
}

export function Home({ isScrolled, onPropertyClick, onSearch }: HomeProps) {
  const { isAuthenticated } = useAuth();

  // Données pour "Annonces consultées récemment" (Recently Viewed Properties)
  const recentlyViewedProperties = [
    {
      image: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2NzU5NjExMHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Appartement moderne · Paris",
      location: "Hôte particulier",
      date: "",
      price: "250 € pour 2 nuits",
      rating: 4.95,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njc1MzY5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Studio luxueux · Lyon",
      location: "Hôte professionnel",
      date: "",
      price: "180 € pour 2 nuits",
      rating: 4.88,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzU5OTA1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Maison entière · Marseille",
      location: "Hôte particulier",
      date: "",
      price: "320 € pour 2 nuits",
      rating: 5.0,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1610343958761-ca16e472130e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3Njc2MjEwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Loft avec vue · Nice",
      location: "Hôte particulier",
      date: "",
      price: "210 € pour 2 nuits",
      rating: 4.92,
      badge: 'Coup de coeur' as const
    }
  ];

  // Données pour "Logements populaires · Paris"
  const parisProperties = [
    {
      image: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc2NzU5NjExMHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · Paris",
      location: "Hôte particulier",
      date: "",
      price: "197 € pour 2 nuits",
      rating: 4.93,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1667153653404-11bc88130b5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGhvdGVsfGVufDF8fHx8MTc2NzYxNjkyNnww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · Asnières-sur-Seine",
      location: "Hôte particulier",
      date: "",
      price: "180 € pour 2 nuits",
      rating: 4.92,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3Njc1MzY5NTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Appartement · Gonesse-Villiers",
      location: "Hôte particulier",
      date: "",
      price: "18 € pour 2 nuits",
      rating: 4.96,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1765775635143-6462630748ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3NTEwODU4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Appartement · Paris",
      location: "Hôte particulier",
      date: "",
      price: "168 € pour 2 nuits",
      rating: 4.96,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1610343958761-ca16e472130e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBjaXR5JTIwdmlld3xlbnwxfHx8fDE3Njc2MjEwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Appartement en résidence · Saint-Denis",
      location: "Hôte particulier",
      date: "",
      price: "148 € pour 2 nuits",
      rating: 4.90,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1593696140826-c58b021acf8b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob3VzZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NzU5OTA1OHww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Appartement · Paris",
      location: "Hôte particulier",
      date: "",
      price: "160 € pour 2 nuits",
      rating: 5.0,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBob3RlbCUyMGxvYmJ5fGVufDF8fHx8MTc2NzYwMTQyOXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Hébergement · Paris",
      location: "Hôte particulier",
      date: "",
      price: "160 € pour 2 nuits",
      rating: 4.92,
      badge: 'Coup de coeur' as const
    }
  ];

  // Données pour "Hôtels à la une (Madrid)"
  const madridHotels = [
    {
      image: "https://images.unsplash.com/photo-1760354527031-869c0315d7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMGJvdXRpcXVlfGVufDF8fHx8MTc2Nzc5NTU3OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "easyHotel Madrid Alcala",
      location: "À partir de 116 € pour 2 nuits",
      date: "",
      price: "",
      rating: 4.75,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1632228526522-cdbb7fac12dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMGludGVyaW9yfGVufDF8fHx8MTc2NzgwNjczN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Hotel Suites Feria de Madrid",
      location: "À partir de 178 € pour 2 nuits",
      date: "",
      price: "",
      rating: 4.78,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1600790298410-fa81c74d9732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMHBvb2x8ZW58MXx8fHwxNzY3ODA2NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Catalonia Atocha",
      location: "À partir de 420 € pour 2 nuits",
      date: "",
      price: "",
      rating: 5.0,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1737807478452-260777e0505d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMGx1eHVyeXxlbnwxfHx8fDE3Njc4MDY3Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "The Social Hub Madrid 4 Stars",
      location: "À partir de 285 € pour 2 nuits",
      date: "",
      price: "",
      rating: 5.0,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1760354527031-869c0315d7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMGJvdXRpcXVlfGVufDF8fHx8MTc2Nzc5NTU3OXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "chickbasic dot",
      location: "À partir de 294 € pour 2 nuits",
      date: "",
      price: "",
      rating: 4.89,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1632228526522-cdbb7fac12dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMGludGVyaW9yfGVufDF8fHx8MTc2NzgwNjczN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "NH Madrid Barajas Airport",
      location: "À partir de 190 € pour 2 nuits",
      date: "",
      price: "",
      rating: 4.77,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1600790298410-fa81c74d9732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBob3RlbCUyMHBvb2x8ZW58MXx8fHwxNzY3ODA2NzM4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "SmarTrental Collection Gran Vía Centric",
      location: "À partir de 403 € pour 2 nuits",
      date: "",
      price: "",
      rating: 4.95,
      badge: 'Nouveau' as const
    }
  ];

  // Données pour "Logements disponibles le mois prochain · Londres"
  const londonProperties = [
    {
      image: "https://images.unsplash.com/photo-1595848463742-764e6b5c11d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2Nzc5NTU4MXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · East Ham",
      location: "Hôte particulier",
      date: "",
      price: "99 € pour 2 nuits",
      rating: 4.9,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1650533966999-c07a71fd9146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3Nzk1NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Hébergement · Acton",
      location: "Hôte particulier",
      date: "",
      price: "116 € pour 2 nuits",
      rating: 5.0,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1604701145698-2b38c3e20124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY3Nzk1NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · Paddington",
      location: "Hôte particulier",
      date: "",
      price: "178 € pour 2 nuits",
      rating: 4.9,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1595848463742-764e6b5c11d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2Nzc5NTU4MXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Appartement · Bloomsbury",
      location: "Hôte professionnel",
      date: "",
      price: "203 € pour 2 nuits",
      rating: 4.89,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1650533966999-c07a71fd9146?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBob3RlbCUyMHJvb218ZW58MXx8fHwxNzY3Nzk1NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · Londres",
      location: "Hôte particulier",
      date: "",
      price: "95 € pour 2 nuits",
      rating: 4.9,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1604701145698-2b38c3e20124?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzY3Nzk1NTgxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · Churchill Gardens",
      location: "Hôte particulier",
      date: "",
      price: "164 € pour 2 nuits",
      rating: 4.84,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1595848463742-764e6b5c11d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc2Nzc5NTU4MXww&ixlib=rb-4.1.0&q=80&w=1080",
      title: "Chambre · Shadwell",
      location: "Hôte particulier",
      date: "",
      price: "133 € pour 2 nuits",
      rating: 5.0,
      badge: 'Nouveau' as const
    }
  ];

  // Données pour "Logements · Riyad"
  const riyadProperties = [
    {
      image: "https://images.unsplash.com/photo-1646662521253-5b9253b1a207?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Riyad",
      location: "Hôte particulier",
      date: "",
      price: "78 € pour 2 nuits",
      rating: 5.0,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Riyad",
      location: "Hôte particulier",
      date: "",
      price: "154 € pour 2 nuits",
      rating: 4.91,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Al Aqeeq",
      location: "Hôte particulier",
      date: "",
      price: "299 € pour 2 nuits",
      rating: 4.88,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Al Aqeeq",
      location: "Hôte particulier",
      date: "",
      price: "94 € pour 2 nuits",
      rating: 4.59,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1760259905231-2ccbddb7d147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Al Aoud",
      location: "Hôte particulier",
      date: "",
      price: "130 € pour 2 nuits",
      rating: 4.92,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Al Aoud",
      location: "Hôte particulier",
      date: "",
      price: "92 € pour 2 nuits",
      rating: 4.88,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1646662521253-5b9253b1a207?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Al Qadisiyah",
      location: "Hôte particulier",
      date: "",
      price: "79 € pour 2 nuits",
      rating: 4.9,
      badge: undefined
    }
  ];

  // Données pour "Logements disponibles le mois prochain · Dubaï"
  const dubaiProperties = [
    {
      image: "https://images.unsplash.com/photo-1637747021728-22764b40bd99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï-centre-ville",
      location: "Hôte particulier",
      date: "",
      price: "221 € pour 2 nuits",
      rating: 4.9,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï-centre-ville",
      location: "Hôte particulier",
      date: "",
      price: "208 € pour 2 nuits",
      rating: 4.86,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï",
      location: "Hôte particulier",
      date: "",
      price: "193 € pour 2 nuits",
      rating: 4.91,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï-centre-ville",
      location: "Hôte particulier",
      date: "",
      price: "193 € pour 2 nuits",
      rating: 4.91,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1760259905231-2ccbddb7d147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï",
      location: "Hôte particulier",
      date: "",
      price: "137 € pour 2 nuits",
      rating: 5.0,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1646662521253-5b9253b1a207?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï",
      location: "Hôte particulier",
      date: "",
      price: "176 € pour 2 nuits",
      rating: 4.89,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Dubaï",
      location: "Hôte particulier",
      date: "",
      price: "171 € pour 2 nuits",
      rating: 4.9,
      badge: 'Populaire' as const
    }
  ];

  // Données pour "Logements · Madrid"
  const madridApartments = [
    {
      image: "https://images.unsplash.com/photo-1680601531588-1944422d1bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hébergement · Madrid",
      location: "Hôte particulier",
      date: "",
      price: "104 € pour 2 nuits",
      rating: 4.74,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1543273519-e0fe02a0757e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre partagée · Lavapiés",
      location: "Hôte particulier",
      date: "",
      price: "44 € pour 2 nuits",
      rating: 4.77,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1570136608985-36fdcec5b7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · Usera",
      location: "Hôte professionnel",
      date: "",
      price: "40 € pour 2 nuits",
      rating: 4.93,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1600790298410-fa81c74d9732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre partagée · Lavapiés",
      location: "Hôte professionnel",
      date: "",
      price: "42 € pour 2 nuits",
      rating: 4.5,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1680601531588-1944422d1bd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hébergement · Ópera",
      location: "Hôte particulier",
      date: "",
      price: "95 € pour 2 nuits",
      rating: 4.88,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1632228526522-cdbb7fac12dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · Delicias",
      location: "Hôte particulier",
      date: "",
      price: "48 € pour 2 nuits",
      rating: 4.91,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1760354527031-869c0315d7c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Maison d'hôtes · Retiro",
      location: "Hôte professionnel",
      date: "",
      price: "130 € pour 2 nuits",
      rating: 4.75,
      badge: 'Nouveau' as const
    }
  ];

  // Données pour "Logements disponibles le mois prochain · Rome"
  const romeProperties = [
    {
      image: "https://images.unsplash.com/photo-1729755033606-251c462a8bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Aurélio",
      location: "Hôte particulier",
      date: "",
      price: "110 € pour 2 nuits",
      rating: 4.88,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1658077306197-a848d26c6e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Loft · Colonna",
      location: "Hôte professionnel",
      date: "",
      price: "128 € pour 2 nuits",
      rating: 4.78,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1702014859878-5d4743176d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre d'hôtel · Rome",
      location: "Hôte professionnel",
      date: "",
      price: "96 € pour 2 nuits",
      rating: 4.86,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1600790298410-fa81c74d9732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · EUR",
      location: "Hôte particulier",
      date: "",
      price: "60 € pour 2 nuits",
      rating: 4.5,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1702014859878-5d4743176d28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · Esquilin",
      location: "Hôte particulier",
      date: "",
      price: "78 € pour 2 nuits",
      rating: 4.75,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1729755033606-251c462a8bbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Rome",
      location: "Hôte professionnel",
      date: "",
      price: "146 € pour 2 nuits",
      rating: 4.89,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1658077306197-a848d26c6e0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · Trionfale",
      location: "Hôte professionnel",
      date: "",
      price: "114 € pour 2 nuits",
      rating: 4.86,
      badge: 'Populaire' as const
    }
  ];

  // Données pour "Logements · Milan"
  const milanProperties = [
    {
      image: "https://images.unsplash.com/photo-1536494126589-29fadf0d7e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · Milan",
      location: "Hôte particulier",
      date: "",
      price: "154 € pour 2 nuits",
      rating: 4.98,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1718260872589-189e127a99b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · Milan",
      location: "Hôte particulier",
      date: "",
      price: "344 € pour 3 nuits",
      rating: 4.94,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1631176999981-75e49ff7d38c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · Milan",
      location: "Hôte particulier",
      date: "",
      price: "159 € pour 3 nuits",
      rating: 5.0,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hébergement · Milan",
      location: "Hôte professionnel",
      date: "",
      price: "374 € pour 7 nuits",
      rating: 4.56,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1639751907353-3629fc00d2b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Milan",
      location: "Hôte particulier",
      date: "",
      price: "194 € pour 2 nuits",
      rating: 5.0,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1702014861736-d62834317c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · Garattello",
      location: "Hôte particulier",
      date: "",
      price: "123 € pour 2 nuits",
      rating: 4.8,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1536494126589-29fadf0d7e3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · Milan",
      location: "Hôte professionnel",
      date: "",
      price: "168 € pour 2 nuits",
      rating: 4.99,
      badge: 'Nouveau' as const
    }
  ];

  // Données pour "Logements à découvrir · Budapest"
  const budapestProperties = [
    {
      image: "https://images.unsplash.com/photo-1719849448528-bf30db61d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · 9ème arrondissement de Budapest",
      location: "Hôte particulier",
      date: "",
      price: "121 € pour 2 nuits",
      rating: 4.84,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · 8ème arrondissement de Budapest",
      location: "Hôte particulier",
      date: "",
      price: "98 € pour 2 nuits",
      rating: 4.9,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1639751907353-3629fc00d2b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · 3ème arrondissement de Budapest",
      location: "Hôte particulier",
      date: "",
      price: "148 € pour 2 nuits",
      rating: 4.83,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1702014861736-d62834317c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · 6ème arrondissement de Budapest",
      location: "Hôte professionnel",
      date: "",
      price: "68 € pour 2 nuits",
      rating: 4.83,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1638454668466-e8dbd5462f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · 8ème arrondissement de Budapest",
      location: "Hôte privé",
      date: "",
      price: "106 € pour 2 nuits",
      rating: 4.52,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1614622350812-96b09c78af77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · 7ème arrondissement de Budapest",
      location: "Hôte particulier",
      date: "",
      price: "87 € pour 2 nuits",
      rating: 5.0,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1719849448528-bf30db61d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · 7ème arrondissement de Budapest",
      location: "Hôte particulier",
      date: "",
      price: "98 € pour 2 nuits",
      rating: 4.88,
      badge: 'Populaire' as const
    }
  ];

  // Données pour "Logements populaires · Barcelone"
  const barcelonaProperties = [
    {
      image: "https://images.unsplash.com/photo-1693478075635-bf2742c3ea09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hôtel · Gràcia",
      location: "Hôte professionnel",
      date: "",
      price: "190 € pour 2 nuits",
      rating: 4.83,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1560448076-957f79776e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Sants-Montjuïc",
      location: "Hôte particulier",
      date: "",
      price: "164 € pour 2 nuits",
      rating: 4.75,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1600813547757-39c40da12c8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hôtel · Can Magarola",
      location: "Hôte professionnel",
      date: "",
      price: "168 € pour 2 nuits",
      rating: 4.88,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1663756915301-2ba688e078cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre d'hôtel partagée · Les Corts",
      location: "Hôte professionnel",
      date: "",
      price: "114 € pour 2 nuits",
      rating: 4.92,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1639751907353-3629fc00d2b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hébergement · el Barri Gòtic",
      location: "Hôte particulier",
      date: "",
      price: "114 € pour 2 nuits",
      rating: 4.83,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1693478075635-bf2742c3ea09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hôtel · Can Magarola",
      location: "Hôte professionnel",
      date: "",
      price: "164 € pour 2 nuits",
      rating: 4.83,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1560448076-957f79776e95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Gràcia",
      location: "Hôte particulier",
      date: "",
      price: "194 € pour 2 nuits",
      rating: 4.92,
      badge: 'Nouveau' as const
    }
  ];

  // Données pour "Logements · Le Cap"
  const capeTownProperties = [
    {
      image: "https://images.unsplash.com/photo-1549387025-c6b3d88e0ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Centre-ville du Cap",
      location: "Hôte particulier",
      date: "",
      price: "112 € pour 2 nuits",
      rating: 5.0,
      badge: 'Populaire' as const
    },
    {
      image: "https://images.unsplash.com/photo-1654161975362-a1dbab6ba37d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Chambre · Oranjezicht",
      location: "Hôte particulier",
      date: "",
      price: "64 € pour 2 nuits",
      rating: 4.89,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1701445952131-eaab0a82fb08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Suite · Bloubergstrand",
      location: "Hôte particulier",
      date: "",
      price: "82 € pour 2 nuits",
      rating: 4.86,
      badge: 'Nouveau' as const
    },
    {
      image: "https://images.unsplash.com/photo-1549387025-c6b3d88e0ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement · Centre-ville du Cap",
      location: "Hôte particulier",
      date: "",
      price: "16 € pour 2 nuits",
      rating: 4.9,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1654161975362-a1dbab6ba37d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Appartement en résidence · Centre-ville du Cap",
      location: "Hôte professionnel",
      date: "",
      price: "70 € pour 2 nuits",
      rating: 4.9,
      badge: 'Coup de coeur' as const
    },
    {
      image: "https://images.unsplash.com/photo-1701445952131-eaab0a82fb08?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Suite · Claremont",
      location: "Hôte particulier",
      date: "",
      price: "90 € pour 2 nuits",
      rating: 4.93,
      badge: undefined
    },
    {
      image: "https://images.unsplash.com/photo-1549387025-c6b3d88e0ccb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      title: "Hébergement · Sea Point",
      location: "Hôte professionnel",
      date: "",
      price: "27 € pour 2 nuits",
      rating: 4.9,
      badge: 'Populaire' as const
    }
  ];

  return (
    <>
      {/* Search bar - smooth opacity transition synchronized with CompactSearchBar */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isScrolled ? 'opacity-0 max-h-0 pointer-events-none' : 'opacity-100 max-h-[200px]'
        }`}
      >
        <SearchBar onSearch={onSearch} />
      </div>

      <main className="pb-12">
        {/* Annonces consultées récemment - visible only when authenticated */}
        {isAuthenticated && (
          <PropertyCarousel
            title="Annonces consultées récemment"
            showMoreLink={true}
          >
            {recentlyViewedProperties.map((property, index) => (
              <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
                <PropertyCard {...property} onClick={() => onPropertyClick()} />
              </div>
            ))}
          </PropertyCarousel>
        )}

        {/* Logements populaires · Paris */}
        <PropertyCarousel
          title="Logements populaires · Paris"
          showMoreLink={true}
        >
          {parisProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Hôtels à la une (Madrid) */}
        <PropertyCarousel
          title="Hôtels à la une (Madrid)"
          showMoreLink={true}
        >
          {madridHotels.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements disponibles le mois prochain · Londres */}
        <PropertyCarousel
          title="Logements disponibles le mois prochain · Londres"
          showMoreLink={true}
        >
          {londonProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements  Riyad */}
        <PropertyCarousel
          title="Logements · Riyad"
          showMoreLink={true}
        >
          {riyadProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements disponibles le mois prochain · Dubaï */}
        <PropertyCarousel
          title="Logements disponibles le mois prochain · Dubaï"
          showMoreLink={true}
        >
          {dubaiProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements · Madrid */}
        <PropertyCarousel
          title="Logements · Madrid"
          showMoreLink={true}
        >
          {madridApartments.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements disponibles le mois prochain · Rome */}
        <PropertyCarousel
          title="Logements disponibles le mois prochain · Rome"
          showMoreLink={true}
        >
          {romeProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements · Milan */}
        <PropertyCarousel
          title="Logements · Milan"
          showMoreLink={true}
        >
          {milanProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements à découvrir · Budapest */}
        <PropertyCarousel
          title="Logements à découvrir · Budapest"
          showMoreLink={true}
        >
          {budapestProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements populaires · Barcelone */}
        <PropertyCarousel
          title="Logements populaires · Barcelone"
          showMoreLink={true}
        >
          {barcelonaProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Logements · Le Cap */}
        <PropertyCarousel
          title="Logements · Le Cap"
          showMoreLink={true}
        >
          {capeTownProperties.map((property, index) => (
            <div key={index} className="w-[280px] sm:w-[300px] lg:w-[320px]">
              <PropertyCard {...property} onClick={() => onPropertyClick()} />
            </div>
          ))}
        </PropertyCarousel>
      </main>
    </>
  );
}