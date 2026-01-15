import { Search, ChevronRight, ArrowUp } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TermsOfServiceProps {
  onNavigate: (page: string) => void;
}

export function TermsOfService({ onNavigate }: TermsOfServiceProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

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
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Rechercher des guides pratiq..."
                  className="w-full pl-4 pr-12 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
                <button className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#000000] rounded-full flex items-center justify-center">
                  <Search className="w-4 h-4 text-white" />
                </button>
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
            <button className="hover:underline">All Topics</button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <button className="hover:underline">Conditions et dispositions juridiques</button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <button className="hover:underline">Conditions générales</button>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span style={{ color: '#717171' }}>Conditions de Service</span>
          </nav>

          <div className="flex gap-12">
            {/* Main content area */}
            <div className="flex-1 max-w-3xl">
              <p className="text-xs mb-3" style={{ fontWeight: 600, color: '#717171', textTransform: 'uppercase' }}>
                Conditions et dispositions juridiques
              </p>

              <h1 className="text-[32px] mb-8" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
                Conditions de Service
              </h1>

              {/* Warning Box */}
              <div className="mb-8 p-4 rounded-lg border border-[#F7E5D3] bg-[#FFF8F0]">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 1L15 14H1L8 1Z" fill="#B4690E" />
                      <path d="M8 6V9M8 11V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: '#222222' }}>
                    Si votre pays de résidence ou d'établissement se trouve dans l'Espace économique européen (« EEE »), en Suisse ou au Royaume-Uni, les{' '}
                    <a href="#" className="underline">
                      Conditions de service pour les utilisateurs européens
                    </a>{' '}
                    s'appliquent à vous.
                    <br />
                    Si votre pays de résidence ou d'établissement se trouve en dehors de l'EEE, de la Suisse, de l'Australie et du Royaume-Uni, les{' '}
                    <a href="#" className="underline">
                      Conditions de service pour les utilisateurs situés en dehors de l'EEE, du Royaume-Uni et de l'Australie
                    </a>{' '}
                    s'appliquent à vous.
                    <br />
                    Si votre pays de résidence ou d'établissement est l'Australie, les{' '}
                    <a href="#" className="underline">
                      Conditions de service pour les utilisateurs australiens
                    </a>{' '}
                    s'appliquent à vous.
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <h2 className="text-xl mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Conditions de service pour les utilisateurs en Europe
              </h2>

              <p className="text-base mb-6 leading-relaxed" style={{ color: '#222222' }}>
                Veuillez noter qu'Airbnb ne s'engage ni ne s'oblige à utiliser un dispositif alternatif de résolution des litiges au sens de la directive 2013/11 UE afin de résoudre des litiges avec les consommateurs.
              </p>

              <p className="text-base mb-6 leading-relaxed" style={{ color: '#222222' }}>
                <strong>L'article 25 des présentes Conditions contient un contrat d'arbitrage et de renonciation de recours collectif qui s'appliquent à toute demande d'indemnisation engagée contre Airbnb aux États-Unis. Veuillez les lire attentivement.</strong>
              </p>

              <p className="text-base mb-12 leading-relaxed" style={{ color: '#222222' }}>
                Dernière mise à jour : 13 mai 2025
              </p>

              {/* Payment Information Sections */}
              <div className="space-y-8 mb-12">
                <div>
                  <h3 className="text-base mb-3" style={{ fontWeight: 600, color: '#222222' }}>
                    Partie contractante relative aux services de paiement destinés aux utilisateurs dont le lieu de résidence se trouve au Royaume-Uni, en Suisse ou en Russie :
                  </h3>
                  <div className="text-base leading-relaxed space-y-1" style={{ color: '#222222' }}>
                    <p>Airbnb Payments UK Ltd.</p>
                    <p>280 Bishopsgate</p>
                    <p>Londres</p>
                    <p>EC2M 4AG</p>
                    <p>Royaume-Uni</p>
                  </div>
                </div>

                <div className="text-base leading-relaxed space-y-1" style={{ color: '#222222' }}>
                  <p><strong>Numéro de l'entreprise :</strong> 09392688</p>
                  <p><strong>Conseil d'administration :</strong> Quent Rickerby, Bart Rubin, David Coleman</p>
                  <p>Airbnb Payments UK Ltd. est autorisé et régulé par l'Autorité de bonne conduite financière (Financial Conduct Authority) en tant qu'établissement de monnaie électronique sous la référence 900596.</p>
                </div>

                <div>
                  <h3 className="text-base mb-3" style={{ fontWeight: 600, color: '#222222' }}>
                    Partie contractante relative aux services de paiement destinés aux utilisateurs dont le lieu de résidence se trouve dans l'Espace économique européen :
                  </h3>
                  <div className="text-base leading-relaxed space-y-1" style={{ color: '#222222' }}>
                    <p>Airbnb Payments Luxembourg S.A.</p>
                    <p>4, rue Henri Schnadt</p>
                    <p>L-2530 Luxembourg</p>
                    <p>Luxembourg</p>
                  </div>
                </div>

                <div className="text-base leading-relaxed space-y-1" style={{ color: '#222222' }}>
                  <p><strong>Numéro de l'entreprise :</strong> B230618</p>
                  <p><strong>Conseil d'administration :</strong> Thomas Belousek, Marc Hemmerling, Bart Rubin, Amit Singh</p>
                  <p>Airbnb Payments Luxembourg S.A. est autorisée et régulée par la Commission de Surveillance du Secteur Financier (« CSSF ») sous le numéro de référence Z21.</p>
                </div>

                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                    Informations sur l'interlocuteur des autorités de l'UE dans le cadre du règlement sur les services numériques
                  </h3>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
                    Interlocuteur unique pour les autorités des États membres, la Commission européenne et le conseil d'administration conformément à l'article 11 du règlement :{' '}
                    <a href="mailto:dsa-authorities@airbnb.com" className="underline">
                      dsa-authorities@airbnb.com
                    </a>
                    . Veuillez vous assurer que les communications sont faites en anglais ou accompagnées d'une traduction en anglais.
                  </p>
                </div>

                <div>
                  <h3 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                    Informations sur le nombre mensuel moyen de destinataires actifs dans l'Union européenne :
                  </h3>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
                    En vertu de l'article 24, paragraphe 2, du règlement sur les services numériques, les plateformes en ligne sont tenues de publier des « informations sur le nombre mensuel moyen de destinataires actifs du service dans l'Union » avant le 17 février 2023, et tous les six mois par la suite.
                  </p>
                  <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
                    Conformément aux dispositions du règlement, y compris le Considérant 77, nous avons calculé que notre nombre mensuel moyen de destinataires actifs dans l'Union européenne pour la période du 1 févr. – 31 juil. 2025 s'élève à environ 41.7M.
                  </p>
                  <p className="text-base leading-relaxed" style={{ color: '#222222' }}>
                    Nous continuerons à suivre toute évolution et publierons tous les six mois des informations sur le nombre mensuel moyen de destinataires actifs de notre service dans l'Union européenne, conformément à l'article 24, paragraphe 2, du règlement.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-24">
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-xl mb-3" style={{ fontWeight: 600, color: '#222222' }}>
                    Besoin de nous joindre ?
                  </h3>
                  <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                    Commençons par quelques questions afin de mieux vous orienter.
                  </p>
                  <button className="w-full px-6 py-3 bg-white border border-gray-900 rounded-lg text-base hover:bg-gray-50 transition-colors" style={{ fontWeight: 600, color: '#222222' }}>
                    Contactez-nous
                  </button>
                  <p className="text-sm mt-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                    Vous pouvez également nous{' '}
                    <a href="#" className="underline hover:text-gray-600">
                      envoyer vos remarques
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="px-6 lg:px-20 py-6">
          <div className="flex items-center gap-2 text-sm" style={{ color: '#717171' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C11.5 1.5 7.5 4 5.5 7.5C3.5 11 3 15 4.5 19C6 23 9.5 26.5 13 28.5C14 29 15 29.5 16 29.5C17 29.5 18 29 19 28.5C22.5 26.5 26 23 27.5 19C29 15 28.5 11 26.5 7.5C24.5 4 20.5 1.5 16 1.5ZM16 20C13.8 20 12 18.2 12 16C12 13.8 13.8 12 16 12C18.2 12 20 13.8 20 16C20 18.2 18.2 20 16 20Z" fill="#717171" />
            </svg>
            <span>© 2026 Airbnb, Inc. All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* Scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 px-5 py-3 bg-gray-900 text-white rounded-full text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2 z-50"
          style={{ fontWeight: 600 }}
        >
          <ArrowUp className="w-4 h-4" />
          Retour en haut de la page
        </button>
      )}
    </div>
  );
}
