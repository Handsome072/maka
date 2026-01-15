import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LegalFooter } from '@/app/components/LegalFooter';

export const metadata: Metadata = {
  title: 'Conditions Générales | Homiqio',
  description: 'Conditions Générales d\'Utilisation et de Réservation de la plateforme HOMIQIO',
};

export default function TermsPage() {
  return (
    <>
      {/* Main content */}
      <div className="px-6 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: '#222222' }}>
            <Link href="/" className="hover:underline">Accueil</Link>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span className="hover:underline">All Topics</span>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span className="hover:underline">Conditions et dispositions juridiques</span>
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
                Conditions Générales d'Utilisation
              </h1>

              {/* CGU - Article 1 */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  ARTICLE 1 – IDENTITÉ DE L'EXPLOITANT
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  La plateforme HOMIQIO est exploitée par :
                </p>
                <div className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  <p style={{ fontWeight: 600 }}>WANDERLATE SASU</p>
                  <p>Société par actions simplifiée unipersonnelle au capital de 250 000 €</p>
                  <p>Siège social : Bureau 3, 2 place Jean V, 44000 Nantes, France</p>
                  <p>RCS Nantes : 991 607 656</p>
                  <p>TVA intracommunautaire : FR14991607656</p>
                </div>
                <p className="text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
                  HOMIQIO est une marque commerciale exploitée par WANDERLATE SASU.
                </p>
              </section>

              {/* CGU - Article 2 */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  ARTICLE 2 – OBJET DES CGU
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Les présentes Conditions Générales d'Utilisation ont pour objet de définir les modalités et conditions d'accès, de navigation et d'utilisation de la plateforme HOMIQIO.
                </p>
                <p className="text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Toute utilisation de la plateforme implique l'acceptation pleine, entière et sans réserve des présentes CGU par l'utilisateur.
                </p>
              </section>

              {/* CGU - Article 3 */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  ARTICLE 3 – DÉFINITIONS
                </h2>
                <ul className="pl-6" style={{ color: '#222222', lineHeight: '1.6' }}>
                  <li style={{ listStyleType: 'disc' }}><strong>Plateforme :</strong> le site internet, l'application mobile et les services numériques HOMIQIO</li>
                  <li style={{ listStyleType: 'disc' }}><strong>Utilisateur :</strong> toute personne accédant à la plateforme</li>
                  <li style={{ listStyleType: 'disc' }}><strong>Client :</strong> utilisateur effectuant une réservation</li>
                  <li style={{ listStyleType: 'disc' }}><strong>Hébergeur :</strong> professionnel ou particulier proposant un hébergement via la plateforme</li>
                </ul>
              </section>

              {/* CGU - Article 4 */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  ARTICLE 4 – ACCÈS À LA PLATEFORME
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  L'accès à la plateforme est gratuit.
                </p>
                <p className="text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Certaines fonctionnalités, notamment la réservation d'hébergements, nécessitent la création d'un compte utilisateur.
                </p>
              </section>

              {/* CGU - Article 16 */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  ARTICLE 16 – DROIT APPLICABLE ET JURIDICTION COMPÉTENTE
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Les présentes CGU sont soumises au droit français.
                </p>
                <p className="text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Tout litige relatif à leur interprétation ou exécution relève de la compétence exclusive des tribunaux compétents du ressort de Nantes.
                </p>
              </section>
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
                    style={{ fontWeight: 600, backgroundColor: '#10B981' }}
                  >
                    Me connecter ou m'inscrire
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegalFooter activePage="terms" />
    </>
  );
}

