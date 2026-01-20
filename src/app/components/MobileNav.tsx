import { Search, Heart, User, MessageSquare } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

interface MobileNavProps {
    onSearchClick?: () => void;
    onFavoritesClick?: () => void;
    onLoginClick?: () => void;
    onProfileClick?: () => void;
    onMessagesClick?: () => void;
}

export function MobileNav({
    onSearchClick,
    onFavoritesClick,
    onLoginClick,
    onProfileClick,
    onMessagesClick
}: MobileNavProps) {
    const { user } = useAuth();

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden transition-all duration-300"
            style={{
                paddingBottom: 'env(safe-area-inset-bottom, 0px)'
            }}
        >
            <div className="flex items-center justify-around py-2">
                <button
                    type="button"
                    onClick={onSearchClick}
                    className="flex flex-col items-center gap-1 px-6 py-2 text-[#E91E63] transition-colors"
                >
                    <Search className="w-6 h-6" />
                    <span className="text-xs font-medium">Explorer</span>
                </button>

                <button
                    type="button"
                    onClick={onFavoritesClick}
                    className="flex flex-col items-center gap-1 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                    <Heart className="w-6 h-6" />
                    <span className="text-xs font-medium">Favoris</span>
                </button>

                {user ? (
                    <>
                        <button
                            type="button"
                            onClick={onMessagesClick}
                            className="flex flex-col items-center gap-1 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <MessageSquare className="w-6 h-6" />
                            <span className="text-xs font-medium">Messages</span>
                        </button>

                        <button
                            type="button"
                            onClick={onProfileClick}
                            className="flex flex-col items-center gap-1 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-[10px] font-bold text-gray-600">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </span>
                            <span className="text-xs font-medium">Profil</span>
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onLoginClick}
                        className="flex flex-col items-center gap-1 px-6 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <User className="w-6 h-6" />
                        <span className="text-xs font-medium">Connexion</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
