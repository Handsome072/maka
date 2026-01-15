import { Search, ChevronRight, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PrivacyProps {
  onNavigate: (page: string) => void;
}

export function Privacy({ onNavigate }: PrivacyProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.search-container')) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <button
              onClick={() => onNavigate('logements')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
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
              <span className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                Centre d'aide
              </span>
            </button>

            {/* Search bar */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
              <div className="relative w-full search-container">
                <input
                  type="text"
                  placeholder="Rechercher des guides pratiques"
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  onClick={() => setShowSearchDropdown(true)}
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#000000] rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </button>
                
                {/* Dropdown */}
                {showSearchDropdown && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl p-6 z-50">
                    <h3 className="text-sm mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                      Articles principaux
                    </h3>
                    <div className="space-y-4">
                      <a href="#" className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#222222" strokeWidth="1.5" />
                            <path d="M8 8H16M8 12H16M8 16H12" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                            Annuler votre réservation de logement en tant que voyageur
                          </p>
                        </div>
                      </a>
                      <a href="#" className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#222222" strokeWidth="1.5" />
                            <path d="M8 8H16M8 12H16M8 16H12" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                            Modifier la date ou l'heure de votre réservation de service ou d'expérience
                          </p>
                        </div>
                      </a>
                      <a href="#" className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <rect x="4" y="4" width="16" height="16" rx="2" stroke="#222222" strokeWidth="1.5" />
                            <path d="M8 8H16M8 12H16M8 16H12" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ fontWeight: 600, color: '#222222' }}>
                            Si votre hôte annule votre réservation de logement
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full hover:bg-gray-50 flex items-center justify-center transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="#222222" strokeWidth="1.5" />
                  <path d="M3 8H13M8 3C6.5 4.5 6 6 6 8C6 10 6.5 11.5 8 13M8 3C9.5 4.5 10 6 10 8C10 10 9.5 11.5 8 13" stroke="#222222" strokeWidth="1.5" />
                </svg>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-full hover:shadow-md transition-shadow">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4H14M2 8H14M2 12H14" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="11" fill="#717171" />
                  <path d="M12 2C14.21 2 16 3.79 16 6C16 8.21 14.21 10 12 10C9.79 10 8 8.21 8 6C8 3.79 9.79 2 12 2ZM12 22C7.03 22 3 19.42 3 16.25C3 13.08 7.03 10.5 12 10.5C16.97 10.5 21 13.08 21 16.25C21 19.42 16.97 22 12 22Z" fill="#FFF" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="px-6 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: '#222222' }}>
            <button onClick={() => onNavigate('logements')} className="hover:underline">
              Accueil
            </button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <button className="hover:underline">All topics</button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <button className="hover:underline">Conditions et dispositions juridiques</button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <button className="hover:underline">Politique de confidentialité</button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span style={{ color: '#717171' }}>Protection des données sur HOMIQIO</span>
          </nav>

          <div className="flex gap-12">
            {/* Main content area */}
            <div className="flex-1 max-w-3xl">
              <p className="text-xs mb-3" style={{ color: '#717171' }}>
                Conditions et dispositions juridiques
              </p>

              <h1 className="text-[32px] mb-6" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
                Protection des données sur HOMIQIO
              </h1>

              <p className="text-base mb-8" style={{ color: '#222222', lineHeight: '1.6' }}>
                La Politique de confidentialité d'HOMIQIO décrit vos droits en matière de protection de la vie privée, le type de données personnelles collectées et la manière dont nous les utilisons et les communiquons.
              </p>

              {/* Politique de confidentialité section */}
              <h2 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222', textDecoration: 'underline' }}>
                Politique de confidentialité
              </h2>

              <p className="text-base mb-8" style={{ color: '#222222', lineHeight: '1.6' }}>
                Veuillez consulter les politiques de confidentialité supplémentaires en suivant les liens fournis dans les documents correspondants, par exemple celles relatives à certains services d'HOMIQIO qui peuvent s'appliquer à votre situation.
              </p>

              {/* Documents complémentaires */}
              <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Documents complémentaires à la Politique de confidentialité
              </h3>

              <ul className="space-y-2 mb-12" style={{ paddingLeft: '20px' }}>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Supplément En dehors des États-Unis
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Supplément sur la confidentialité pour les États-Unis
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Politique en matière de cookies
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Clients Entreprise et HOMIQIO for Work
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Supplément de confidentialité pour les utilisateurs en Chine
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Supplément sur la confidentialité pour le Brésil
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Complément à la Politique de confidentialité pour les services et les expériences
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Colombie uniquement
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Turquie uniquement
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Avis de confidentialité relatif à la directive DAC7 concernant les non-utilisateurs
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Complément à la Politique de confidentialité pour l'HOMIQIO-friendly Marketplace
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Supplément relatif aux assurances
                  </a>
                </li>
                <li className="text-base" style={{ color: '#222222', listStyleType: 'disc' }}>
                  <a href="#" className="underline hover:text-gray-600">
                    Complément à la Politique de confidentialité pour HOMIQIO Créateurs
                  </a>
                </li>
              </ul>

              <p className="text-base mb-12" style={{ color: '#222222', lineHeight: '1.6' }}>
                <a href="#" className="underline hover:text-gray-600" style={{ fontWeight: 600 }}>
                  HOMIQIO.org
                </a>{' '}
                est une entité distincte et indépendante d'HOMIQIO, Inc. Consultez la{' '}
                <a href="#" className="underline hover:text-gray-600">
                  Politique de confidentialité d'HOMIQIO.org
                </a>
                .
              </p>

              {/* Sur le même sujet */}
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg mb-6" style={{ fontWeight: 600, color: '#222222' }}>
                  Sur le même sujet
                </h3>

                <div className="space-y-8">
                  {/* Article 0 - Nouveau */}
                  <div className="pb-8 border-b border-gray-200">
                    <p className="text-xs mb-2" style={{ color: '#717171' }}>
                      Conditions et dispositions juridiques
                    </p>
                    <h4 className="text-base mb-2 underline" style={{ fontWeight: 600, color: '#222222' }}>
                      <a href="#" className="hover:text-gray-600">
                        Politique de confidentialité
                      </a>
                    </h4>
                    <p className="text-sm" style={{ color: '#717171', lineHeight: '1.6' }}>
                      Dernière mise à jour : 6 février 2025 HOMIQIO a pour objectif de créer des liens entre les personnes pour un monde plus ouvert et inclusif. A...
                    </p>
                  </div>

                  {/* Article 1 */}
                  <div className="pb-8 border-b border-gray-200">
                    <p className="text-xs mb-2" style={{ color: '#717171' }}>
                      Conditions et dispositions juridiques
                    </p>
                    <h4 className="text-base mb-2 underline" style={{ fontWeight: 600, color: '#222222' }}>
                      <a href="#" className="hover:text-gray-600">
                        Complément en dehors des États-Unis
                      </a>
                    </h4>
                    <p className="text-sm" style={{ color: '#717171', lineHeight: '1.6' }}>
                      La présente sous-rubrique (« Sous-rubrique ») s'applique si vous résidez en dehors des États-Unis, du Brésil ou de la Chine et complète notr...
                    </p>
                  </div>

                  {/* Article 2 */}
                  <div className="pb-8">
                    <p className="text-xs mb-2" style={{ color: '#717171' }}>
                      Politique relative à la communauté HOMIQIO
                    </p>
                    <h4 className="text-base mb-2 underline" style={{ fontWeight: 600, color: '#222222' }}>
                      <a href="#" className="hover:text-gray-600">
                        Protection de votre vie privée
                      </a>
                    </h4>
                    <p className="text-sm" style={{ color: '#717171', lineHeight: '1.6' }}>
                      Afin de créer un environnement propice à la protection de la vie privée, voici quelques règles de base sur ce que nous autorisons et ce que ...
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="text-base mb-3" style={{ fontWeight: 600, color: '#222222' }}>
                    Obtenez de l'aide pour vos réservations, votre compte et plus encore.
                  </h3>
                  <button
                    className="w-full px-6 py-3 text-white rounded-lg text-base hover:opacity-90 transition-opacity"
                    style={{ fontWeight: 600, backgroundColor: '#000000' }}
                  >
                    Me connecter ou m'inscrire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="px-6 lg:px-20 py-12">
          {/* Footer Links Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
            {/* Assistance */}
            <div>
              <h3 className="text-xs mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Assistance
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Assistance sécurité
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    AirCover
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Lutte contre la discrimination
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Assistance handicap
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Options d'annulation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    J'ai un problème de voisinage
                  </a>
                </li>
              </ul>
            </div>

            {/* Accueil de voyageurs */}
            <div>
              <h3 className="text-xs mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Accueil de voyageurs
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Mettez votre logement sur HOMIQIO
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Proposez votre expérience sur HOMIQIO
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Proposez votre service sur HOMIQIO
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    AirCover pour les hôtes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Ressources pour les hôtes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Forum de la communauté
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Hébergement responsable
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Participez à un cours gratuit pour les nouveaux hôtes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Trouver un co-hôte
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Parrainer un hôte
                  </a>
                </li>
              </ul>
            </div>

            {/* HOMIQIO */}
            <div>
              <h3 className="text-xs mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                HOMIQIO
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Édition été 2025
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Newsroom
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Carrières
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Investisseurs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Cartes cadeaux
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm hover:underline" style={{ color: '#222222' }}>
                    Séjours d'urgence HOMIQIO.org
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Left - Copyright & Links */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm" style={{ color: '#222222' }}>
                <span>© 2026 HOMIQIO, Inc.</span>
                <span>·</span>
                <a href="#" className="hover:underline">Confidentialité</a>
                <span>·</span>
                <button onClick={() => onNavigate('terms')} className="hover:underline">Conditions générales</button>
                <span>·</span>
                <a href="#" className="hover:underline">Fonctionnement du site</a>
                <span>·</span>
                <a href="#" className="hover:underline">Infos sur l'entreprise</a>
              </div>

              {/* Right - Language & Button */}
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-sm hover:underline" style={{ fontWeight: 600, color: '#222222' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3 8H13M8 3C6.5 4.5 6 6 6 8C6 10 6.5 11.5 8 13M8 3C9.5 4.5 10 6 10 8C10 10 9.5 11.5 8 13" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                  <span>Français (FR)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 px-5 py-3 bg-gray-900 text-white rounded-lg text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 z-50"
          style={{ fontWeight: 600 }}
        >
          <ArrowUp className="w-4 h-4" />
          Retour en haut de la page
        </button>
      )}
    </div>
  );
}