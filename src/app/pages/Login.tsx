import { X, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EmailSignupView } from "../components/EmailSignupView";
import { StandardLoginView } from "../components/StandardLoginView";

interface LoginProps {
    onNavigate: (page: any) => void;
}

type AuthStep = 'login' | 'signup' | 'forgot-password';

export function Login({ onNavigate }: LoginProps) {
    const [authStep, setAuthStep] = useState<AuthStep>('login');

    // Signup fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [receiveMarketing, setReceiveMarketing] = useState(false);

    const { login } = useAuth();

    const handleStandardLogin = (loginEmail: string) => {
        login({
            name: "Utilisateur",
            email: loginEmail,
        });
        onNavigate('logements');
    };

    const handleSocialLogin = () => {
        login({
            name: "Utilisateur",
            email: `user@google.com`,
        });
        onNavigate('logements');
    };

    const handleSignup = () => {
        login({
            name: `${firstName} ${lastName}`,
            email: email,
        });
        onNavigate('logements');
    };

    const handleBack = () => {
        if (authStep === 'signup') {
            setAuthStep('login');
        } else if (authStep === 'forgot-password') {
            setAuthStep('login');
        } else {
            onNavigate('logements');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-[568px] w-full flex flex-col bg-white rounded-3xl shadow-lg border border-gray-100">
                {/* Header */}
                <div className="px-6 py-4 flex items-center justify-between min-h-[64px]">
                    <button
                        onClick={authStep === 'login' ? () => onNavigate('logements') : handleBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
                    >
                        {authStep === 'login' ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                    <h2 className="text-base font-semibold">
                        {authStep === 'signup' ? 'Inscription' : authStep === 'forgot-password' ? 'Mot de passe oublié' : 'Connexion'}
                    </h2>
                    <div className="w-8"></div>
                </div>

                {/* Content */}
                <div className="px-6 py-6">
                    {/* Login View */}
                    {authStep === 'login' && (
                        <StandardLoginView
                            onLogin={handleStandardLogin}
                            onGoogleLogin={handleSocialLogin}
                            onSignupClick={() => setAuthStep('signup')}
                            onForgotPasswordClick={() => setAuthStep('forgot-password')}
                        />
                    )}

                    {/* Signup View */}
                    {authStep === 'signup' && (
                        <EmailSignupView
                            firstName={firstName}
                            setFirstName={setFirstName}
                            lastName={lastName}
                            setLastName={setLastName}
                            birthDate={birthDate}
                            setBirthDate={setBirthDate}
                            email={email}
                            setEmail={setEmail}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            receiveMarketing={receiveMarketing}
                            setReceiveMarketing={setReceiveMarketing}
                            onAccept={handleSignup}
                            onBack={handleBack}
                        />
                    )}

                    {/* Forgot Password View (Placeholder) */}
                    {authStep === 'forgot-password' && (
                        <div className="text-center py-8">
                            <p className="text-gray-600 mb-6">
                                Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                            </p>
                            <input
                                type="email"
                                placeholder="Adresse e-mail"
                                className="w-full h-14 rounded-xl border border-gray-200 px-4 mb-4 text-base bg-gray-50/50"
                            />
                            <button
                                onClick={() => setAuthStep('login')}
                                className="w-full bg-black text-white h-14 rounded-xl font-semibold"
                            >
                                Envoyer le lien
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
