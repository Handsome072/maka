'use client';

import { Search, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function HelpCenterPage() {
    const [activeTab, setActiveTab] = useState('Voyageur');
    // TODO: Récupérer le nom de l'utilisateur depuis le contexte d'authentification
    const userName = 'Ramaroson';

    const tabs = [
        'Voyageur',
        'Hôte d\'un logement',
        'Hôte d\'expérience',
        'Hôte de services',
        'Administrateur de voyages'
    ];

    const guideCards = [
        {
            title: "Premiers pas en tant que voyageur sur HOMIQIO",
            imageSrc: "/assets/help_getting_started.png",
            alt: "Voyageur avec carte",
        },
        {
            title: "Utilisez les fonctionnalités de recherche afin de trouver un hébergement sur HOMIQIO",
            imageSrc: "/assets/help_reservation.png",
            alt: "Recherche d'hébergement",
        },
        {
            title: "AirCover pour les voyageurs",
            imageSrc: "/assets/help_aircover.png",
            alt: "Bouclier AirCover",
        },
        {
            title: "Vérifiez et modifiez vos informations personnelles sur votre compte HOMIQIO",
            imageSrc: "/assets/help_community.png",
            alt: "Informations personnelles",
        }
    ];

    const topArticles = [
        {
            title: "Annuler votre réservation de logement en tant que voyageur",
            desc: "Vous pouvez annuler ou modifier la réservation d'un logement dans la section Voyages."
        },
        {
            title: "Modifier la date ou l'heure de votre réservation de service ou d'expérience",
            desc: "Lorsque vous réservez un service ou une expérience, vous pouvez modifier la date ou..."
        },
        {
            title: "Si votre hôte annule votre réservation de logement",
            desc: "Si votre réservation est annulée par l'hôte, vous recevrez un remboursement intégral. Si..."
        },
        {
            title: "Modes de paiement acceptés",
            desc: "Nous acceptons différents modes de paiement selon le pays dans lequel votre..."
        },
        {
            title: "Ajouter ou supprimer un mode de paiement",
            desc: "Découvrez comment gérer vos modes de paiement."
        },
        {
            title: "Quand vous paierez votre réservation",
            desc: "Cela dépend du type de réservation, du mode de paiement et du lieu de séjour."
        }
    ];

    return (
        <div className="flex flex-col items-center w-full">
            {/* Main Content Container - Unified */}
            <div className="w-full max-w-[1200px] px-4 sm:px-6 lg:px-8 pb-20">
                {/* Search Section */}
                <section className="pt-16 pb-8">
                    {/* Main Heading - Centered */}
                    <h1 className="text-[32px] font-bold text-[#222222] mb-8 leading-tight text-center">
                        Bonjour {userName}, comment pouvons-nous vous aider ?
                    </h1>

                    {/* Search Bar - Centered */}
                    <div className="relative mb-12 max-w-full mx-auto">
                        <div className="relative flex items-center w-full bg-[#F7F7F7] rounded-full border border-transparent hover:bg-white hover:border-gray-500 hover:shadow-md transition-all h-[60px] overflow-visible group focus-within:bg-white focus-within:border-black focus-within:shadow-md">
                            <input
                                type="text"
                                placeholder="Rechercher des guides pratiques et plus"
                                className="w-full h-full bg-transparent border-none outline-none pl-6 pr-[56px] text-base text-[#222222] placeholder:text-gray-500"
                            />
                            <button className="absolute right-[4px] top-1/2 -translate-y-1/2 w-[44px] h-[44px] bg-[#FF385C] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity flex-shrink-0 shadow-sm z-10">
                                <Search className="w-5 h-5 font-bold" strokeWidth={3} />
                            </button>
                        </div>
                    </div>

                    {/* Tabs - Left aligned */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-gray-200">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-3 px-2 text-sm whitespace-nowrap transition-colors relative ${activeTab === tab
                                    ? 'text-black font-semibold'
                                    : 'text-gray-400 hover:text-gray-600 font-medium'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></span>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Top Navigation Links */}
                <div className="mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link href="#" className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors bg-white">
                        <span className="text-[#222222] text-sm">Voir le statut de vérification de l'identité</span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    </Link>
                    <Link href="#" className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors bg-white">
                        <span className="text-[#222222] text-sm">En savoir plus</span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    </Link>
                    <Link href="#" className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:border-gray-400 transition-colors bg-white sm:col-span-2">
                        <span className="text-[#222222] text-sm">Accéder à Voyages</span>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                    </Link>
                </div>

                {/* Recommandé pour vous Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6">Recommandé pour vous</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Action Requise Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-xs font-bold text-[#FF385C] uppercase mb-3">ACTION REQUISE</div>
                            <h3 className="text-lg font-bold text-[#222222] mb-3">
                                La vérification de votre identité n'est pas terminée
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                Cette procédure nous permet de confirmer votre identité. Elle sert à garantir la sécurité de la plate-forme HOMIQIO.
                            </p>
                        </div>
                        {/* Lien Rapide Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-xs font-bold text-gray-500 uppercase mb-3">LIEN RAPIDE</div>
                            <h3 className="text-lg font-bold text-[#222222] mb-3">
                                Retrouver les détails de la réservation
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                L'onglet Voyages contient tous les détails, les reçus et les coordonnées de l'hôte pour chacune de vos réservations.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Guides pour démarrer */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-[#222222]">Guides pour démarrer</h2>
                        <Link href="#" className="flex items-center text-sm font-semibold hover:underline">
                            Parcourir tous les sujets <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {guideCards.map((card, idx) => (
                            <div key={idx} className="group cursor-pointer">
                                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 relative bg-gray-100">
                                    <img
                                        src={card.imageSrc}
                                        alt={card.alt}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <h3 className="font-semibold text-[#222222] group-hover:underline leading-snug">
                                    {card.title}
                                </h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Articles principaux */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6">Articles principaux</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                        {topArticles.map((article, idx) => (
                            <div key={idx} className="flex flex-col pb-6 border-b border-gray-200 last:border-b-0 md:border-b-0">
                                <Link href="#" className="font-semibold text-[#222222] hover:underline mb-2 text-base underline">
                                    {article.title}
                                </Link>
                                <p className="text-[#222222] text-sm leading-relaxed">
                                    {article.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* En savoir plus Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-[#222222] mb-6">En savoir plus</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Left large cards - spanning 2 columns */}
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Card 1 - Les politiques de la communauté */}
                            <Link href="#" className="group cursor-pointer">
                                <div className="relative rounded-xl overflow-hidden h-full min-h-[280px] bg-gray-100">
                                    <img
                                        src="/assets/help_community.png"
                                        alt="Les politiques de la communauté"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Dark overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent p-6">
                                        <h3 className="font-semibold text-lg mb-2 text-white">Les politiques de la communauté</h3>
                                        <p className="text-sm text-white/90">Nos actions pour établir un climat de confiance.</p>
                                    </div>
                                </div>
                            </Link>

                            {/* Card 2 - Conseils et consignes de sécurité */}
                            <Link href="#" className="group cursor-pointer">
                                <div className="relative rounded-xl overflow-hidden h-full min-h-[280px] bg-gray-100">
                                    <img
                                        src="/assets/help_aircover.png"
                                        alt="Conseils et consignes de sécurité"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    {/* Dark overlay at bottom */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/70 to-transparent p-6">
                                        <h3 className="font-semibold text-lg mb-2 text-white">Conseils et consignes de sécurité</h3>
                                        <p className="text-sm text-white/90">Conseils de sécurité pour les voyageurs.</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Right Contact Box - spanning 1 column */}
                        <div className="md:col-span-1">
                            <div className="border border-gray-200 rounded-xl p-6 h-auto bg-white">
                                <h3 className="text-xl font-semibold mb-2 text-[#222222]">Besoin de nous joindre ?</h3>
                                <p className="text-[#222222] mb-6 text-sm leading-relaxed">
                                    Commençons par quelques questions afin de mieux vous orienter.
                                </p>
                                <button className="w-full bg-white border-[1px] border-[#222222] text-[#222222] hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors mb-4">
                                    Contactez-nous
                                </button>

                                <p className="text-sm text-[#222222]">
                                    Vous pouvez également{' '}
                                    <Link href="#" className="underline hover:text-gray-600 text-blue-600">
                                        envoyer vos remarques.
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
