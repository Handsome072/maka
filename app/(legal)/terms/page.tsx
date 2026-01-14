'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/app/components/LegalFooter';

export default function TermsPage() {
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
          <span style={{ color: '#222222' }}>Conditions générales</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 lg:px-20 py-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
            Conditions générales d'utilisation
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Bienvenue sur HOMIQIO. En utilisant notre plateforme, vous acceptez les présentes 
              conditions générales d'utilisation. Veuillez les lire attentivement.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              1. Objet
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              HOMIQIO est une plateforme de mise en relation entre des hôtes proposant des 
              hébergements et des voyageurs recherchant un logement temporaire. Les présentes 
              conditions régissent l'utilisation de la plateforme.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              2. Inscription
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Pour utiliser certaines fonctionnalités de la plateforme, vous devez créer un compte. 
              Vous vous engagez à fournir des informations exactes et à maintenir la confidentialité 
              de vos identifiants de connexion.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              3. Réservations
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Les réservations sont soumises à l'acceptation de l'hôte. Une fois confirmée, 
              la réservation constitue un contrat entre le voyageur et l'hôte. HOMIQIO agit 
              uniquement en tant qu'intermédiaire.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              4. Paiements
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Les paiements sont traités de manière sécurisée via notre plateforme. Les frais 
              de service sont prélevés sur chaque transaction conformément à notre grille tarifaire.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              5. Annulations
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Les conditions d'annulation varient selon les politiques définies par chaque hôte. 
              Consultez les conditions spécifiques avant de réserver.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              6. Responsabilités
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              HOMIQIO n'est pas responsable des litiges entre hôtes et voyageurs. Nous nous 
              efforçons cependant de faciliter la résolution des conflits via notre service client.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              7. Modification des conditions
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les 
              modifications entrent en vigueur dès leur publication sur la plateforme.
            </p>
          </div>
        </div>
      </main>

      <LegalFooter onNavigate={handleNavigate} />
    </>
  );
}

