import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Globe,
  Menu,
  User,
  ChevronUp,
  Copy,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";

interface AirCoverProps {
  onNavigate: (page: string) => void;
}

export function AirCover({ onNavigate }: AirCoverProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] =
    useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-20 h-16 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("help-center")}
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

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
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
                        <Search className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-sm">
                        Annuler votre réservation de logement en
                        tant que voyageur
                      </span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-sm">
                        Modifier la date ou l'heure de votre
                        réservation de service ou d'expérience
                      </span>
                    </button>
                    <button className="w-full flex items-center gap-4 px-6 py-3 hover:bg-gray-50 transition-colors text-left">
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Search className="w-5 h-5 text-gray-600" />
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

      {/* Main Content */}
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="px-4 sm:px-6 lg:px-20 py-6 border-b border-gray-200">
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              onClick={() => onNavigate("help-center")}
              className="hover:underline text-xs"
            >
              Accueil
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button className="hover:underline text-xs">
              All topics
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button className="hover:underline text-xs">
              Rechercher et réserver
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button className="hover:underline text-xs">
              Réserver des logements
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <button className="hover:underline text-xs">
              Informations de base sur les réservations
            </button>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="font-medium text-xs">
              AirCover pour les voyageurs
            </span>
          </div>
        </div>

        {/* Content Container */}
        <div className="px-4 sm:px-6 lg:px-20 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content - Left Side (2 columns) */}
              <div className="lg:col-span-2">
                {/* Header */}
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    Guide • Voyageur
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-medium mb-4">
                    AirCover pour les voyageurs
                  </h1>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors mb-4">
                    Afficher le texte d'origine (en anglais)
                    <Copy className="w-4 h-4" />
                  </button>
                  <p className="text-sm text-gray-600 italic">
                    Cet article a été traduit automatiquement.
                  </p>
                </div>

                {/* AirCover Logo */}
                <div className="bg-[#222222] p-12 mb-8 flex items-center justify-center h-[20rem]">
                  <div className="text-center">
                    <div className="text-6xl sm:text-7xl font-bold tracking-tight">
                      <span className="text-pink-500">air</span>
                      <span className="text-white">cover</span>
                    </div>
                  </div>
                </div>

                {/* Main Text Content */}
                <div className="prose prose-sm max-w-none">
                  <p className="text-base leading-relaxed mb-6">
                    Chaque réservation de logement est couverte
                    par AirCover pour les voyageurs. En cas de
                    problème grave avec votre logement Airbnb
                    que votre hôte ne peut pas résoudre, nous
                    sommes là pour vous aider.
                  </p>

                  <h2 className="text-xl font-medium mt-8 mb-4">
                    Nous vous aiderons à effectuer une nouvelle
                    réservation ou à obtenir un remboursement
                    intégral ou partiel
                  </h2>

                  <p className="text-base leading-relaxed mb-4">
                    Voici où nous pouvons vous aider :
                  </p>

                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>
                      Si{" "}
                      <button className="underline hover:text-gray-700">
                        l'hôte de votre logement annule avant
                        l'arrivée
                      </button>
                    </li>
                    <li>
                      Si vous rencontrez un problème et{" "}
                      <button className="underline hover:text-gray-700">
                        que vous ne parvenez pas à contacter
                        votre hôte
                      </button>
                    </li>
                    <li>
                      Si le logement est{" "}
                      <button className="underline hover:text-gray-700">
                        très différent
                      </button>{" "}
                      de l'annonce et que l'hôte ne peut pas
                      résoudre le problème
                    </li>
                  </ul>

                  <p className="text-base leading-relaxed mb-6">
                    Notre équipe peut vous aider à trouver un
                    logement similaire, en tenant compte de
                    l'emplacement et des équipements, en
                    fonction des disponibilités à un prix
                    comparable. Si un logement similaire n'est
                    pas disponible ou si vous préférez ne pas
                    effectuer de nouvelle réservation, vous
                    recevrez un remboursement complet ou
                    partiel, frais de service inclus.
                  </p>

                  <h2 className="text-xl font-medium mt-8 mb-4">
                    Fonctionnement d'AirCover pour les voyageurs
                  </h2>

                  <p className="text-base leading-relaxed mb-4">
                    AirCover pour les voyageurs fournit une
                    assistance pour les problèmes graves liés à
                    la réservation de votre logement, par
                    exemple :
                  </p>

                  <ul className="list-disc pl-6 space-y-2 mb-6">
                    <li>
                      L'hôte annule votre réservation avant
                      l'arrivée
                    </li>
                    <li>
                      Le chauffage ne fonctionne pas en hiver
                    </li>
                    <li>
                      Le logement a moins de chambres que ce qui
                      est indiqué
                    </li>
                    <li>
                      Il s'agit d'un autre type de logement :
                      une chambre privée au lieu d'un logement
                      entier
                    </li>
                    <li>
                      Il manque un équipement important, tel
                      qu'une piscine ou une{" "}
                      <button className="underline hover:text-gray-700">
                        cuisine
                      </button>
                    </li>
                  </ul>

                  <p className="text-base leading-relaxed mb-6">
                    AirCover pour les voyageurs n'inclut pas les
                    petits désagréments, comme un grille-pain
                    cassé.
                  </p>

                  <h2 className="text-xl font-medium mt-8 mb-4">
                    Résolution des problèmes pendant votre
                    séjour
                  </h2>

                  <p className="text-base leading-relaxed mb-4">
                    En cas de problème, n'hésitez pas à
                    contacter votre hôte, c'est la personne la
                    mieux placée pour vous aider. Vous pouvez
                    par exemple{" "}
                    <button className="underline hover:text-gray-700">
                      envoyer un message à votre hôte
                    </button>{" "}
                    directement pour l'informer de la situation.
                    Si un problème survient pendant votre séjour
                    :
                  </p>

                  <ol className="list-decimal pl-6 space-y-3 mb-6">
                    <li>
                      <strong>Documentez le problème</strong> :
                      prenez des photos ou des vidéos comme
                      preuve.
                    </li>
                    <li>
                      <strong>Contactez votre hôte</strong> :
                      informez votre hôte dans les 72 heures
                      suivant la découverte du problème,
                      décrivez-le et demandez une solution.
                    </li>
                    <li>
                      <strong>Contactez-nous</strong> : si votre
                      hôte ne répond pas ou n'est pas en mesure
                      de résoudre le problème,{" "}
                      <button className="underline hover:text-gray-700">
                        contactez-nous
                      </button>{" "}
                      immédiatement.
                    </li>
                    <li>
                      <strong>
                        Assistance AirCover pour les voyageurs
                      </strong>{" "}
                      : si le problème est couvert par AirCover
                      pour les voyageurs et que vous souhaitez
                      partir, nous vous aiderons à trouver un
                      hébergement comparable en fonction des
                      disponibilités. Si aucun logement
                      similaire n'est disponible ou si vous
                      préférez ne pas effectuer de nouvelle
                      réservation, vous recevrez un
                      remboursement intégral ou partiel.
                    </li>
                  </ol>

                  {/* Assistance sécurité 24h/24 Section */}
                  <div className="mt-8 mb-6">
                    <h2 className="text-xl font-medium mb-4">
                      Assistance sécurité 24h/24
                    </h2>

                    <p className="text-base leading-relaxed mb-4">
                      Besoin de nous joindre ? Contactez-nous
                      par téléphone, e-mail ou chat.
                    </p>

                    <p className="text-base leading-relaxed mb-6">
                      Si vous ne vous sentez pas en sécurité,
                      vous bénéficiez d'un accès prioritaire à
                      des agents spécialement formés à la
                      sécurité qui vous viendront en aide ou
                      vous mettront directement en contact avec
                      les services d'urgence locaux, de jour
                      comme de nuit.
                    </p>

                    {/* Info Box */}
                    <div className="border-2 border-gray-100 rounded-lg p-4 mb-6">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-orange-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="text-sm text-start leading-relaxed">
                          <p>
                            AirCover pour les voyageurs n'est
                            pas une police d'assurance. Il ne
                            couvre pas les dommages corporels,
                            la perte ou le vol de biens
                            personnels (y compris à l'intérieur
                            du logement ou pendant que vos
                            bagages sont endommagés par votre
                            transporteur). En savoir plus sur
                            <button className="underline hover:text-gray-900 ml-1">
                              « AirCover pour les voyageurs et
                              l'assurance voyage, réservation ou
                              protection séjour »
                            </button>
                            .
                          </p>
                        </div>
                      </div>
                    </div>

                    <p className="text-base leading-relaxed mb-4">
                      Si vous êtes hôte, en savoir plus sur{" "}
                      <button className="underline hover:text-gray-900">
                        « AirCover pour les hôtes »
                      </button>{" "}
                      et{" "}
                      <button className="underline hover:text-gray-900">
                        « améliorations que nous avons apportées
                        »
                      </button>
                      .
                    </p>

                    {/* Feedback Section */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-base mb-3">
                        Cet article vous a-t-il été utile ?
                      </p>
                      <div className="flex gap-4">
                        <button className="px-4 py-2 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Oui
                        </button>
                        <button className="px-4 py-2 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Non
                        </button>
                      </div>
                    </div>
                    {/* Related Topics Section */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                      <h2 className="text-xl font-medium mb-6">
                        Sur le même sujet
                      </h2>

                      <div className="space-y-6">
                        {/* Article 1 */}
                        <div className="pb-6 border-b border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">
                            Politique relative à la communauté
                            Airbnb
                          </p>
                          <h3 className="text-base font-medium mb-2">
                            <button className="underline hover:text-gray-700 text-left">
                              Règles de base pour les hôtes
                              proposant un logement
                            </button>
                          </h3>
                          <p className="text-sm text-gray-600">
                            Veuillez consulter nos règles de
                            base pour les hôtes proposant un
                            logement.
                          </p>
                        </div>

                        {/* Article 2 */}
                        <div className="pb-6 border-b border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">
                            Guide pratique • Voyageur
                          </p>
                          <h3 className="text-base font-medium mb-2">
                            <button className="underline hover:text-gray-700 text-left">
                              Délais de remboursement
                            </button>
                          </h3>
                          <p className="text-sm text-gray-600">
                            Bien qu'ils soient émis presque
                            immédiatement, la plupart des
                            remboursements sont crédités dans
                            les 15 jours. Toutefois, la
                            procédure peut prendre plus de temps
                            selon le mode de paiement...
                          </p>
                        </div>

                        {/* Article 3 */}
                        <div className="pb-6 border-b border-gray-200">
                          <p className="text-sm text-gray-600 mb-2">
                            Guide pratique • Voyageur
                          </p>
                          <h3 className="text-base font-medium mb-2">
                            <button className="underline hover:text-gray-700 text-left">
                              Si vous rencontrez un problème
                              pendant votre réservation
                            </button>
                          </h3>
                          <p className="text-sm text-gray-600">
                            En cas d'imprévu au cours du séjour,
                            commencez par envoyer un message à
                            l'hôte. Il est probable qu'il vous
                            aide à trouver une solution. Si
                            votre hôte ne peut pas vous aider ou
                            si vous souhaitez...
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar - Right Side (1 column) */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  {/* Contact Section */}
                  <div className="p-6 mb-6">
                    <h3 className="text-lg font-medium mb-3">
                      Besoin de nous joindre ?
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Commençons par quelques questions afin de
                      mieux vous orienter.
                    </p>
                    <button className="w-full px-6 py-3 border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors mb-4">
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
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 px-5 py-3 bg-black text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all z-50 flex items-center gap-2 text-sm font-medium"
        >
          <ChevronUp className="w-4 h-4" />
          Retour en haut de la page
        </button>
      )}
    </div>
  );
}