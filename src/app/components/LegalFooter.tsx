import Link from 'next/link';

interface LegalFooterProps {
  onNavigate?: (page: string) => void;
}

export function LegalFooter({ onNavigate }: LegalFooterProps) {
  return (
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
              <Link href="/privacy" className="hover:underline">
                Confidentialité
              </Link>
              <span>·</span>
              <Link href="/terms" className="hover:underline">
                Conditions générales
              </Link>
              <span>·</span>
              <Link href="/how-it-works" className="hover:underline">
                Fonctionnement du site
              </Link>
              <span>·</span>
              <Link href="/company-info" className="hover:underline">
                Infos sur l'entreprise
              </Link>
            </div>

            {/* Right - Language */}
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
  );
}
