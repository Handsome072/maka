'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/app/components/LegalFooter';

export default function CompanyInfoPage() {
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
          <span style={{ color: '#222222' }}>Infos sur l'entreprise</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 lg:px-20 py-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
            À propos de HOMIQIO
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              HOMIQIO est une plateforme innovante de location de logements qui connecte 
              des millions de voyageurs avec des hôtes du monde entier.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Notre mission
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Créer un monde où chacun peut se sentir chez soi, partout. Nous croyons que 
              le voyage devrait être une expérience authentique et accessible à tous.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Informations légales
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>Raison sociale :</strong> HOMIQIO SAS
              </p>
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France
              </p>
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>SIRET :</strong> 123 456 789 00012
              </p>
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>Capital social :</strong> 100 000 €
              </p>
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>TVA intracommunautaire :</strong> FR12345678901
              </p>
            </div>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Direction
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Directeur de la publication : Jean Dupont, Président
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Hébergement
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Contact
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>Email :</strong> contact@homiqio.com
              </p>
              <p className="text-base mb-2" style={{ color: '#222222' }}>
                <strong>Téléphone :</strong> +33 1 23 45 67 89
              </p>
              <p className="text-base" style={{ color: '#222222' }}>
                <strong>Service client :</strong> Disponible 24h/24, 7j/7
              </p>
            </div>
          </div>
        </div>
      </main>

      <LegalFooter onNavigate={handleNavigate} />
    </>
  );
}

