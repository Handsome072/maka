import { Search, Heart, User, MessageSquare, PlusCircle } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

interface MobileNavProps {
    onSearchClick?: () => void;
    onFavoritesClick?: () => void;
    onLoginClick?: () => void;
    onProfileClick?: () => void;
    onMessagesClick?: () => void;
    onBecomeHostClick?: () => void;
}

export function MobileNav({
    onSearchClick,
    onFavoritesClick,
    onLoginClick,
    onProfileClick,
    onMessagesClick,
    onBecomeHostClick
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
                    className="flex flex-col items-center gap-1 px-1 py-2 text-[#E91E63] transition-colors min-w-[60px]"
                >
                    <Search className="w-5 h-5" />
                    <span className="text-[10px] font-medium truncate w-full text-center">Explorer</span>
                </button>

                <button
                    type="button"
                    onClick={onFavoritesClick}
                    className="flex flex-col items-center gap-1 px-1 py-2 text-gray-500 hover:text-gray-700 transition-colors min-w-[60px]"
                >
                    <Heart className="w-5 h-5" />
                    <span className="text-[10px] font-medium truncate w-full text-center">Favoris</span>
                </button>

                <button
                    type="button"
                    onClick={onBecomeHostClick}
                    className="flex flex-col items-center gap-1 px-1 py-2 text-gray-500 hover:text-gray-700 transition-colors min-w-[60px]"
                >
                    <PlusCircle className="w-5 h-5" />
                    <span className="text-[10px] font-medium truncate w-full text-center">Devenir hôte</span>
                </button>

                {user ? (
                    <>
                        <button
                            type="button"
                            onClick={onMessagesClick}
                            className="flex flex-col items-center gap-1 px-1 py-2 text-gray-500 hover:text-gray-700 transition-colors min-w-[60px]"
                        >
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-[10px] font-medium truncate w-full text-center">Messages</span>
                        </button>

                        <button
                            type="button"
                            onClick={onProfileClick}
                            className="flex flex-col items-center gap-1 px-1 py-2 text-gray-500 hover:text-gray-700 transition-colors min-w-[60px]"
                        >
                            <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center bg-gray-900 text-white text-xs flex-shrink-0" style={{ fontWeight: 600 }}>
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0).toUpperCase()
                                )}
                            </div>
                            <span className="text-[10px] font-medium truncate w-full text-center">Profil</span>
                        </button>
                    </>
                ) : (
                    <button
                        type="button"
                        onClick={onLoginClick}
                        className="flex flex-col items-center gap-1 px-1 py-2 text-gray-500 hover:text-gray-700 transition-colors min-w-[60px]"
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[10px] font-medium truncate w-full text-center">Connexion</span>
                    </button>
                )}
            </div>
        </nav>
    );
}
