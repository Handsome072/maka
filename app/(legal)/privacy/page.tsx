'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/app/components/LegalFooter';

export default function PrivacyPage() {
  const handleNavigate = (page: string) => {
    // Navigation is handled by Next.js Link components
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="px-6 lg:px-20 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline" style={{ color: '#222222' }}>
            Accueil
          </Link>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <span style={{ color: '#222222' }}>Politique de confidentialité</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 lg:px-20 py-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
            Politique de confidentialité
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Chez HOMIQIO, nous nous engageons à protéger votre vie privée et vos données personnelles. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons 
              vos informations lorsque vous utilisez notre plateforme.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              1. Collecte des données
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Nous collectons les informations que vous nous fournissez directement, notamment :
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li style={{ color: '#222222' }}>Informations de compte (nom, email, téléphone)</li>
              <li style={{ color: '#222222' }}>Informations de paiement</li>
              <li style={{ color: '#222222' }}>Communications avec les hôtes et voyageurs</li>
              <li style={{ color: '#222222' }}>Avis et évaluations</li>
            </ul>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              2. Utilisation des données
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Nous utilisons vos données pour :
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li style={{ color: '#222222' }}>Fournir et améliorer nos services</li>
              <li style={{ color: '#222222' }}>Traiter les réservations et paiements</li>
              <li style={{ color: '#222222' }}>Communiquer avec vous</li>
              <li style={{ color: '#222222' }}>Assurer la sécurité de la plateforme</li>
            </ul>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              3. Protection des données
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données personnelles contre tout accès non autorisé, 
              modification, divulgation ou destruction.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              4. Vos droits
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Conformément au RGPD, vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li style={{ color: '#222222' }}>Droit d'accès à vos données</li>
              <li style={{ color: '#222222' }}>Droit de rectification</li>
              <li style={{ color: '#222222' }}>Droit à l'effacement</li>
              <li style={{ color: '#222222' }}>Droit à la portabilité</li>
              <li style={{ color: '#222222' }}>Droit d'opposition</li>
            </ul>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              5. Contact
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Pour toute question concernant cette politique de confidentialité ou pour exercer 
              vos droits, vous pouvez nous contacter à : privacy@homiqio.com
            </p>
          </div>
        </div>
      </main>

      <LegalFooter onNavigate={handleNavigate} />
    </>
  );
}

