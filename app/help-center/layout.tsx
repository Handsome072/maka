'use client';

import React from 'react';
import { Footer } from '@/app/components/Footer';
import { Header } from '@/app/components/Header';
import { useRouter } from 'next/navigation';
import { ScrollProvider, useScroll } from '@/app/hooks/ScrollContext';
import { AuthProvider } from '@/app/context/AuthContext';
import { getNavigationPath } from '@/app/config/routes';

function HelpCenterLayoutContent({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isScrolled, handleNavigateScroll } = useScroll();

    const handleNavigate = (page: 'logements' | 'experiences' | 'services' | 'messages' | 'host-onboarding' | 'annonces' | 'client-space' | 'experience-onboarding') => {
        const path = getNavigationPath(page);
        handleNavigateScroll();
        router.push(path);
    };

    const handleSearch = (params: any) => {
        const searchQuery = new URLSearchParams({
            destination: params.destination || '',
            checkIn: params.checkInDate?.toISOString() || '',
            checkOut: params.checkOutDate?.toISOString() || '',
            adults: params.guestsCount?.adults?.toString() || '0',
            children: params.guestsCount?.children?.toString() || '0',
            babies: params.guestsCount?.babies?.toString() || '0',
            pets: params.guestsCount?.pets?.toString() || '0',
        });
        handleNavigateScroll();
        router.push(`/search?${searchQuery.toString()}`);
    };

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-[#222222]">
            {/* Reusing standard Header with help-center variant */}
            <Header
                currentPage="logements"
                onNavigate={handleNavigate}
                isScrolled={isScrolled}
                onSearch={handleSearch}
                variant="help-center"
            />

            {/* Main Content */}
            <main className="flex-grow">
                {children}
            </main>

            {/* Footer Standard */}
            <Footer onNavigate={handleNavigate} hideCards={true} />
        </div>
    );
}

export default function HelpCenterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <ScrollProvider>
                <HelpCenterLayoutContent>{children}</HelpCenterLayoutContent>
            </ScrollProvider>
        </AuthProvider>
    );
}
