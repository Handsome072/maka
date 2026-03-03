import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Toaster } from 'sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { getListingData, saveListingData } from './utils/listingStorage';
import { PageLoader } from './components/PageLoader';

// Lazy load pages
const Home = lazy(() => import('./pages/Home').then(module => ({ default: module.Home })));
const Experiences = lazy(() => import('./pages/Experiences').then(module => ({ default: module.Experiences })));
const Services = lazy(() => import('./pages/Services').then(module => ({ default: module.Services })));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails').then(module => ({ default: module.PropertyDetails })));
const ExperienceDetails = lazy(() => import('./pages/ExperienceDetails').then(module => ({ default: module.ExperienceDetails })));
const ServiceDetails = lazy(() => import('./pages/ServiceDetails').then(module => ({ default: module.ServiceDetails })));
const BookingRequest = lazy(() => import('./pages/BookingRequest').then(module => ({ default: module.BookingRequest })));
const SearchResults = lazy(() => import('./pages/SearchResults').then(module => ({ default: module.SearchResults })));
const ClientSpace = lazy(() => import('./pages/ClientSpace').then(module => ({ default: module.ClientSpace })));
const Messages = lazy(() => import('./pages/Messages').then(module => ({ default: module.Messages })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const TermsOfService = lazy(() => import('./pages/TermsOfService').then(module => ({ default: module.TermsOfService })));
const HowItWorks = lazy(() => import('./pages/HowItWorks').then(module => ({ default: module.HowItWorks })));
const CompanyInfo = lazy(() => import('./pages/CompanyInfo').then(module => ({ default: module.CompanyInfo })));
const HostOnboarding = lazy(() => import('./pages/HostOnboarding').then(module => ({ default: module.HostOnboarding })));
const Annonces = lazy(() => import('./pages/Annonces').then(module => ({ default: module.Annonces })));
const IdentityVerification = lazy(() => import('./pages/IdentityVerification').then(module => ({ default: module.IdentityVerification })));
const EditListing = lazy(() => import('./pages/EditListing').then(module => ({ default: module.EditListing })));
const PhoneVerification = lazy(() => import('./pages/PhoneVerification').then(module => ({ default: module.PhoneVerification })));
const ExperienceOnboarding = lazy(() => import('./pages/ExperienceOnboarding').then(module => ({ default: module.ExperienceOnboarding })));
const ServiceCreationFlow = lazy(() => import('./pages/ServiceCreationFlow').then(module => ({ default: module.ServiceCreationFlow })));
const HelpCenter = lazy(() => import('./pages/HelpCenter').then(module => ({ default: module.HelpCenter })));
const AirCover = lazy(() => import('./pages/AirCover').then(module => ({ default: module.AirCover })));
const AntiDiscrimination = lazy(() => import('./pages/AntiDiscrimination').then(module => ({ default: module.AntiDiscrimination })));
const CancellationPolicy = lazy(() => import('./pages/CancellationPolicy').then(module => ({ default: module.CancellationPolicy })));
const NeighborIssues = lazy(() => import('./pages/NeighborIssues').then(module => ({ default: module.NeighborIssues })));
const Newsroom = lazy(() => import('./pages/Newsroom').then(module => ({ default: module.Newsroom })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
const AdminFraud = lazy(() => import('./pages/AdminFraud').then(module => ({ default: module.AdminFraud })));
const AdminClients = lazy(() => import('./pages/AdminClients').then(module => ({ default: module.AdminClients })));
const AdminHosts = lazy(() => import('./pages/AdminHosts').then(module => ({ default: module.AdminHosts })));
const AdminDisputes = lazy(() => import('./pages/AdminDisputes').then(module => ({ default: module.AdminDisputes })));
const AdminProperties = lazy(() => import('./pages/AdminProperties').then(module => ({ default: module.AdminProperties })));
const AdminReservations = lazy(() => import('./pages/AdminReservations').then(module => ({ default: module.AdminReservations })));
const AdminPayments = lazy(() => import('./pages/AdminPayments').then(module => ({ default: module.AdminPayments })));
const AdminRefunds = lazy(() => import('./pages/AdminRefunds').then(module => ({ default: module.AdminRefunds })));

export default function App() {
  const [currentPage, setCurrentPage] = useState<'logements' | 'experiences' | 'services' | 'property-details' | 'experience-details' | 'service-details' | 'booking-request' | 'search-results' | 'client-space' | 'messages' | 'privacy' | 'terms' | 'how-it-works' | 'company-info' | 'host-onboarding' | 'annonces' | 'verification-points' | 'identity-verification' | 'edit-listing' | 'phone-verification' | 'experience-onboarding' | 'service-creation' | 'help-center' | 'air-cover' | 'anti-discrimination' | 'cancellation-policy' | 'neighbor-issues' | 'newsroom' | 'admin-dashboard' | 'admin-fraud' | 'admin-clients' | 'admin-hosts' | 'admin-disputes' | 'admin-properties' | 'admin-reservations' | 'admin-payments' | 'admin-refunds'>('logements');
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

  const handleNavigate = (page: 'logements' | 'experiences' | 'services' | 'property-details' | 'experience-details' | 'service-details' | 'booking-request' | 'search-results' | 'client-space' | 'messages' | 'privacy' | 'terms' | 'how-it-works' | 'company-info' | 'host-onboarding' | 'annonces' | 'verification-points' | 'identity-verification' | 'edit-listing' | 'phone-verification' | 'experience-onboarding' | 'service-creation' | 'help-center' | 'air-cover' | 'anti-discrimination' | 'cancellation-policy' | 'neighbor-issues' | 'newsroom' | 'admin-dashboard' | 'admin-fraud' | 'admin-clients' | 'admin-hosts' | 'admin-disputes' | 'admin-properties' | 'admin-reservations' | 'admin-payments' | 'admin-refunds', data?: any) => {
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

  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        {currentPage !== 'property-details' && currentPage !== 'experience-details' && currentPage !== 'service-details' && currentPage !== 'booking-request' && currentPage !== 'search-results' && currentPage !== 'client-space' && currentPage !== 'messages' && currentPage !== 'privacy' && currentPage !== 'terms' && currentPage !== 'how-it-works' && currentPage !== 'company-info' && currentPage !== 'host-onboarding' && currentPage !== 'annonces' && currentPage !== 'verification-points' && currentPage !== 'identity-verification' && currentPage !== 'edit-listing' && currentPage !== 'phone-verification' && currentPage !== 'experience-onboarding' && currentPage !== 'service-creation' && currentPage !== 'help-center' && currentPage !== 'air-cover' && currentPage !== 'anti-discrimination' && currentPage !== 'cancellation-policy' && currentPage !== 'neighbor-issues' && currentPage !== 'newsroom' && currentPage !== 'admin-dashboard' && currentPage !== 'admin-fraud' && currentPage !== 'admin-clients' && currentPage !== 'admin-hosts' && currentPage !== 'admin-disputes' && currentPage !== 'admin-properties' && currentPage !== 'admin-reservations' && currentPage !== 'admin-payments' && currentPage !== 'admin-refunds' && (
          <Header 
            ref={headerRef} 
            currentPage={currentPage} 
            onNavigate={handleNavigate} 
            isScrolled={isScrolled} 
            onSearch={handleSearch}
            onClientSpaceClick={() => handleNavigate('client-space')}
            isHost={isHost}
          />
        )}
        
        <Suspense fallback={<PageLoader />}>
          {currentPage === 'logements' && <Home isScrolled={isScrolled} onPropertyClick={() => handleNavigate('property-details')} onSearch={handleSearch} />}
          {currentPage === 'experiences' && <Experiences isScrolled={isScrolled} onExperienceClick={() => handleNavigate('experience-details')} />}
          {currentPage === 'services' && <Services isScrolled={isScrolled} onServiceClick={() => handleNavigate('service-details')} />}
          {currentPage === 'property-details' && <PropertyDetails onBack={handleBackToHome} onBook={(data: any) => handleNavigate('booking-request', data)} />}
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
          {currentPage === 'service-creation' && <ServiceCreationFlow onNavigate={handleNavigate} />}
          {currentPage === 'help-center' && <HelpCenter onNavigate={handleNavigate} />}
          {currentPage === 'air-cover' && <AirCover onNavigate={handleNavigate} />}
          {currentPage === 'anti-discrimination' && <AntiDiscrimination onNavigate={handleNavigate} />}
          {currentPage === 'cancellation-policy' && <CancellationPolicy onNavigate={handleNavigate} />}
          {currentPage === 'neighbor-issues' && <NeighborIssues onNavigate={handleNavigate} />}
          {currentPage === 'newsroom' && <Newsroom onNavigate={handleNavigate} />}
          {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
          {currentPage === 'admin-fraud' && <AdminFraud onNavigate={handleNavigate} />}
          {currentPage === 'admin-clients' && <AdminClients onNavigate={handleNavigate} />}
          {currentPage === 'admin-hosts' && <AdminHosts onNavigate={handleNavigate} />}
          {currentPage === 'admin-disputes' && <AdminDisputes onNavigate={handleNavigate} />}
          {currentPage === 'admin-properties' && <AdminProperties onNavigate={handleNavigate} />}
          {currentPage === 'admin-reservations' && <AdminReservations onNavigate={handleNavigate} />}
          {currentPage === 'admin-payments' && <AdminPayments onNavigate={handleNavigate} />}
          {currentPage === 'admin-refunds' && <AdminRefunds onNavigate={handleNavigate} />}
        </Suspense>
        
        {currentPage !== 'property-details' && currentPage !== 'experience-details' && currentPage !== 'service-details' && currentPage !== 'booking-request' && currentPage !== 'search-results' && currentPage !== 'client-space' && currentPage !== 'messages' && currentPage !== 'privacy' && currentPage !== 'terms' && currentPage !== 'how-it-works' && currentPage !== 'company-info' && currentPage !== 'host-onboarding' && currentPage !== 'annonces' && currentPage !== 'verification-points' && currentPage !== 'identity-verification' && currentPage !== 'edit-listing' && currentPage !== 'phone-verification' && currentPage !== 'experience-onboarding' && currentPage !== 'service-creation' && currentPage !== 'help-center' && currentPage !== 'air-cover' && currentPage !== 'anti-discrimination' && currentPage !== 'cancellation-policy' && currentPage !== 'neighbor-issues' && currentPage !== 'newsroom' && currentPage !== 'admin-dashboard' && currentPage !== 'admin-fraud' && currentPage !== 'admin-clients' && currentPage !== 'admin-hosts' && currentPage !== 'admin-disputes' && currentPage !== 'admin-properties' && currentPage !== 'admin-reservations' && currentPage !== 'admin-payments' && currentPage !== 'admin-refunds' && <Footer onNavigate={handleNavigate} />}
        <Toaster position="bottom-center" />
      </div>
    </AuthProvider>
  );
}
