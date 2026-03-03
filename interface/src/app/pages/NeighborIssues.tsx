import { useState, useEffect } from "react";
import {
  Search,
  ChevronRight,
  Globe,
  Menu,
  ChevronUp,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";

interface NeighborIssuesProps {
  onNavigate: (page: string) => void;
}

export function NeighborIssues({ onNavigate }: NeighborIssuesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
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
    return () => window.removeEventListener("scroll", handleScroll);
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

          {/* Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
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
                placeholder="Rechercher des guides pratiques"
                className="w-full pl-6 pr-14 py-3.5 rounded-full placeholder:text-[#222222] border-2 border-gray-900 focus:outline-none text-base transition-all"
              />
              <button
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-[#10B981] hover:bg-[#059669] transition-all flex items-center justify-center gap-2 ${
                  isSearchFocused
                    ? "rounded-full px-4 h-10"
                    : "rounded-full w-10 h-10"
                }`}
              >
                <Search className="w-5 h-5 text-white flex-shrink-0" />
                {isSearchFocused && (
                  <span className="text-white font-semibold text-sm whitespace-nowrap">
                    Rechercher
                  </span>
                )}
              </button>

              {/* Search Suggestions Dropdown */}
              {showSearchSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 z-50">
                  <h3 className="text-base font-semibold mb-4">
                    Articles principaux
                  </h3>
                  <div className="space-y-1">
                    <button className="w-full flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          Annuler votre réservation de logement en tant que voyageur
                        </p>
                      </div>
                    </button>
                    <button className="w-full flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          Modifier la date ou l'heure de votre réservation de service ou d'expérience
                        </p>
                      </div>
                    </button>
                    <button className="w-full flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 leading-snug">
                          Si votre hôte annule votre réservation de logement
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Globe className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-20 py-6 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button
            onClick={() => onNavigate("logements")}
            className="hover:underline text-xs"
          >
            Accueil
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="hover:underline text-xs">All topics</button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="hover:underline text-xs">
            Sécurité et accessibilité
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <button className="hover:underline text-xs">
            Signaler un problème
          </button>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600 text-xs">
            Service d'aide aux voisins
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Content */}
            <div className="lg:col-span-8">
              {/* Category Badge */}
              <p className="text-sm text-gray-600 mb-3">Guide pratique</p>

              {/* Main Title */}
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl mb-8"
                style={{ fontWeight: 600 }}
              >
                Service d'aide aux voisins
              </h1>

              {/* Introduction */}
              <div className="space-y-4 text-gray-700 leading-relaxed mb-8">
                <p>
                  Vous pouvez signaler une{" "}
                  <a href="#" className="underline font-semibold text-gray-900">
                    fête
                  </a>
                  , des{" "}
                  <a href="#" className="underline font-semibold text-gray-900">
                    nuisances sonores
                  </a>{" "}
                  ou un{" "}
                  <a href="#" className="underline font-semibold text-gray-900">
                    problème de voisinage
                  </a>{" "}
                  ici.
                </p>
                <p>
                  Pour obtenir de l'aide au sujet d'une réservation, de l'accueil de voyageurs ou de votre compte,{" "}
                  <a href="#" className="underline font-semibold text-gray-900">
                    contactez l'assistance HOMIQIO
                  </a>
                  . Notre service d'aide aux voisins est uniquement disponible pour vous aider à résoudre les problèmes liés au partage de logement au sein de votre quartier.
                </p>
              </div>

              {/* Emergency Alert Box */}
              <div className="border border-gray-300 rounded-lg p-6 mb-12">
                <div className="flex gap-3">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                      fill="#F97316"
                      stroke="#F97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 2V8H20"
                      fill="white"
                      stroke="#F97316"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      En cas d'urgence :
                    </span>
                    <span className="text-sm text-gray-900">
                      {" "}si vous ne vous sentez pas en sécurité ou craignez pour votre bien-être ou celui de quelqu'un d'autre, contactez immédiatement les services d'urgence locaux.
                    </span>
                  </div>
                </div>
              </div>

              {/* Urgent Issues Section */}
              <section className="mb-12">
                <h2
                  className="text-2xl sm:text-3xl mb-6"
                  style={{ fontWeight: 600 }}
                >
                  Problèmes de voisinage urgents
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Contactez le service d'aide aux voisins en cas de fête ou de nuisances se produisant à proximité.
                </p>
                <button className="px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Demander à ce qu'on m'appelle
                </button>
              </section>

              {/* Other Issues Section */}
              <section className="mb-12 pb-12 border-b border-gray-200">
                <h2
                  className="text-2xl sm:text-3xl mb-6"
                  style={{ fontWeight: 600 }}
                >
                  Autres problèmes de voisinage
                </h2>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Envoyez-nous un message à l'aide du bouton ci-dessous. Notre équipe examinera la situation et vous contactera par e-mail.
                </p>
                <button className="px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                  Signaler un problème
                </button>
              </section>

              {/* Feedback Section */}
              <section className="mb-12 pb-12 border-b border-gray-200">
                <p className="text-gray-700 mb-4">
                  Cet article vous a-t-il été utile ?{" "}
                  <button className="underline font-semibold text-gray-900 hover:text-gray-700">
                    Oui
                  </button>{" "}
                  <button className="underline font-semibold text-gray-900 hover:text-gray-700">
                    Non
                  </button>
                </p>
              </section>

              {/* Related Topics Section */}
              <section>
                <h2
                  className="text-2xl sm:text-3xl mb-8"
                  style={{ fontWeight: 600 }}
                >
                  Sur le même sujet
                </h2>
                <div className="space-y-8">
                  {/* Article 1 */}
                  <div className="pb-8 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Guide pratique • Hôte d'un logement
                    </p>
                    <h3 className="text-lg font-semibold mb-2">
                      <a href="#" className="underline">
                        Lorsqu'un voisin signale un problème
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Consignes destinées aux hôtes lorsqu'un voisin signale un problème.
                    </p>
                  </div>

                  {/* Article 2 */}
                  <div className="pb-8 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      Guide pratique
                    </p>
                    <h3 className="text-lg font-semibold mb-2">
                      <a href="#" className="underline">
                        Ce qu'il faut savoir si votre voisin accueille des voyageurs sur HOMIQIO
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Nous invitons les hôtes à prendre leurs responsabilités et sérieux. Accueillir des voyageurs va de pair avec un engagement envers vos voisins et la communauté locale.
                    </p>
                  </div>

                  {/* Article 3 */}
                  <div className="pb-8">
                    <p className="text-sm text-gray-600 mb-2">
                      Politique relative à la communauté HOMIQIO
                    </p>
                    <h3 className="text-lg font-semibold mb-2">
                      <a href="#" className="underline">
                        Politique en matière de respect du voisinage
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Il est important que les utilisateurs d'HOMIQIO respectent le voisinage.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="rounded-xl p-6">
                  <h3
                    className="text-xl mb-3"
                    style={{ fontWeight: 600 }}
                  >
                    Besoin de nous joindre ?
                  </h3>
                  <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                    Commençons par quelques questions afin de mieux vous
                    orienter.
                  </p>
                  <button className="w-full px-6 py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Contactez-nous
                  </button>
                  <p className="text-sm text-gray-600 mt-4">
                    Vous pouvez également nous{" "}
                    <a href="#" className="underline font-semibold text-gray-900">
                      envoyer vos remarques
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 z-40"
          style={{ fontWeight: 600 }}
        >
          <ChevronUp className="w-5 h-5" />
          <span className="text-sm">Retour en haut de la page</span>
        </button>
      )}

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}