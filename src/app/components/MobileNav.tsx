import { Search, Heart, User } from 'lucide-react';

interface MobileNavProps {
    onSearchClick?: () => void;
    onFavoritesClick?: () => void;
    onLoginClick?: () => void;
    isScrolled?: boolean;
}

export function MobileNav({
    onSearchClick,
    onFavoritesClick,
    onLoginClick,
    isScrolled = false
}: MobileNavProps) {
    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden transition-all duration-300"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
        >
            <div className="flex items-center justify-around py-2">
                <button
                    onClick={onSearchClick}
                    className="flex flex-col items-center gap-1 px-6 py-2 text-[#E91E63] transition-colors"
                >
                    <Search className={`w-6 h-6 transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0' : 'opacity-100'}`} />
                    <span className="text-xs font-medium">Explorer</span>
                </button>

                <button
                    onClick={onFavoritesClick}
                    className="flex flex-col items-center gap-1 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <Heart className={`w-6 h-6 transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0' : 'opacity-100'}`} />
                    <span className="text-xs font-medium">Favoris</span>
                </button>

                <button
                    onClick={onLoginClick}
                    className="flex flex-col items-center gap-1 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <User className={`w-6 h-6 transition-opacity duration-300 ${isScrolled ? 'opacity-0 h-0' : 'opacity-100'}`} />
                    <span className="text-xs font-medium">Connexion</span>
                </button>
            </div>
        </nav>
    );
}
