import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LegalFooter } from '@/app/components/LegalFooter';

export const metadata: Metadata = {
  title: 'Politique de Confidentialité | Homiqio',
  description: 'Politique de confidentialité et politique cookies de la plateforme HOMIQIO',
};

export default function PrivacyPage() {
  return (
    <>
      {/* Main content */}
      <div className="px-6 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: '#222222' }}>
            <Link href="/" className="hover:underline">Accueil</Link>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span className="hover:underline">All topics</span>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span className="hover:underline">Conditions et dispositions juridiques</span>
            <ChevronRight className="w-4 h-4" style={{ color: '#717171' }} />
            <span style={{ color: '#717171' }}>Politique de confidentialité</span>
          </nav>

          <div className="flex gap-12">
            {/* Main content area */}
            <div className="flex-1 max-w-3xl">
              <p className="text-xs mb-3" style={{ color: '#717171' }}>
                Conditions et dispositions juridiques
              </p>

              <h1 className="text-[32px] mb-6" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.2' }}>
                Politique de Confidentialité
              </h1>

              {/* Section 1 - Identité du responsable */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  1. IDENTITÉ DU RESPONSABLE DU TRAITEMENT
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Les données personnelles collectées via la plateforme HOMIQIO sont traitées par :
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

              {/* Section 2 - Données collectées */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  2. DONNÉES PERSONNELLES COLLECTÉES
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Dans le cadre de l'utilisation de la plateforme, les données suivantes peuvent être collectées :
                </p>

                <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>2.1 Données d'identification</h3>
                <ul className="mb-4 pl-6" style={{ color: '#222222', lineHeight: '1.6' }}>
                  <li style={{ listStyleType: 'disc' }}>Nom, prénom</li>
                  <li style={{ listStyleType: 'disc' }}>Date de naissance (si nécessaire)</li>
                  <li style={{ listStyleType: 'disc' }}>Nationalité (le cas échéant)</li>
                </ul>

                <h3 className="text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>2.2 Données de contact</h3>
                <ul className="mb-4 pl-6" style={{ color: '#222222', lineHeight: '1.6' }}>
                  <li style={{ listStyleType: 'disc' }}>Adresse email</li>
                  <li style={{ listStyleType: 'disc' }}>Numéro de téléphone</li>
                  <li style={{ listStyleType: 'disc' }}>Adresse postale</li>
                </ul>
              </section>

              {/* Section 3 - Droits des utilisateurs */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  3. DROITS DES UTILISATEURS
                </h2>
                <p className="text-base mb-4" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Conformément au RGPD, chaque utilisateur dispose des droits suivants :
                </p>
                <ul className="mb-4 pl-6" style={{ color: '#222222', lineHeight: '1.6' }}>
                  <li style={{ listStyleType: 'disc' }}>Droit d'accès</li>
                  <li style={{ listStyleType: 'disc' }}>Droit de rectification</li>
                  <li style={{ listStyleType: 'disc' }}>Droit d'effacement</li>
                  <li style={{ listStyleType: 'disc' }}>Droit à la limitation du traitement</li>
                  <li style={{ listStyleType: 'disc' }}>Droit d'opposition</li>
                  <li style={{ listStyleType: 'disc' }}>Droit à la portabilité</li>
                </ul>
                <p className="text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Les demandes peuvent être adressées à :{' '}
                  <a href="mailto:contact@homiqio.com" className="underline hover:text-gray-600">contact@homiqio.com</a>
                </p>
              </section>

              {/* Section 4 - Contact */}
              <section className="mb-8">
                <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                  4. CONTACT
                </h2>
                <p className="text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
                  Pour toute question relative à la présente politique, l'utilisateur peut contacter :{' '}
                  <a href="mailto:contact@homiqio.com" className="underline hover:text-gray-600">contact@homiqio.com</a>
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
                  <Link
                    href="/login"
                    className="block w-full text-center px-6 py-3 text-white rounded-lg text-base hover:opacity-90 transition-opacity"
                    style={{ fontWeight: 600, backgroundColor: '#000000' }}
                  >
                    Me connecter ou m'inscrire
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LegalFooter activePage="privacy" />
    </>
  );
}

