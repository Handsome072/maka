import { useState } from "react";
import {
  Search,
  ChevronRight,
  Globe,
  Menu,
  User,
  FileText,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";

interface HelpCenterProps {
  onNavigate: (page: string) => void;
}

type TabId =
  | "voyageur"
  | "hote-logement"
  | "hote-experience"
  | "hote-services"
  | "admin-voyages";

export function HelpCenter({ onNavigate }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchSuggestions, setShowSearchSuggestions] =
    useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("voyageur");

  const tabs = [
    { id: "voyageur" as TabId, label: "Voyageur" },
    {
      id: "hote-logement" as TabId,
      label: "Hôte d'un logement",
    },
    {
      id: "hote-experience" as TabId,
      label: "Hôte d'expérience",
    },
    { id: "hote-services" as TabId, label: "Hôte de services" },
    {
      id: "admin-voyages" as TabId,
      label: "Administrateur de voyages",
    },
  ];

  // Content data for each tab
  const tabContent = {
    voyageur: {
      showRecommended: true,
      guideTitle: "Guides pour démarrer",
      guideCards: [
        {
          image:
            "https://images.unsplash.com/photo-1568046350182-38557087f053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjB2YWNhdGlvbiUyMGd1aWRlfGVufDF8fHx8MTc2ODkxNTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Premiers pas en tant que voyageur sur Airbnb",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1741795843783-e6fc4c27386b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBib29raW5nJTIwdHJhdmVsfGVufDF8fHx8MTc2ODkxNTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
          title:
            "Utilisez les fonctionnalités de recherche afin de trouver un hébergement sur Airbnb",
          isAirCover: false,
        },
        {
          image: "",
          title: "AirCover pour les voyageurs",
          isAirCover: true,
        },
        {
          image:
            "https://images.unsplash.com/photo-1648447003206-d0814cf240b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBjaGVja2lufGVufDF8fHx8MTc2ODkxNTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
          title:
            "Vérifiez et modifiez vos informations personnelles sur votre compte Airbnb",
          isAirCover: false,
        },
      ],
      mainArticles: [
        {
          title:
            "Annuler votre réservation de logement en tant que voyageur",
          description:
            "Vous pouvez annuler ou modifier la réservation d'un logement dans la section Voyages.",
        },
        {
          title:
            "Modifier la date ou l'heure de votre réservation de service ou d'expérience",
          description:
            "Lorsque vous réservez un service ou une expérience, vous pouvez modifier la date ou...",
        },
        {
          title:
            "Si votre hôte annule votre réservation de logement",
          description:
            "Si votre réservation est annulée par l'hôte, vous recevrez un remboursement intégral. Si...",
        },
        {
          title: "Modes de paiement acceptés",
          description:
            "Nous acceptons différents modes de paiement selon le pays dans lequel votre...",
        },
        {
          title: "Ajouter ou supprimer un mode de paiement",
          description:
            "Découvrez comment gérer vos modes de paiement.",
        },
        {
          title: "Quand vous payerez votre réservation",
          description:
            "Cela dépend du type de réservation, du mode de paiement et du lieu de séjour.",
        },
      ],
      learnMoreImages: [
        "https://images.unsplash.com/photo-1754299520114-a04483392973?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbiUyMGd1aWRlfGVufDF8fHx8MTc2ODgxNzczN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1694087450396-f6b1031b37d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWNhdGlvbiUyMHBsYW5uaW5nJTIwbWFwfGVufDF8fHx8MTc2ODkyNDc2NHww&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
    "hote-logement": {
      showRecommended: true,
      guideTitle: "Guides pour les hôtes",
      guideCards: [
        {
          image:
            "https://images.unsplash.com/photo-1568046350182-38557087f053?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHJlYWRpbmclMjB2YWNhdGlvbiUyMGd1aWRlfGVufDF8fHx8MTc2ODkxNTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Débuter en tant qu'hôte de logement",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1741795843783-e6fc4c27386b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBib29raW5nJTIwdHJhdmVsfGVufDF8fHx8MTc2ODkxNTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Créer une annonce attrayante",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1648447003206-d0814cf240b8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3RlbCUyMHJvb20lMjBjaGVja2lufGVufDF8fHx8MTc2ODkxNTQ1M3ww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Gérer les réservations",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1666037381264-41b4f85ac647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMGhpa2luZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3Njg5MTU0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Protection pour les hôtes",
          isAirCover: false,
        },
      ],
      mainArticles: [
        {
          title: "Créer votre annonce de logement",
          description:
            "Découvrez comment créer une annonce attractive pour votre logement sur HOMIQIO.",
        },
        {
          title: "Définir vos tarifs et disponibilités",
          description:
            "Apprenez à gérer vos prix et votre calendrier pour optimiser vos réservations.",
        },
        {
          title: "Accueillir vos premiers voyageurs",
          description:
            "Conseils pour offrir une excellente expérience à vos premiers invités.",
        },
        {
          title: "Gérer les demandes de réservation",
          description:
            "Comment accepter ou refuser les demandes de réservation de manière appropriée.",
        },
        {
          title: "Règles de la maison et communication",
          description:
            "Établissez des règles claires et communiquez efficacement avec vos voyageurs.",
        },
        {
          title: "Annulations et remboursements pour les hôtes",
          description:
            "Comprendre les politiques d'annulation et de remboursement depuis la perspective de l'hôte.",
        },
      ],
      learnMoreImages: [
        "https://images.unsplash.com/photo-1666037381264-41b4f85ac647?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMGhpa2luZyUyMGFkdmVudHVyZXxlbnwxfHx8fDE3Njg5MTU0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1552249352-02a0817a2d95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjB2YWNhdGlvbiUyMGJlYWNofGVufDF8fHx8MTc2ODgwNzQ4OXww&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
    "hote-experience": {
      showRecommended: false,
      guideTitle: "Guides pour les hôtes d'expériences",
      guideCards: [
        {
          image:
            "https://images.unsplash.com/photo-1641750875717-8c98badfd9a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBlcmllbmNlJTIwaG9zdCUyMG91dGRvb3J8ZW58MXx8fHwxNzY4OTE2ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          title:
            "Recevoir des versements en tant que nouvel hôte",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1758618131833-70f14f9e869a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGhpa2luZyUyMGd1aWRlfGVufDF8fHx8MTc2ODkxNjg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
          title:
            "Organisation d'une expérience : voici quelques conseils pour vous lancer",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1762994576926-b8268190a2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBpbnN0cnVjdG9yfGVufDF8fHx8MTc2ODkxNjg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
          title:
            "Annulations et modifications de services et d'expériences",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1765020553734-2c050ddb9494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlJTIwcHJvdmlkZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4OTE2OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
          title:
            "Fonctionnement de l'activité de co-hôte pour les expériences Airbnb",
          isAirCover: false,
        },
      ],
      mainArticles: [
        {
          title:
            "Conditions et critères relatifs aux expériences et services Airbnb",
          description:
            "Découvrez les conditions et les critères que doivent respecter les hôtes d'...",
        },
        {
          title:
            "Politique en cas d'annulation par l'hôte relative aux services et aux expériences",
          description:
            "La présente politique définit la responsabilité de l'hôte à honorer les réservations...",
        },
        {
          title:
            "Conditions d'annulation relatives aux services et aux expériences",
          description:
            "La plupart des services et des expériences sont soumis à des conditions d'annulation d'u...",
        },
        {
          title:
            "Comment fonctionnent les versements pour les expériences ?",
          description:
            "Tout d'abord, configurez votre mode de versement souhaité sur votre profil Airbnb. L...",
        },
        {
          title: "Ajoutez un mode de versement",
          description:
            "Vous pouvez ajouter ou modifier des modes de versement dans les paramètres de votre...",
        },
        {
          title:
            "Assurance responsabilité civile expériences et services",
          description:
            "L'Assurance responsabilité civile expriences et services est un élément clé d'AirCover pou...",
        },
      ],
      learnMoreImages: [
        "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWkxfGVufDF8fHx8MTc2ODg2ODU0MHww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1728413704912-55beeee843ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoaWtpbmclMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3Njg5MjQ1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
    "hote-services": {
      showRecommended: false,
      guideTitle: "Guides pour les hôtes de services",
      guideCards: [
        {
          image:
            "https://images.unsplash.com/photo-1765020553734-2c050ddb9494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlJTIwcHJvdmlkZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4OTE2OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Premiers pas en tant qu'hôte de services",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1762994576926-b8268190a2c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwY2xhc3MlMjBpbnN0cnVjdG9yfGVufDF8fHx8MTc2ODkxNjg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Créer une offre de services attractive",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1641750875717-8c98badfd9a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleHBlcmllbmNlJTIwaG9zdCUyMG91dGRvb3J8ZW58MXx8fHwxNzY4OTE2ODk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Gérer vos prestations de services",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1758618131833-70f14f9e869a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGhpa2luZyUyMGd1aWRlfGVufDF8fHx8MTc2ODkxNjg5OXww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Tarification et disponibilités",
          isAirCover: false,
        },
      ],
      mainArticles: [
        {
          title: "Créer votre annonce de service",
          description:
            "Guide complet pour créer une annonce de service professionnelle et attractive.",
        },
        {
          title:
            "Conditions d'annulation relatives aux services",
          description:
            "Comprendre les politiques d'annulation spécifiques aux services sur HOMIQIO.",
        },
        {
          title: "Gérer les réservations de services",
          description:
            "Comment accepter, modifier ou annuler les réservations de services de manière efficace.",
        },
        {
          title: "Modes de versement pour les services",
          description:
            "Découvrez comment configurer et gérer vos modes de paiement pour les services.",
        },
        {
          title:
            "Assurance et protection pour les hôtes de services",
          description:
            "Les garanties et protections offertes aux hôtes proposant des services.",
        },
        {
          title: "Optimiser votre annonce de service",
          description:
            "Conseils pour améliorer la visibilité et l'attractivité de vos services.",
        },
      ],
      learnMoreImages: [
        "https://images.unsplash.com/photo-1745847768380-2caeadbb3b71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBhcnRuZXJzaGlwJTIwaGFuZHNoYWkxfGVufDF8fHx8MTc2ODg2ODU0MHww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1728413704912-55beeee843ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjBoaWtpbmclMjBtb3VudGFpbiUyMGxhbmRzY2FwZXxlbnwxfHx8fDE3Njg5MjQ1MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
    "admin-voyages": {
      showRecommended: false,
      guideTitle: "Guides pour les administrateurs de voyages",
      guideCards: [
        {
          image:
            "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2ODkwMDIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Débuter en tant qu'administrateur de voyages",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1759706000998-b09cded2de5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0cmF2ZWwlMjBtYW5hZ2VyfGVufDF8fHx8MTc2ODkxNjkwMHww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Gérer les voyages d'affaires de votre équipe",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1765020553734-2c050ddb9494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZXJ2aWNlJTIwcHJvdmlkZXIlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4OTE2OTAwfDA&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Politiques de voyage et budgets",
          isAirCover: false,
        },
        {
          image:
            "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2ODkwMDIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
          title: "Rapports et analyses de voyages",
          isAirCover: false,
        },
      ],
      mainArticles: [
        {
          title:
            "Configurer un compte administrateur de voyages",
          description:
            "Comment créer et configurer un compte pour gérer les voyages professionnels de votre équipe.",
        },
        {
          title:
            "Ajouter et gérer les voyageurs de votre entreprise",
          description:
            "Invitez les membres de votre équipe et gérez leurs autorisations de voyage.",
        },
        {
          title:
            "Définir des politiques de voyage d'entreprise",
          description:
            "Établissez des règles et des budgets pour les réservations professionnelles.",
        },
        {
          title: "Consulter et approuver les réservations",
          description:
            "Suivez et validez les demandes de réservation de votre équipe en temps réel.",
        },
        {
          title: "Générer des rapports de dépenses",
          description:
            "Accédez à des rapports détaillés sur les dépenses de voyage de votre entreprise.",
        },
        {
          title: "Facturation et paiements centralisés",
          description:
            "Configurez une méthode de paiement centralisée pour toutes les réservations de l'équipe.",
        },
      ],
      learnMoreImages: [
        "https://images.unsplash.com/photo-1709715357520-5e1047a2b691?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMG1lZXRpbmclMjB0ZWFtfGVufDF8fHx8MTc2ODkwMDIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
        "https://images.unsplash.com/photo-1759706000998-b09cded2de5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjB0cmF2ZWwlMjBtYW5hZ2VyfGVufDF8fHx8MTc2ODkxNjkwMHww&ixlib=rb-4.1.0&q=80&w=1080",
      ],
    },
  };

  const recommendedCards = [
    {
      tag: "ACTION REQUISE",
      tagColor: "text-red-600",
      title:
        "La vérification de votre identité n'est pas terminée",
      description:
        "Cette procédure nous permet de confirmer votre identité. Elle sert à garantir la sécurité de la plate-forme Airbnb.",
      links: [
        {
          text: "Voir le statut de vérification de l'identité",
          icon: true,
        },
        { text: "En savoir plus", icon: true },
      ],
    },
    {
      tag: "LIEN RAPIDE",
      tagColor: "text-gray-600",
      title: "Retrouver les détails de la réservation",
      description:
        "L'onglet Voyages contient tous les détails, dont les dates et coordonnées de l'hôte pour chacune de vos réservations.",
      links: [{ text: "Acceder à Voyages", icon: true }],
    },
  ];

  const currentContent = tabContent[activeTab];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-20 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("logements")}
              className="flex items-center gap-1 hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-8 h-8"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z"
                  fill="#10B981"
                />
              </svg>
              <span className="text-base font-medium ml-1">
                Centre d'aide
              </span>
            </button>
          </div>

          {/* Right Menu */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12 sm:py-16">
        <div className="px-4 sm:px-6 lg:px-20 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-center mb-8">
            Bonjour Ramaroson, comment pouvons-nous vous aider ?
          </h1>

          {/* Search Bar */}
          <div className="relative max-w-[25rem] mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                setShowSearchSuggestions(true);
                setIsSearchFocused(true);
              }}
              onBlur={() =>
                setTimeout(() => {
                  setShowSearchSuggestions(false);
                  setIsSearchFocused(false);
                }, 200)
              }
              placeholder="Rechercher des guides pratiques et plus"
              className={`w-full pl-6 py-4 rounded-full placeholder:text-[#222222] border border-gray-300 focus:outline-none focus:border-gray-400 text-base shadow-lg transition-all ${
                isSearchFocused ? "pr-44" : "pr-16"
              }`}
            />
            <button
              className={`absolute right-2 top-1/2 -translate-y-1/2 py-2.5 bg-[#10B981] flex items-center hover:bg-[#059669] transition-all ${
                isSearchFocused
                  ? "px-6 gap-2 rounded-full"
                  : "px-3 rounded-full"
              }`}
            >
              <Search className="w-5 h-5 text-white" />
              {isSearchFocused && (
                <span className="text-white font-medium">
                  Recherche
                </span>
              )}
            </button>

            {/* Search Suggestions Dropdown */}
            {showSearchSuggestions && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-gray-200 py-4 z-10">
                <div className="px-6 pb-3">
                  <h3 className="text-base font-medium">
                    Articles principaux
                  </h3>
                </div>
                <div className="space-y-1">
                  <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm">
                      Annuler votre réservation de logement en
                      tant que voyageur
                    </span>
                  </button>
                  <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm">
                      Modifier la date ou l'heure de votre
                      réservation de service ou d'expérience
                    </span>
                  </button>
                  <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left">
                    <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="text-sm">
                      Si votre hôte annule votre réservation de
                      logement
                    </span>
                  </button>
                </div>
                <div className="px-6 pt-4 pb-2">
                  <p className="text-sm text-gray-600">
                    L'onglet Voyages contient tous les détails,
                    dont les dates
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="border-b border-gray-200 bg-white">
        <div className="px-4 sm:px-6 lg:px-20">
          <div className="flex gap-6 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-gray-900 font-medium"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Section (Only for Voyageur) */}
      {currentContent.showRecommended && (
        <section className="bg-white py-12">
          <div className="px-4 sm:px-6 lg:px-20">
            <h2 className="text-2xl font-medium mb-6">
              Recommandé pour vous
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
              {recommendedCards.map((card, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col"
                >
                  <div
                    className={`text-xs font-medium mb-3 ${card.tagColor}`}
                  >
                    {card.tag}
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {card.description}
                  </p>
                  <div className="space-y-3 mt-auto">
                    {card.links.map((link, linkIndex) => (
                      <button
                        key={linkIndex}
                        className="flex items-center justify-between w-full text-sm hover:bg-gray-50 py-2 rounded transition-colors"
                      >
                        <span>{link.text}</span>
                        {link.icon && (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Guides Section */}
      <section className="bg-white py-12">
        <div className="px-4 sm:px-6 lg:px-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-medium">
              {currentContent.guideTitle}
            </h2>
            <button className="flex items-center gap-2 text-sm font-medium hover:underline">
              Parcourir tous les sujets
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentContent.guideCards.map((card, index) => (
              <button
                key={index}
                className="group text-left flex flex-col"
              >
                <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3 flex-shrink-0">
                  {card.isAirCover ? (
                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl font-bold text-white">
                          air
                        </span>
                        <span className="text-4xl font-bold text-pink-500">
                          cover
                        </span>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <h3 className="text-sm font-medium leading-tight group-hover:underline">
                  {card.title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Articles Section */}
      <section className="bg-white py-12">
        <div className="px-4 sm:px-6 lg:px-20">
          <h2 className="text-2xl font-medium mb-6">
            Articles principaux
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 max-w-5xl">
            {currentContent.mainArticles.map(
              (article, index) => (
                <div
                  key={index}
                  className="group cursor-pointer"
                >
                  <h3 className="text-base font-medium mb-2 underline underline-offset-2 group-hover:text-gray-700">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Learn More Section */}
      <section className="bg-white py-12">
        <div className="px-4 sm:px-6 lg:px-20">
          <h2 className="text-2xl font-medium mb-8">
            En savoir plus
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl items-start">
            {/* First Image with Caption */}
            {/* Carte 1 */}
            <div className="flex flex-col rounded-2xl overflow-hidden bg-[#222222] cursor-pointer">
              {/* Conteneur Image avec ratio fixe */}
              <div className="aspect-[4/3] w-full">
                <img
                  src={currentContent.learnMoreImages[0]}
                  alt="Les politiques"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Zone de texte sous l'image */}
              <div className="p-4 flex-grow">
                <h3 className="text-white text-sm font-semibold">
                  Les politiques de la communauté
                </h3>
                <p className="text-white text-sm leading-snug">
                  Nos actions pour établir un climat de
                  confiance.
                </p>
              </div>
            </div>

            {/* Second Image with Caption */}
            <div className="flex flex-col rounded-2xl overflow-hidden bg-[#222222] cursor-pointer">
              <div className="aspect-[4/3] w-full">
                <img
                  src={currentContent.learnMoreImages[1]}
                  alt="Ressources"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 flex-grow">
                <h3 className="text-white text-sm font-semibold">
                  Ressources et inspiration pour les hôtes
                </h3>
                <p className="text-white text-sm leading-snug">
                  Découvrir des astuces, des conseils pratiques
                  et les dernières actualités.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col">
              <h3 className="text-xl font-medium mb-4">
                Besoin de nous joindre ?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Commençons par quelques questions afin de mieux
                vous orienter.
              </p>
              <button className="px-6 py-3 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors mb-4 w-fit">
                Contactez-nous
              </button>
              <p className="text-sm text-gray-600">
                Vous pouvez également nous{" "}
                <button className="underline hover:text-gray-900">
                  envoyer vos remarques
                </button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}