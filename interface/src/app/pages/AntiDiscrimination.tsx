import { Zap, Calendar, Star } from "lucide-react";
import { Footer } from "@/app/components/Footer";
// import illustrationImage from "figma:asset/cac968ab248dcb51e8ea99cfdb7381a1dace6b39.png";
const illustrationImage = "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.1.0&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max";

interface AntiDiscriminationProps {
  onNavigate: (page: string) => void;
}

export function AntiDiscrimination({ onNavigate }: AntiDiscriminationProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-20 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onNavigate("logements")}
            className="flex items-center"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 1.5C16 1.5 4 9 4 18C4 23.5 9.5 28 16 28C22.5 28 28 23.5 28 18C28 9 16 1.5 16 1.5Z"
                fill="#10B981"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-20 py-8 sm:py-10 lg:py-12">
          <div className="max-w-lg mx-auto text-center">
            <p className="text-sm sm:text-base mb-4 sm:mb-5">Rapport 2024</p>
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl mb-10 sm:mb-12 lg:mb-14"
              style={{ fontWeight: 600 }}
            >
              Lutte contre la discrimination
              <br />
              et facilitation des voyages
              <br />
              pour tous
            </h1>
          </div>
        </div>

        {/* Project Lighthouse Section */}
        <div className="px-4 sm:px-6 lg:px-20 pb-8 sm:pb-10">
          <div className="max-w-lg mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Lighthouse beam */}
                  <path d="M16 4L10 12h12L16 4z" fill="none" />
                  {/* Lighthouse body */}
                  <path d="M12 12v16" />
                  <path d="M20 12v16" />
                  {/* Base */}
                  <path d="M8 28h16" />
                  {/* Light at top */}
                  <circle cx="16" cy="6" r="1.5" fill="currentColor" />
                  {/* Light rays */}
                  <path d="M16 6L14 4" opacity="0.5" />
                  <path d="M16 6L18 4" opacity="0.5" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2
              className="text-xl sm:text-2xl text-center mb-4"
              style={{ fontWeight: 600 }}
            >
              Project Lighthouse
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-center text-gray-700 leading-relaxed mb-2">
              Lancé en 2020, Project Lighthouse est un outil que nous utilisons
              aux États-Unis pour identifier et lutter contre les éventuelles
              inégalités vécues par les utilisateurs en raison de leur
              appartenance ethnique, réelle ou supposée, sur Homiqio. Nous avons
              mis sur pied Project Lighthouse en suivant les conseils d'un
              certain nombre d'associations majeures en matière de défense des
              droits civils et de la vie privée.{" "}
              <a href="#" className="underline">
                En savoir plus
              </a>
            </p>
          </div>
        </div>

        {/* Three Columns Section */}
        <div className="px-4 sm:px-6 lg:px-20 pb-10 sm:pb-12 lg:pb-14">
          <div className="max-w-lg mx-auto">
            <div className="space-y-8">
              {/* Column 1 */}
              <div>
                <h3
                  className="text-base sm:text-lg mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Utilisation de données réelles
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Nous étudions l'utilisation que les voyageurs et les hôtes
                  font de notre plateforme. Le recours aux analyses statistiques
                  nous éclaire sur les moyens de rendre Homiqio plus accessible
                  pour tous.
                </p>
              </div>

              {/* Column 2 */}
              <div>
                <h3
                  className="text-base sm:text-lg mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Protection de la vie privée
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Nous analysons les tendances dans leur ensemble et
                  n'associons pas les informations relatives à la perception
                  des origines à des personnes ou à des comptes spécifiques.
                </p>
              </div>

              {/* Column 3 */}
              <div>
                <h3
                  className="text-base sm:text-lg mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Amélioration constante
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Notre équipe continue d'identifier de nouveaux moyens
                  d'améliorer l'ouverture et l'équité sur Homiqio.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Nos efforts constants Section */}
        <div className="bg-white px-4 sm:px-6 lg:px-20 py-10 sm:py-12 lg:py-14">
          <div className="max-w-lg mx-auto">
            {/* Section Title */}
            <h2
              className="text-2xl sm:text-3xl text-center mb-10 sm:mb-12"
              style={{ fontWeight: 600 }}
            >
              Nos efforts constants
            </h2>

            {/* Features */}
            <div className="space-y-10 sm:space-y-12">
              {/* Feature 1 - Lightning */}
              <div>
                <div className="flex justify-center mb-4">
                  <Zap className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Accès à la réservation instantanée pour le plus grand nombre
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  La réservation instantanée favorise des réservations plus
                  objectives. Cette fonctionnalité permet aux voyageurs de
                  réserver un logement sans que les hôtes aient à approuver une
                  demande de réservation. Il s'agit d'un outil important pour
                  diminuer la discrimination potentielle durant le processus de
                  réservation. Récemment, nous avons redéfini ce que constitue
                  un historique positif sur Homiqio. Ces changements ont
                  contribué à augmenter le nombre de voyageurs qui tirent parti
                  de la réservation instantanée.
                </p>
              </div>

              {/* Feature 2 - Calendar */}
              <div>
                <div className="flex justify-center mb-4">
                  <Calendar className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Aider les hôtes à répondre aux demandes de réservation
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  Les nouvelles mesures prises pour aider les hôtes à répondre
                  aux demandes de réservation dans les meilleurs délais ont
                  également permis d'augmenter le taux de réservations
                  acceptées. Ces modifications consistent notamment à accroître
                  la visibilité des demandes de réservation en attente pour les
                  hôtes. Le nombre de demandes de réservation restées sans
                  réponse a ainsi diminué, ce qui a permis d'augmenter le
                  nombre de voyageurs ayant réservé un hébergement avec succès.
                </p>
              </div>

              {/* Feature 3 - Star */}
              <div>
                <div className="flex justify-center mb-4">
                  <Star className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Permettre aux voyageurs de se créer une bonne réputation
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  En 2022, nous avons donné aux voyageurs la possibilité de se
                  démarquer grâce à notre fonctionnalité de badge de profil de
                  voyageur, qui leur permet d'afficher des informations de
                  vérification supplémentaires sur leur profil. Les personnes
                  qui voyagent régulièrement et qui comptent au moins trois
                  séjours dans leur historique peuvent maintenant afficher un
                   badge « Voyageur expérimenté » sur leur profil, ce qui peut
                   les aider à réserver leur prochain séjour.
                </p>
              </div>

              {/* Feature 4 - Link/Chain */}
              <div>
                <div className="flex justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8 L8 12 L12 16" />
                    <path d="M20 16 L24 12 L20 8" />
                    <circle cx="10" cy="12" r="3" fill="none" />
                    <circle cx="22" cy="12" r="3" fill="none" />
                    <path d="M13 12 L19 12" />
                  </svg>
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Accompagner les hôtes et les voyageurs tout au long du séjour
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  Nous avons lancé une nouvelle fonctionnalité permettant aux
                  hôtes et aux voyageurs d'afficher leur nom d'usage sur leur profil,
                  après avoir confirmé leur nom officiel. Nous améliorons également
                  le processus pour les hôtes ou les voyageurs qui signalent avoir
                  été identifiés par des pronoms incorrects dans un commentaire. Si
                  un hôte ou un voyageur exprime cette préoccupation, le pronom
                  est remplacé par son nom d'usage.
                </p>
              </div>

              {/* Feature 5 - Shield */}
              <div>
                <div className="flex justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 4 L6 8 L6 16 C6 22 16 28 16 28 C16 28 26 22 26 16 L26 8 L16 4Z" />
                  </svg>
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Renforcement de nos politiques et procédures
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  Nous avons amélioré le processus de refus des demandes de
                  réservation par les hôtes afin de les informer des raisons valides
                  ou non de refuser une demande. Nous avons également mis à jour
                  notre Politique de non-discrimination pour la rendre plus efficace
                  et avons intégré de nouvelles protections contre la discrimination
                  fondée sur la caste. Enfin, nous apportons une série de
                  modifications pour améliorer l'équité lorsqu'un hôte annule une
                  réservation existante.
                </p>
              </div>

              {/* Feature 6 - Wallet */}
              <div>
                <div className="flex justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="4" y="8" width="24" height="16" rx="2" />
                    <path d="M4 12h24" />
                    <rect x="20" y="15" width="4" height="3" rx="1" />
                  </svg>
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Diffusion plus large des opportunités d'autonomie financière disponibles sur Homiqio
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  Nous développons l'Homiqio Entrepreneurship Academy, qui
                  permet à des personnes issues de communautés diverses et
                  historiquement sous-représentées d'accueillir des voyageurs sur
                  notre plateforme en partenariat avec des associations telles que
                  Hispanic Wealth Project, Brotherhood Crusade et United Spiral
                  Association. Nous continuons également à participer à l'initiative
                  1 Million Black Businesses (1MBB) d'Operation HOPE, qui fournit un
                  soutien et un accompagnement aux entrepreneurs noirs pour
                  démarrer, développer ou faire évoluer leurs entreprises.
                </p>
              </div>

              {/* Feature 7 - Accessibility */}
              <div>
                <div className="flex justify-center mb-4">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="16" cy="8" r="2" fill="currentColor" />
                    <path d="M16 12 C12 12 10 14 10 16 L10 20 L12 20 L12 28 L14 28 L14 20 L18 20 L18 28 L20 28 L20 20 L22 20 L22 16 C22 14 20 12 16 12Z" />
                    <circle cx="16" cy="16" r="12" fill="none" />
                  </svg>
                </div>
                <h3
                  className="text-base sm:text-lg text-center mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Poursuite de notre engagement envers les voyageurs à mobilité réduite
                </h3>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-center">
                  Nos filtres de recherche d'éléments d'accessibilité permettent
                  aux voyageurs de trouver et de réserver plus facilement des
                  logements qui répondent à leurs besoins. Dans le cadre d'un
                   contrôle dédié, nous vérifions tous les éléments d'accessibilité
                   soumis par les hôtes pour une précision optimale.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notre engagement Section */}
        <div className="px-4 sm:px-6 lg:px-20 py-10 sm:py-12 lg:py-14">
          <div className="max-w-lg mx-auto">
            {/* Section Title */}
            <h2
              className="text-2xl sm:text-3xl text-center mb-4"
              style={{ fontWeight: 600 }}
            >
              Notre engagement pour la lutte contre les discriminations
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-center text-gray-700 leading-relaxed mb-8">
              Ce travail s'inscrit dans une longue tradition de lutte
              contre la discrimination, avec notamment l'un des
              premiers audits sur les droits civils en 2016, une
              modification supplémentaire en{" "}
              <span 
                className="px-2 py-1 underline" 
                style={{ fontWeight: 600 }}
              >
                2019
              </span>, l'annonce de
              Project Lighthouse en 2020 et une première publication
              des données du projet en{" "}
              <span 
                className="px-2 py-1 underline" 
                style={{ fontWeight: 600 }}
              >
                2022
              </span>. Ces modifications
              portaient sur plusieurs initiatives et mouvements en
              constante évolution visant à aider tous les utilisateurs à
              trouver le succès sur Homiqio.
            </p>

            {/* Illustration */}
            <div className="flex justify-center">
              <img
                src={illustrationImage}
                alt="Illustration de diversité"
                className="w-full max-w-md rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* L'engagement de la communauté Homiqio Section */}
        <div className="px-4 sm:px-6 lg:px-20 py-10 sm:py-12 lg:py-14 border-t border-gray-200">
          <div className="max-w-lg mx-auto">
            {/* Section Title */}
            <h2
              className="text-2xl sm:text-3xl text-center mb-5"
              style={{ fontWeight: 600 }}
            >
              L'engagement de la communauté Homiqio
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-center text-gray-700 leading-relaxed mb-6">
              Depuis 2016, nous demandons à tous les utilisateurs de
              notre plateforme de traiter les autres avec respect et
              sans préjugés en acceptant l'
              <a href="#" className="underline" style={{ fontWeight: 600 }}>
                engagement de la communauté Homiqio
              </a>
              . Toute personne qui refuse d'y
              adhérer se voit refuser l'accès à la plateforme ou en est
              retirée.
            </p>

            {/* Engagement Box */}
            <div className="bg-gray-50 rounded-2xl p-8 sm:p-10 lg:p-12">
              <p
                className="text-base sm:text-lg text-center leading-relaxed"
                style={{ fontWeight: 600 }}
              >
                Je m'engage à traiter avec respect et sans
                préjugés chacun des membres de la
                communauté, quels que soient sa couleur de
                peau, sa religion, sa nationalité, son origine,
                son handicap, son sexe, son identité de
                genre, son orientation sexuelle ou son âge.
              </p>
            </div>
          </div>
        </div>

        {/* Découvrez le rapport 2024 Section */}
        <div className="px-4 sm:px-6 lg:px-20 py-10 sm:py-12 lg:py-14 border-t border-gray-200">
          <div className="max-w-lg mx-auto">
            {/* Section Title */}
            <h2
              className="text-2xl sm:text-3xl text-center mb-4"
              style={{ fontWeight: 600 }}
            >
              Découvrez le rapport 2024
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-center text-gray-700 leading-relaxed mb-6">
              <span className="italic">Project Lighthouse 2024</span> présente les principales
              conclusions de l'initiative Project Lighthouse, l'ensemble
              de nos données et les progrès que nous avons réalisés
              depuis 2016.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center mb-6">
              <button
                className="px-8 py-3 rounded-lg text-white transition-all hover:opacity-90"
                style={{ 
                  backgroundColor: '#10B981',
                  fontWeight: 600 
                }}
              >
                Afficher le rapport
              </button>
            </div>

            {/* Bottom Text */}
            <p className="text-sm sm:text-base text-center text-gray-700 leading-relaxed">
              Ce rapport fait suite aux présentations de nos travaux
              publiés en{" "}
              <a href="#" className="underline" style={{ fontWeight: 600 }}>
                2016
              </a>
              ,{" "}
              <a href="#" className="underline" style={{ fontWeight: 600 }}>
                2019
              </a>
              {" "}et{" "}
              <a href="#" className="underline" style={{ fontWeight: 600 }}>
                2022
              </a>
              .
            </p>
          </div>
        </div>

        {/* Rencontrez nos partenaires Section */}
        <div className="px-4 sm:px-6 lg:px-20 py-10 sm:py-12 lg:py-14 border-t border-gray-200">
          <div className="max-w-lg mx-auto">
            {/* Section Title */}
            <h2
              className="text-2xl sm:text-3xl text-center mb-4"
              style={{ fontWeight: 600 }}
            >
              Rencontrez nos partenaires
            </h2>

            {/* Description */}
            <p className="text-sm sm:text-base text-center text-gray-700 leading-relaxed mb-8">
              Nous nous entretenons et collaborons avec des groupes
              et associations majeurs en matière de défense des droits
              civils et de la vie privée, dont les partenaires qui nous ont
              conseillés sur Project Lighthouse.
            </p>

            {/* Partner Logos */}
            <div className="space-y-8">
              {/* Row 1 - 4 logos */}
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12">
                {/* Advancing Justice */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
                    <path d="M10 15 L15 10 L20 15 L20 25 L10 25 Z" fill="#FF6B35" />
                    <text x="25" y="18" fontSize="8" fontWeight="600" fill="#1F2937">ADVANCING</text>
                    <text x="25" y="26" fontSize="8" fontWeight="600" fill="#1F2937">JUSTICE</text>
                    <text x="25" y="32" fontSize="6" fill="#6B7280">LAW</text>
                  </svg>
                </div>

                {/* CDT */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="140" height="48" viewBox="0 0 140 48" fill="none">
                    <text x="5" y="22" fontSize="20" fontWeight="700" fill="#4A5568">cdt</text>
                    <text x="5" y="32" fontSize="7" fill="#718096">CENTER FOR DEMOCRACY</text>
                    <text x="5" y="40" fontSize="7" fill="#718096">&amp; TECHNOLOGY</text>
                  </svg>
                </div>

                {/* Color of Change */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="110" height="48" viewBox="0 0 110 48" fill="none">
                    <text x="5" y="14" fontSize="11" fontWeight="700" fill="#000" style={{ fontStyle: 'italic' }}>COLOR</text>
                    <text x="5" y="26" fontSize="11" fontWeight="700" fill="#000" style={{ fontStyle: 'italic' }}>Of</text>
                    <text x="5" y="38" fontSize="11" fontWeight="700" fill="#000" style={{ fontStyle: 'italic' }}>Change</text>
                    <rect x="52" y="8" width="3" height="30" fill="#FFD700" />
                    <rect x="57" y="8" width="3" height="30" fill="#FF0000" />
                  </svg>
                </div>

                {/* Leadership Conference */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="140" height="48" viewBox="0 0 140 48" fill="none">
                    <circle cx="12" cy="12" r="3" fill="#E53E3E" />
                    <circle cx="20" cy="12" r="3" fill="#E53E3E" />
                    <circle cx="28" cy="12" r="3" fill="#E53E3E" />
                    <text x="5" y="26" fontSize="7" fontWeight="600" fill="#E53E3E">The Leadership Conference</text>
                    <text x="5" y="34" fontSize="7" fontWeight="600" fill="#E53E3E">on Civil and Human Rights</text>
                  </svg>
                </div>
              </div>

              {/* Row 2 - 3 logos centered */}
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
                {/* LCCR (Shield with flag) */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="90" height="48" viewBox="0 0 90 48" fill="none">
                    {/* Shield outline */}
                    <path d="M45 8 L25 14 L25 26 C25 32 45 38 45 38 C45 38 65 32 65 26 L65 14 L45 8Z" fill="none" stroke="#1E3A8A" strokeWidth="1.5" />
                    {/* Flag stripes (simplified) */}
                    <rect x="30" y="18" width="30" height="2" fill="#DC2626" />
                    <rect x="30" y="22" width="30" height="2" fill="#DC2626" />
                    <rect x="30" y="26" width="30" height="2" fill="#DC2626" />
                    {/* Blue canton */}
                    <rect x="30" y="18" width="12" height="10" fill="#1E3A8A" />
                  </svg>
                </div>

                {/* NAACP */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="130" height="48" viewBox="0 0 130 48" fill="none">
                    <text x="5" y="28" fontSize="22" fontWeight="700" fill="#000">NAACP</text>
                  </svg>
                </div>

                {/* NAN (National Action Network) */}
                <div className="flex items-center justify-center grayscale hover:grayscale-0 transition-all h-12">
                  <svg width="90" height="48" viewBox="0 0 90 48" fill="none">
                    <circle cx="45" cy="24" r="20" fill="#FFF" stroke="#047857" strokeWidth="3" />
                    <text x="32" y="30" fontSize="16" fontWeight="700" fill="#047857">NAN</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}