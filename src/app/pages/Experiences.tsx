import { ExperienceCard } from '../components/ExperienceCard';
import { PropertyCarousel } from '../components/PropertyCarousel';
import { SearchBar } from '../components/SearchBar';
import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { useInView } from 'motion/react';

interface ExperiencesProps {
  isScrolled: boolean;
  onExperienceClick?: (id?: string) => void;
  onSearch?: (params: any) => void;
}

function useWindowWidth() {
  const [width, setWidth] = useState(1200);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setWidth(window.innerWidth);

    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { width, mounted };
}

function getCardWidth(windowWidth: number): string {
  if (windowWidth < 745) return 'calc(100vw - 32px - 80px)';
  if (windowWidth < 950) return 'calc((100vw - 80px - 48px) / 4)';
  if (windowWidth < 1127) return 'calc((100vw - 80px - 64px) / 5)';
  if (windowWidth < 1285) return 'calc((100vw - 96px - 96px) / 6)';
  return 'calc((100vw - 96px - 112px) / 7)';
}

export function Experiences({ isScrolled, onExperienceClick, onSearch }: ExperiencesProps) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { width: windowWidth, mounted } = useWindowWidth();
  const cardWidth = mounted ? getCardWidth(windowWidth) : undefined;

  // HOMIQIO Originals - Organisées par des hôtes d'exception
  const originalsExperiences = [
    {
      image: "https://images.unsplash.com/photo-1761839256547-0a1cd11b6dfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlJTIwdHJhaW5pbmclMjBzcG9ydHN8ZW58MXx8fHwxNzY3ODYxOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Récupérez comme un athlète olympique avec un expert du sport",
      host: "Hôte particulier",
      price: "À partir de 94 € par voyageur",
      rating: 5.0
    },
    {
      image: "https://images.unsplash.com/photo-1752649935095-ac8f23ec446b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3QlMjBwYWludGluZyUyMHdvcmtzaG9wfGVufDF8fHx8MTc2Nzg2MTkwOXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Les secrets d'entraînement de l'artiste olympique expérimenté",
      host: "Hôte particulier",
      price: "Durée d'excursion totale : À partir de 96 € par voyageur",
      rating: 5.0
    },
    {
      image: "https://images.unsplash.com/photo-1767731053668-c370c651bc91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMHRyYWluaW5nfGVufDF8fHx8MTc2Nzg2MTkwOXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Carfez-en football réussi avec Alexis olympique de Paris",
      host: "Hôte particulier",
      price: "Durée d'excursion totale : À partir de 80 € par voyageur",
      rating: 4.92
    },
    {
      image: "https://images.unsplash.com/photo-1681633528883-bc217d2e4dfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwc3R1ZGlvfGVufDF8fHx8MTc2Nzc2NDY5NXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Sac de week-end MILLIT Bangkok : conception de l'atelier d'Hadrien",
      host: "Hôte particulier",
      price: "Débute le 13 janvier",
      rating: 5.0
    },
    {
      image: "https://images.unsplash.com/photo-1747190918503-0a1cb90d8eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY3VscHR1cmUlMjBhcnQlMjBjbGFzc3xlbnwxfHx8fDE3Njc4NjE5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Sculptez le marbre avec un sculpteur de la renaissance d'Italie",
      host: "Hôte particulier",
      price: "Anciens, Grèce : Design de voyage - À partir de 90 € par voyageur",
      rating: 5.0
    },
    {
      image: "https://images.unsplash.com/photo-1766019463317-1cc801c15e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBleHBlcmllbmNlfGVufDF8fHx8MTc2Nzg2MTkxMHww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Découvrez la musique et dégustez un cocktail avec un DJ invité",
      host: "Hôte professionnel",
      price: "Hors, France : À partir de 69 € par voyageur",
      rating: 4.26
    },
    {
      image: "https://images.unsplash.com/photo-1593697725250-6a184f4e9ed0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNvcmRpbmclMjBzdHVkaW8lMjBtdXNpY3xlbnwxfHx8fDE3Njc3ODQ2NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Originals' as const,
      title: "Dégustez du vin rosé et saluez dans un studio d'enregistrement",
      host: "Hôte particulier",
      price: "Hôte particulier : À partir de 74 € par voyageur",
      rating: 4.98
    }
  ];

  // Expériences populaires · Paris
  const popularExperiences = [
    {
      image: "https://images.unsplash.com/photo-1761594606868-1c577b10f69e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMGNyb2lzc2FudCUyMGJha2luZ3xlbnwxfHx8fDE3Njc4NjE5MTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Coup de coeur' as const,
      title: "Apprenez à préparer des croissants parfaits",
      host: "Hôte professionnel",
      price: "À partir de 95 € par voyageur",
      rating: 4.95
    },
    {
      image: "https://images.unsplash.com/photo-1682071608037-22faea2a0ee5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWNyZXQlMjBiYXIlMjBjb2NrdGFpbHxlbnwxfHx8fDE3Njc4NjE5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Percez les secrets des bars clandestins de Paris",
      host: "Hôte particulier",
      price: "À partir de 25 € par voyageur",
      rating: 4.93
    },
    {
      image: "https://images.unsplash.com/photo-1758874960436-c97920a559cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmVhZCUyMGJha2luZyUyMGNsYXNzfGVufDF8fHx8MTc2Nzg2MTkxMXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "No Diet Club : les meilleurs spots pains et pâtisseries",
      host: "Hôte particulier",
      price: "À partir de 61 € par voyageur",
      rating: 4.93
    },
    {
      image: "https://images.unsplash.com/photo-1715000780536-1f3f368b8587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBjaGVmfGVufDF8fHx8MTc2Nzg2MTkxMnww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Préparez des macarons dans une cuisine professionnelle",
      host: "Hôte professionnel",
      price: "À partir de 64 € par voyageur",
      rating: 4.95
    },
    {
      image: "https://images.unsplash.com/photo-1725958779107-e7b359bacbcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMHZpbnRhZ2UlMjBjYXJ8ZW58MXx8fHwxNzY3ODYxOTExfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "Découvrez Paris à bord d'une Citroën 2CV d'époque",
      host: "Hôte professionnel",
      price: "À partir de 76 € par voyageur",
      rating: 4.97
    },
    {
      image: "https://images.unsplash.com/photo-1722763188444-3325506ddcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3aW5lJTIwdGFzdGluZ3xlbnwxfHx8fDE3Njc4NjE5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Explorez des petits cachés de Londres : fromages et vins",
      host: "Hôte professionnel",
      price: "À partir de 70 € par voyageur",
      rating: 4.91
    },
    {
      image: "https://images.unsplash.com/photo-1670255022693-37f1be72bfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaWFubyUyMGtleWJvYXJkJTIwbXVzaWN8ZW58MXx8fHwxNzY3ODYxOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Plongez au cœur de la vie instrumentale : piano et cordes",
      host: "Hôte particulier",
      price: "À partir de 75 € par voyageur",
      rating: 4.93
    },
    {
      image: "https://images.unsplash.com/photo-1757085242669-076c35ff9397?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjB3b3Jrc2hvcCUyMHBlb3BsZXxlbnwxfHx8fDE3Njc1OTY5MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Coup de coeur' as const,
      title: "Dégustation de fromages et de vins dans une cave parisienne",
      host: "Hôte professionnel",
      price: "À partir de 87 € par voyageur",
      rating: 4.87
    }
  ];

  // Expériences · Londres
  const londonExperiences = [
    {
      image: "https://images.unsplash.com/photo-1745016176874-cd3ed3f5bfc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjBiaWclMjBiZW58ZW58MXx8fHwxNzY3ODUzNTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "Promenez-vous dans Londres avec un habitant qui a quitté la France",
      host: "Hôte particulier",
      price: "À partir de 16 € par voyageur",
      rating: 4.98
    },
    {
      image: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjB0b3dlciUyMGJyaWRnZXxlbnwxfHx8fDE3Njc4NTg4NzF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Visite familiale de Londres et du Palais de Harry Potter",
      host: "Hôte professionnel",
      price: "À partir de 16 € par voyageur",
      rating: 4.98
    },
    {
      image: "https://images.unsplash.com/photo-1707336280554-7ec7854a548a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb25kb24lMjB3YWxraW5nJTIwdG91cnxlbnwxfHx8fDE3Njc4NjE5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Visite à pied de Londres : 30 sites touristiques en 3 heures",
      host: "Hôte professionnel",
      price: "À partir de 22 € par voyageur",
      rating: 4.98
    },
    {
      image: "https://images.unsplash.com/photo-1760530627716-8d872dc90c4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGlza2V5JTIwdGFzdGluZyUyMGJhcnxlbnwxfHx8fDE3Njc4NjE5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Coup de coeur' as const,
      title: "Découvrez plus de 30 sites touristiques de Londres en minibus",
      host: "Hôte professionnel",
      price: "À partir de 27 € par voyageur",
      rating: 5.0
    },
    {
      image: "https://images.unsplash.com/photo-1714561381818-6980db3f9032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWRkZW4lMjBzcGVha2Vhc3klMjBsb25kb258ZW58MXx8fHwxNzY3ODYxOTE0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Explorez des petits cachés de Londres : histoire et architecture",
      host: "Hôte professionnel",
      price: "À partir de 20 € par voyageur",
      rating: 4.5
    },
    {
      image: "https://images.unsplash.com/photo-1582001961902-b4826d86cc31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBmb29kJTIwbG9uZG9ufGVufDF8fHx8MTc2Nzg2MTkxNHww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "No Diet Club : visite gastronomique à vélo à Londres",
      host: "Hôte professionnel",
      price: "À partir de 30 € par voyageur",
      rating: 4.96
    },
    {
      image: "https://images.unsplash.com/photo-1722763188444-3325506ddcb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVlc2UlMjB3aW5lJTIwdGFzdGluZ3xlbnwxfHx8fDE3Njc4NjE5MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "No Diet Club : les meilleurs spots de vin de Londres",
      host: "Hôte professionnel",
      price: "À partir de 81 € par voyageur",
      rating: 4.96
    }
  ];

  // Expériences · Dubaï
  const dubaiExperiences = [
    {
      image: "https://images.unsplash.com/photo-1624062999726-083e5268525d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGRlc2VydCUyMHNhZmFyaXxlbnwxfHx8fDE3Njc4NjE5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Safari de luxe dans le désert à Dubaï : VIP et soirée gastronomique",
      host: "Hôte particulier",
      price: "À partir de 40 € par voyageur",
      rating: 4.45
    },
    {
      image: "https://images.unsplash.com/photo-1655959473554-2c6f0fc9e4a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzdW5zZXQlMjBkdWJhaXxlbnwxfHx8fDE3Njc4NjE5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Visite premium du désert au coucher de soleil et dîner BBQ",
      host: "Hôte professionnel",
      price: "À partir de 35 € par voyageur",
      rating: 4.45
    },
    {
      image: "https://images.unsplash.com/photo-1766019463317-1cc801c15e61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGNvbmNlcnQlMjBleHBlcmllbmNlfGVufDF8fHx8MTc2Nzg2MTkxMHww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "Excursion matinale dans le désert : lever du soleil et sport",
      host: "Hôte professionnel",
      price: "À partir de 21 € par voyageur",
      rating: 4.88
    },
    {
      image: "https://images.unsplash.com/photo-1655959473554-2c6f0fc9e4a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNlcnQlMjBzdW5zZXQlMjBkdWJhaXxlbnwxfHx8fDE3Njc4NjE5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Safari dans le désert au coucher du soleil, dîner et spectacle de lanternes",
      host: "Hôte professionnel",
      price: "À partir de 29 € par voyageur",
      rating: 4.64
    },
    {
      image: "https://images.unsplash.com/photo-1766090648323-41d6b4de0958?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdHYlMjBxdWFkJTIwZGVzZXJ0fGVufDF8fHx8MTc2Nzg2MTkxNXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Coup de coeur' as const,
      title: "Safari dans le désert avec barbecues, balade en chameau et quad",
      host: "Hôte professionnel",
      price: "À partir de 35 € par voyageur",
      rating: 4.34
    },
    {
      image: "https://images.unsplash.com/photo-1730046881361-7780827f070b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMGNhbWVsJTIwZGVzZXJ0fGVufDF8fHx8MTc2Nzg2MTkxNnww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Visite au coucher du soleil, quad, fauconnerie et aventure",
      host: "Hôte professionnel",
      price: "À partir de 33 € par voyageur",
      rating: 4.93
    },
    {
      image: "https://images.unsplash.com/photo-1696880406958-925cffcbcd68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHBhbGFjZSUyMHRvdXJ8ZW58MXx8fHwxNzY3ODYxOTE2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Excursion inoubliable d'une journée de Dubaï à Abu Dhabi",
      host: "Hôte professionnel",
      price: "À partir de 29 € par voyageur",
      rating: 4.32
    }
  ];

  // Expériences · Madrid
  const madridExperiences = [
    {
      image: "https://images.unsplash.com/photo-1653212452950-63bdcf07fd04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjB0YXBhcyUyMGZvb2R8ZW58MXx8fHwxNzY3ODYyMjg3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "Découvrez l'historique Madrid",
      host: "Hôte professionnel",
      price: "À partir de 22 € par voyageur",
      rating: 4.88
    },
    {
      image: "https://images.unsplash.com/photo-1513882255491-180123da744e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBmbGFtZW5jbyUyMGRhbmNlfGVufDF8fHx8MTc2Nzg2MjI4OHww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Découvrez le flamenco authentique",
      host: "Hôte professionnel",
      price: "À partir de 22 € par voyageur",
      rating: 4.83
    },
    {
      image: "https://images.unsplash.com/photo-1658922184330-001b78430070?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjByb3lhbCUyMHBhbGFjZXxlbnwxfHx8fDE3Njc4NjIyODh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Coup de coeur' as const,
      title: "Découvrez les meilleurs vins d'Espagne de Madrid avec un spécialiste",
      host: "Hôte particulier",
      price: "À partir de 60 € par voyageur",
      rating: 4.94
    },
    {
      image: "https://images.unsplash.com/photo-1677076388220-e596780b1c7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjB3aW5lJTIwdGFzdGluZ3xlbnwxfHx8fDE3Njc4NjIyODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Dîner des vins espagnols à Madrid",
      host: "Hôte créateur de métier",
      price: "À partir de 30 € par voyageur",
      rating: 4.93
    },
    {
      image: "https://images.unsplash.com/photo-1653421579378-e0b58f596482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBjb29raW5nJTIwY2xhc3N8ZW58MXx8fHwxNzY3ODYyMjg5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Madrid racine : histoire, accents et anecdotes",
      host: "Hôte particulier",
      price: "À partir de 24 € par voyageur",
      rating: 4.93
    },
    {
      image: "https://images.unsplash.com/photo-1661331149601-0cb146e9e90b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBjaXR5JTIwdG91cnxlbnwxfHx8fDE3Njc4NjIyODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Entre-Madrid Déblotion Tapas",
      host: "Hôte particulier",
      price: "À partir de 69 € par voyageur",
      rating: 4.98
    },
    {
      image: "https://images.unsplash.com/photo-1715719461650-427c2a3f8f6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWRyaWQlMjBhcmNoaXRlY3R1cmUlMjBsYW5kbWFya3xlbnwxfHx8fDE3Njc4NjIyODl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "Le secret de Madrid",
      host: "Hôte particulier",
      price: "À partir de 22 € par voyageur",
      rating: 4.98
    }
  ];

  // Expériences · Rome
  const romeExperiences = [
    {
      image: "https://images.unsplash.com/photo-1586197132548-e2e19edf9f89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwcGFzdGElMjBjb29raW5nfGVufDF8fHx8MTc2Nzg2MjI4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Coup de coeur' as const,
      title: "Préparez des fettuccine et du tiramisu avec une hôtelière",
      host: "Hôte particulier",
      price: "À partir de 89 € par voyageur",
      rating: 4.87
    },
    {
      image: "https://images.unsplash.com/photo-1608541883371-36cd8513e07f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwd2Fsa2luZyUyMHRvdXJ8ZW58MXx8fHwxNzY3ODYyMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Visite guidée : Colisée, Forum et Palatin",
      host: "Hôte professionnel",
      price: "À partir de 54 € par voyageur",
      rating: 4.68
    },
    {
      image: "https://images.unsplash.com/photo-1721481955791-59b51486b3f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwY29sb3NzZXVtJTIwdG91cnxlbnwxfHx8fDE3Njc4NjIyOTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Tournée des bars à Rome",
      host: "Hôte professionnel",
      price: "À partir de 36 € par voyageur",
      rating: 4.89
    },
    {
      image: "https://images.unsplash.com/photo-1605890066806-0c9b56c9030c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwdmVzcGElMjB0b3VyfGVufDF8fHx8MTc2Nzg2MjI5MXww&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Découvrez les incontournables de Rome avec un artiste local",
      host: "Hôte professionnel",
      price: "À partir de 49 € par voyageur",
      rating: 4.97
    },
    {
      image: "https://images.unsplash.com/photo-1672073885586-512de43a23b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwZm9vZCUyMHRvdXJ8ZW58MXx8fHwxNzY3ODYyMjkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Populaire' as const,
      title: "Préparez des pâtes et du tiramisu avec Sabrina",
      host: "Hôte particulier",
      price: "À partir de 56 € par voyageur",
      rating: 4.98
    },
    {
      image: "https://images.unsplash.com/photo-1732700363886-61cff81859d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwdmF0aWNhbiUyMHRvdXJ8ZW58MXx8fHwxNzY3ODYyMjkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: undefined,
      title: "Découvrez les couloirs du Vatican",
      host: "Hôte professionnel",
      price: "À partir de 50 € par voyageur",
      rating: 4.98
    },
    {
      image: "https://images.unsplash.com/photo-1723642019384-bc5e4b987c2e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21lJTIwcGl6emElMjBtYWtpbmd8ZW58MXx8fHwxNzY3ODYyMjkxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      badge: 'Nouveau' as const,
      title: "Visite à pied avec un archéologue",
      host: "Hôte professionnel",
      price: "À partir de 54 € par voyageur",
      rating: 4.96
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Search bar - hidden on mobile (S < 745) */}
      <div className="hidden md:block">
        <SearchBar type="experiences" onSearch={onSearch} />
      </div>

      <main className="pb-12">
        {/* HOMIQIO Originals */}
        <PropertyCarousel
          title="HOMIQIO Originals"
          subtitle="Organisées par des hôtes d'exception"
          showMoreLink={true}
        >
          {originalsExperiences.map((experience, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <ExperienceCard {...experience} onClick={() => onExperienceClick?.()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Section: Populaires auprès d'autres voyageurs - with fade-in animation */}
        <motion.div
          ref={sectionRef}
          ref={sectionRef}
          className="px-4 sm:px-6 lg:px-20 mb-4 md:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h2 className="text-lg md:text-3xl" style={{ fontWeight: 600 }}>
            Populaires auprès d'autres voyageurs
          </h2>
        </motion.div>

        {/* Expériences · Paris */}
        <PropertyCarousel
          title="Expériences · Paris"
          showMoreLink={true}
        >
          {popularExperiences.map((experience, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <ExperienceCard {...experience} onClick={() => onExperienceClick?.()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Expériences · Londres */}
        <PropertyCarousel
          title="Expériences · Londres"
          showMoreLink={true}
        >
          {londonExperiences.map((experience, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <ExperienceCard {...experience} onClick={() => onExperienceClick?.()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Expériences · Dubaï */}
        <PropertyCarousel
          title="Expériences · Dubaï"
          showMoreLink={true}
        >
          {dubaiExperiences.map((experience, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <ExperienceCard {...experience} onClick={() => onExperienceClick?.()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Expériences · Madrid */}
        <PropertyCarousel
          title="Expériences · Madrid"
          showMoreLink={true}
        >
          {madridExperiences.map((experience, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <ExperienceCard {...experience} onClick={() => onExperienceClick?.()} />
            </div>
          ))}
        </PropertyCarousel>

        {/* Expériences · Rome */}
        <PropertyCarousel
          title="Expériences · Rome"
          showMoreLink={true}
        >
          {romeExperiences.map((experience, index) => (
            <div key={index} style={{ width: cardWidth }} className="transition-all duration-300">
              <ExperienceCard {...experience} onClick={() => onExperienceClick?.()} />
            </div>
          ))}
        </PropertyCarousel>
      </main>
    </div>
  );
}