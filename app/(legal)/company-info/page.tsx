import type { Metadata } from 'next';
import { LegalFooter } from '@/app/components/LegalFooter';

export const metadata: Metadata = {
  title: 'Mentions Légales | Homiqio',
  description: 'Mentions légales de la plateforme HOMIQIO - WANDERLATE SASU',
};

export default function CompanyInfoPage() {
  return (
    <>
      {/* Main content */}
      <div className="px-6 lg:px-20 py-12">
        <div className="max-w-[800px] mx-auto">
          <h1 className="text-[32px] mb-10" style={{ fontWeight: 600, color: '#222222', lineHeight: '1.3' }}>
            MENTIONS LÉGALES
          </h1>

          <p className="text-base mb-8" style={{ color: '#222222', lineHeight: '1.6' }}>
            Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), il est précisé aux utilisateurs du site HOMIQIO l'identité des différents intervenants dans le cadre de sa réalisation et de son exploitation.
          </p>

          {/* Content sections */}
          <div className="space-y-8 text-base" style={{ color: '#222222', lineHeight: '1.6' }}>
            {/* Section 1 - Éditeur */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                1. Éditeur du site
              </h2>
              <p className="mb-4">Le site HOMIQIO est édité et exploité par :</p>
              <div className="mb-4">
                <p style={{ fontWeight: 600 }}>WANDERLATE SASU</p>
                <p>Société par actions simplifiée unipersonnelle au capital de 250 000 €</p>
                <p>Siège social : Bureau 3, 2 place Jean V, 44000 Nantes, France</p>
                <p>Immatriculée au Registre du Commerce et des Sociétés de Nantes sous le numéro 991 607 656</p>
                <p>SIREN : 991 607 656</p>
                <p>TVA intracommunautaire : FR14991607656</p>
              </div>
              <p>HOMIQIO est une marque commerciale exploitée par WANDERLATE SASU.</p>
            </section>

            {/* Section 2 - Hébergement */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                2. Hébergement du site
              </h2>
              <p className="mb-4">Le site est hébergé par :</p>
              <div className="mb-4">
                <p><strong>Nom de l'hébergeur :</strong> o2switch.</p>
                <p><strong>Adresse de l'hébergeur :</strong> Chemin des Pardiaux, 63000 Clermont-Ferrand, France.</p>
                <p><strong>Numéro de téléphone :</strong> 04 44 44 60 40 (assistance technique).</p>
                <p><strong>Contact email :</strong> support@o2switch.fr (support technique).</p>
              </div>
            </section>

            {/* Section 3 - Objet */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                3. Objet de la plateforme
              </h2>
              <p className="mb-4">
                HOMIQIO est une plateforme de réservation en ligne permettant la mise en relation entre des utilisateurs et des hébergeurs professionnels ou particuliers pour la réservation d'hébergements touristiques.
              </p>
              <p>
                HOMIQIO intervient exclusivement en qualité de plateforme intermédiaire de réservation et n'est ni propriétaire, ni exploitant des hébergements proposés, sauf mention contraire explicite.
              </p>
            </section>

            {/* Section 4 - Responsabilité */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                4. Responsabilité
              </h2>
              <p className="mb-4">
                WANDERLATE SASU, exploitant de la plateforme HOMIQIO, s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur le site. Toutefois, elle ne saurait être tenue responsable :
              </p>
              <ul className="mb-4 pl-6">
                <li style={{ listStyleType: 'disc' }}>des erreurs, omissions ou inexactitudes des contenus fournis par les hébergeurs,</li>
                <li style={{ listStyleType: 'disc' }}>des indisponibilités temporaires du site,</li>
                <li style={{ listStyleType: 'disc' }}>de l'exécution ou de la qualité des prestations fournies par les hébergeurs.</li>
              </ul>
              <p>La responsabilité de WANDERLATE SASU est strictement limitée à son rôle d'intermédiaire technique et commercial.</p>
            </section>

            {/* Section 5 - Propriété intellectuelle */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                5. Propriété intellectuelle
              </h2>
              <p className="mb-4">
                L'ensemble des éléments constituant le site HOMIQIO (textes, graphismes, logos, marques, interfaces, bases de données, structure générale) est protégé par le droit de la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans autorisation écrite préalable de WANDERLATE SASU, est strictement interdite.
              </p>
            </section>

            {/* Section 6 - Données personnelles */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                6. Données personnelles
              </h2>
              <p className="mb-4">
                Les données personnelles collectées via la plateforme HOMIQIO sont traitées conformément à la réglementation en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p className="mb-4">
                Les utilisateurs disposent d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition concernant leurs données personnelles.
              </p>
              <p>
                Toute demande peut être adressée via la plateforme ou à l'adresse suivante :{' '}
                <a href="mailto:contact@homiqio.com" className="text-[#10B981] underline hover:opacity-80">
                  contact@homiqio.com
                </a>
              </p>
            </section>

            {/* Section 7 - Cookies */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                7. Cookies
              </h2>
              <p className="mb-4">
                Le site HOMIQIO utilise des cookies et technologies similaires afin d'améliorer l'expérience utilisateur, mesurer l'audience et sécuriser les services.
              </p>
              <p>
                L'utilisateur peut paramétrer ses préférences en matière de cookies à tout moment via les outils mis à disposition sur le site.
              </p>
            </section>

            {/* Section 8 - Droit applicable */}
            <section>
              <h2 className="text-lg mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                8. Droit applicable
              </h2>
              <p className="mb-4">
                Les présentes mentions légales sont soumises au droit français.
              </p>
              <p>
                Tout litige relatif à l'utilisation du site relève de la compétence exclusive des tribunaux français territorialement compétents.
              </p>
            </section>
          </div>
        </div>
      </div>

      <LegalFooter activePage="company-info" />
    </>
  );
}

