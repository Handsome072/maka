'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { LegalFooter } from '@/app/components/LegalFooter';

export default function HowItWorksPage() {
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
          <span style={{ color: '#222222' }}>Fonctionnement du site</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="px-6 lg:px-20 py-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
            Comment fonctionne HOMIQIO
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              HOMIQIO est une plateforme qui met en relation des voyageurs avec des hôtes 
              proposant des hébergements uniques. Voici comment ça marche.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Pour les voyageurs
            </h2>
            
            <h3 className="text-lg mt-6 mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              1. Recherchez
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Utilisez notre moteur de recherche pour trouver le logement idéal. Filtrez par 
              destination, dates, nombre de voyageurs et équipements souhaités.
            </p>

            <h3 className="text-lg mt-6 mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              2. Réservez
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Une fois le logement trouvé, envoyez une demande de réservation. L'hôte dispose 
              de 24 heures pour accepter ou refuser votre demande.
            </p>

            <h3 className="text-lg mt-6 mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              3. Profitez
            </h3>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Après confirmation, vous recevrez toutes les informations nécessaires pour votre 
              séjour. Communiquez directement avec votre hôte via notre messagerie.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Pour les hôtes
            </h2>

            <h3 className="text-lg mt-6 mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              1. Créez votre annonce
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Décrivez votre logement, ajoutez des photos de qualité et définissez vos tarifs 
              et disponibilités.
            </p>

            <h3 className="text-lg mt-6 mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              2. Accueillez des voyageurs
            </h3>
            <p className="text-base leading-relaxed mb-4" style={{ color: '#222222' }}>
              Recevez des demandes de réservation et choisissez les voyageurs que vous souhaitez 
              accueillir. Notre système de vérification vous aide à faire les bons choix.
            </p>

            <h3 className="text-lg mt-6 mb-3" style={{ fontWeight: 600, color: '#222222' }}>
              3. Gagnez de l'argent
            </h3>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              Recevez vos paiements de manière sécurisée, généralement 24 heures après l'arrivée 
              du voyageur.
            </p>

            <h2 className="text-xl mt-8 mb-4" style={{ fontWeight: 600, color: '#222222' }}>
              Notre garantie
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#222222' }}>
              HOMIQIO offre une protection complète pour les hôtes et les voyageurs. Notre 
              programme AirCover inclut une assurance dommages et une assistance 24/7.
            </p>
          </div>
        </div>
      </main>

      <LegalFooter onNavigate={handleNavigate} />
    </>
  );
}

