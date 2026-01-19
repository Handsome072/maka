import { Globe, Menu, User } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { ROUTES, NAV_ITEMS } from '../config/routes';

interface HeaderContentProps {
  currentPage: 'logements' | 'experiences' | 'services';
  onNavigate: (page: 'logements' | 'experiences' | 'services') => void;
  onGlobeClick?: () => void;
  onMenuClick?: () => void;
  onBecomeHostClick?: () => void;
  showMenuDropdown?: boolean;
  showLanguageModal?: boolean;
  MenuDropdownComponent?: React.ReactNode;
}

export function HeaderContent({
  currentPage,
  onNavigate,
  onGlobeClick,
  onMenuClick,
  onBecomeHostClick,
  MenuDropdownComponent,
}: HeaderContentProps) {
  const { user } = useAuth();

  return (
    <div className="flex-1">
      {/* Navigation centrale - visible pour S >= 768 */}
      <nav className="hidden md:flex items-center gap-8 justify-center">
        <Link
          href={ROUTES.HOME}
          className={`flex items-center gap-2 py-4 ${
            currentPage === 'logements'
              ? 'border-b-4 border-black'
              : ''
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 22V12H15V22"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm">Logements</span>
        </Link>
        <Link
          href={ROUTES.EXPERIENCES}
          className={`flex items-center gap-2 py-4 relative ${
            currentPage === 'experiences'
              ? 'border-b-4 border-black'
              : ''
          }`}
        >
          <div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span
              className="absolute -top-1 right-6 text-white text-[10px] px-1 rounded-full"
              style={{
                fontWeight: 600,
                background:
                  'linear-gradient(357.5deg, #3e567c 1.59%, #3a5475 21.23%, #2d3c5b 58.6%, #809dc0 97.4%)',
                borderRadius: '10px 10px 10px 2px',
              }}
            >
              NOUVEAU
            </span>
          </div>
          <span className="text-sm">Expériences</span>
        </Link>
        <Link
          href={ROUTES.SERVICES}
          className={`flex items-center gap-2 py-4 relative ${
            currentPage === 'services'
              ? 'border-b-4 border-black'
              : ''
          }`}
        >
          <div>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M9 3V21M15 3V21M3 9H21M3 15H21"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span
              className="absolute -top-1 right-0 text-white text-[10px] px-1"
              style={{
                fontWeight: 600,
                background:
                  'linear-gradient(357.5deg, #3e567c 1.59%, #3a5475 21.23%, #2d3c5b 58.6%, #809dc0 97.4%)',
                borderRadius: '10px 10px 10px 2px',
              }}
            >
              NOUVEAU
            </span>
          </div>
          <span className="text-sm">Services</span>
        </Link>
      </nav>
    </div>
  );
}