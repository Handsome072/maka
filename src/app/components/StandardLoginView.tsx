import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface StandardLoginViewProps {
    onLogin: (email: string) => void;
    onGoogleLogin: () => void;
    onSignupClick: () => void;
    onForgotPasswordClick: () => void;
}

export function StandardLoginView({
    onLogin,
    onGoogleLogin,
    onSignupClick,
    onForgotPasswordClick,
}: StandardLoginViewProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        if (email && password) {
            onLogin(email);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="mb-8">
                <h3 className="text-[22px] font-semibold text-gray-900 mb-2">
                    Connexion
                </h3>
                <p className="text-gray-500 text-sm">
                    Bon retour sur HOMIQIO.
                </p>
            </div>

            {/* Form Section */}
            <div className="space-y-4 mb-6">
                <div>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Adresse e-mail"
                        className="w-full h-14 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-black transition-colors bg-gray-50/50"
                    />
                </div>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mot de passe"
                        className="w-full h-14 rounded-xl border border-gray-200 px-4 pr-12 text-base focus:outline-none focus:border-black transition-colors bg-gray-50/50"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={onForgotPasswordClick}
                    className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition-colors"
                >
                    Mot de passe oublié ?
                </button>
            </div>

            {/* Actions */}
            <button
                onClick={handleSubmit}
                className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors mb-6"
            >
                Se connecter
            </button>

            {/* Divider */}
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 bg-white">ou continuer avec</span>
                </div>
            </div>

            {/* Social Login - Google Only (Prominent) */}
            <button
                onClick={onGoogleLogin}
                className="w-full h-14 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors mb-8 group"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" className="transition-transform group-hover:scale-110">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span className="text-gray-700 font-medium">Google</span>
            </button>

            {/* Footer - Sign Up */}
            <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-600 text-sm">
                    Pas encore de compte ?{" "}
                    <button
                        onClick={onSignupClick}
                        className="text-black font-semibold hover:underline"
                    >
                        S'inscrire
                    </button>
                </p>
            </div>
        </div>
    );
}
