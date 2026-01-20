import { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileNav } from './components/MobileNav';
import { Home } from './pages/Home';
import { Experiences } from './pages/Experiences';
import { Services } from './pages/Services';
import { PropertyDetails } from './pages/PropertyDetails';
import { ExperienceDetails } from './pages/ExperienceDetails';
import { ServiceDetails } from './pages/ServiceDetails';
import { BookingRequest } from './pages/BookingRequest';
import { SearchResults } from './pages/SearchResults';
import { ClientSpace } from './pages/ClientSpace';
import { Messages } from './pages/Messages';
import { Privacy } from './pages/Privacy';
import { TermsOfService } from './pages/TermsOfService';
import { HowItWorks } from './pages/HowItWorks';
import { CompanyInfo } from './pages/CompanyInfo';
import { HostOnboarding } from './pages/HostOnboarding';
import { Annonces } from './pages/Annonces';
import { IdentityVerification } from './pages/IdentityVerification';
import { EditListing } from './pages/EditListing';
import { PhoneVerification } from './pages/PhoneVerification';
import { ExperienceOnboarding } from './pages/ExperienceOnboarding';
import { AuthProvider } from './context/AuthContext';
import { getListingData, saveListingData } from './utils/listingStorage';
import { Search } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'logements' | 'experiences' | 'services' | 'property-details' | 'experience-details' | 'service-details' | 'booking-request' | 'search-results' | 'client-space' | 'messages' | 'privacy' | 'terms' | 'how-it-works' | 'company-info' | 'host-onboarding' | 'annonces' | 'verification-points' | 'identity-verification' | 'edit-listing' | 'phone-verification' | 'experience-onboarding'>('logements');
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [bookingData, setBookingData] = useState<any>(null);
  const [searchParams, setSearchParams] = useState<any>(null);
  const scrollListenerEnabled = useRef(true);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [listingTitle, setListingTitle] = useState('Maison hôte calme');
  const [isHost, setIsHost] = useState(false);

  // Load persisted data on mount
  useEffect(() => {
    const loadPersistedData = () => {
      const data = getListingData();
      setIsHost(data.isHost);
      setUploadedPhotos(data.uploadedPhotos);
      setListingTitle(data.listingTitle);
    };

    loadPersistedData();
  }, []);

  // Persist data whenever it changes
  useEffect(() => {
    saveListingData({ isHost });
  }, [isHost]);

  useEffect(() => {
    if (uploadedPhotos.length > 0) {
      saveListingData({ uploadedPhotos });
    }
  }, [uploadedPhotos]);

  useEffect(() => {
    if (listingTitle) {
      saveListingData({ listingTitle });
    }
  }, [listingTitle]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollListenerEnabled.current) return;

      const scrollY = window.scrollY;

      setIsScrolled((prevScrolled) => {
        // Hysteresis: large gap to prevent flickering
        // Switch to compact when scrollY > 120
        // Switch back to normal when scrollY < 60
        // 60px buffer zone (60-120) where state doesn't change
        if (!prevScrolled && scrollY > 120) {
          return true;
        } else if (prevScrolled && scrollY < 60) {
          return false;
        }
        return prevScrolled;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavigate = (page: 'logements' | 'experiences' | 'services' | 'property-details' | 'experience-details' | 'service-details' | 'booking-request' | 'search-results' | 'client-space' | 'messages' | 'privacy' | 'terms' | 'how-it-works' | 'company-info' | 'host-onboarding' | 'annonces' | 'verification-points' | 'identity-verification' | 'edit-listing' | 'phone-verification' | 'experience-onboarding', data?: any) => {
    setCurrentPage(page);
    if (data) {
      setBookingData(data);
      if (data.showConfirmationPopup !== undefined) {
        setShowConfirmationPopup(data.showConfirmationPopup);
      }
      if (data.uploadedPhotos !== undefined) {
        setUploadedPhotos(data.uploadedPhotos);
      }
      if (data.listingTitle !== undefined) {
        setListingTitle(data.listingTitle);
      }
    }

    // Disable scroll listener during navigation
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsScrolled(false);

    // Re-enable after a short delay
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  const handleBackToHome = () => {
    setCurrentPage('logements');
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsScrolled(false);
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  const handleBackToExperiences = () => {
    setCurrentPage('experiences');
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsScrolled(false);
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  const handleBackToServices = () => {
    setCurrentPage('services');
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsScrolled(false);
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  const handleBackToPropertyDetails = () => {
    setCurrentPage('property-details');
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setCurrentPage('search-results');
    scrollListenerEnabled.current = false;
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsScrolled(false);
    setTimeout(() => {
      scrollListenerEnabled.current = true;
    }, 100);
  };

  const isMainPage = currentPage === 'logements' || currentPage === 'experiences' || currentPage === 'services';
  const showMobileElements = isMainPage;

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white pb-16 md:pb-0">
        {currentPage !== 'property-details' && currentPage !== 'experience-details' && currentPage !== 'service-details' && currentPage !== 'booking-request' && currentPage !== 'search-results' && currentPage !== 'client-space' && currentPage !== 'messages' && currentPage !== 'privacy' && currentPage !== 'terms' && currentPage !== 'how-it-works' && currentPage !== 'company-info' && currentPage !== 'host-onboarding' && currentPage !== 'annonces' && currentPage !== 'verification-points' && currentPage !== 'identity-verification' && currentPage !== 'edit-listing' && currentPage !== 'phone-verification' && currentPage !== 'experience-onboarding' && (
          <>
            {/* Mobile Header - visible only for S < 745 */}
            <div className="md:hidden sticky top-0 z-50 bg-[#FAFAFA]">
              {/* Mobile Search Button */}
              <div className="px-4 py-3">
                <button
                  className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-full py-3 px-6 shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => { }}
                >
                  <Search className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Commencer ma recherche</span>
                </button>
              </div>

              {/* Mobile Navigation Tabs */}
              <div className="flex items-center justify-between px-6 pb-2 border-b border-gray-100/50">
                <button
                  onClick={() => handleNavigate('logements')}
                  className={`flex flex-col items-center gap-1.5 py-2 px-2 transition-opacity ${currentPage === 'logements' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className={`p-1 rounded-full ${currentPage === 'logements' ? 'bg-gray-100' : 'bg-transparent'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className={`text-[11px] font-medium leading-none ${currentPage === 'logements' ? 'text-black' : 'text-gray-600'}`}>Logements</span>
                </button>

                <button
                  onClick={() => handleNavigate('experiences')}
                  className={`flex flex-col items-center gap-1.5 py-2 px-2 relative transition-opacity ${currentPage === 'experiences' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className="relative">
                    <div className={`p-1 rounded-full ${currentPage === 'experiences' ? 'bg-gray-100' : 'bg-transparent'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <span className="absolute -top-2 -right-3 text-white text-[8px] px-1.5 py-0.5 rounded-full z-10 font-bold tracking-wide" style={{ background: 'linear-gradient(135deg, #4A6FA5 0%, #2D4C7B 100%)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>NOUVEAU</span>
                  </div>
                  <span className={`text-[11px] font-medium leading-none ${currentPage === 'experiences' ? 'text-black' : 'text-gray-600'}`}>Expériences</span>
                </button>

                <button
                  onClick={() => handleNavigate('services')}
                  className={`flex flex-col items-center gap-1.5 py-2 px-2 relative transition-opacity ${currentPage === 'services' ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  <div className="relative">
                    <div className={`p-1 rounded-full ${currentPage === 'services' ? 'bg-gray-100' : 'bg-transparent'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M9 3V21M15 3V21M3 9H21M3 15H21" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <span className="absolute -top-2 -right-3 text-white text-[8px] px-1.5 py-0.5 rounded-full z-10 font-bold tracking-wide" style={{ background: 'linear-gradient(135deg, #4A6FA5 0%, #2D4C7B 100%)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>NOUVEAU</span>
                  </div>
                  <span className={`text-[11px] font-medium leading-none ${currentPage === 'services' ? 'text-black' : 'text-gray-600'}`}>Services</span>
                </button>
              </div>
            </div>

            {/* Desktop/Tablet Header - hidden for S < 745 */}
            <div className="hidden md:block">
              <Header
                ref={headerRef}
                currentPage={currentPage}
                onNavigate={handleNavigate}
                isScrolled={isScrolled}
                onSearch={handleSearch}
                onClientSpaceClick={() => handleNavigate('client-space')}
                isHost={isHost}
              />
            </div>
          </>
        )}

        {currentPage === 'logements' && <Home isScrolled={isScrolled} onPropertyClick={() => handleNavigate('property-details')} onSearch={handleSearch} />}
        {currentPage === 'experiences' && <Experiences isScrolled={isScrolled} onExperienceClick={() => handleNavigate('experience-details')} />}
        {currentPage === 'services' && <Services isScrolled={isScrolled} onServiceClick={() => handleNavigate('service-details')} />}
        {currentPage === 'property-details' && <PropertyDetails onBack={handleBackToHome} onBook={(data) => handleNavigate('booking-request', data)} />}
        {currentPage === 'experience-details' && <ExperienceDetails onBack={handleBackToExperiences} />}
        {currentPage === 'service-details' && <ServiceDetails onBack={handleBackToServices} />}
        {currentPage === 'booking-request' && <BookingRequest onBack={handleBackToPropertyDetails} bookingData={bookingData} />}
        {currentPage === 'search-results' && searchParams && <SearchResults onBack={handleBackToHome} onNavigate={handleNavigate} searchParams={searchParams} />}
        {currentPage === 'client-space' && <ClientSpace onNavigate={handleNavigate} />}
        {currentPage === 'messages' && <Messages onNavigate={handleNavigate} />}
        {currentPage === 'privacy' && <Privacy onNavigate={handleNavigate} />}
        {currentPage === 'terms' && <TermsOfService onNavigate={handleNavigate} />}
        {currentPage === 'how-it-works' && <HowItWorks onNavigate={handleNavigate} />}
        {currentPage === 'company-info' && <CompanyInfo onNavigate={handleNavigate} />}
        {currentPage === 'host-onboarding' && <HostOnboarding onNavigate={handleNavigate} onCompleteOnboarding={() => setIsHost(true)} />}
        {currentPage === 'annonces' && <Annonces onNavigate={handleNavigate} showConfirmationPopup={showConfirmationPopup} onConfirmationComplete={() => setShowConfirmationPopup(false)} uploadedPhotos={uploadedPhotos} listingTitle={listingTitle} />}
        {currentPage === 'verification-points' && <HostOnboarding onNavigate={handleNavigate} initialStep="verification-points" />}
        {currentPage === 'identity-verification' && <IdentityVerification onNavigate={handleNavigate} listingTitle={listingTitle} />}
        {currentPage === 'edit-listing' && <EditListing onNavigate={handleNavigate} uploadedPhotos={uploadedPhotos} listingTitle={listingTitle} />}
        {currentPage === 'phone-verification' && <PhoneVerification onNavigate={handleNavigate} />}
        {currentPage === 'experience-onboarding' && <ExperienceOnboarding onNavigate={handleNavigate} />}

        {currentPage !== 'property-details' && currentPage !== 'experience-details' && currentPage !== 'service-details' && currentPage !== 'booking-request' && currentPage !== 'search-results' && currentPage !== 'client-space' && currentPage !== 'messages' && currentPage !== 'privacy' && currentPage !== 'terms' && currentPage !== 'how-it-works' && currentPage !== 'company-info' && currentPage !== 'host-onboarding' && currentPage !== 'annonces' && currentPage !== 'verification-points' && currentPage !== 'identity-verification' && currentPage !== 'edit-listing' && currentPage !== 'phone-verification' && currentPage !== 'experience-onboarding' && <Footer onNavigate={handleNavigate} />}

        {/* Mobile Navigation - visible only for S < 745 on main pages */}
        {showMobileElements && (
          <MobileNav
            isScrolled={isScrolled}
            onSearchClick={() => { }}
            onFavoritesClick={() => { }}
            onLoginClick={() => handleNavigate('client-space')}
          />
        )}
      </div>
    </AuthProvider>
  );
}