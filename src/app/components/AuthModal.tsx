import { X, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { EmailEntryView } from "./EmailEntryView";
import { EmailSignupView } from "./EmailSignupView";
import { StandardLoginView } from "./StandardLoginView";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "email-entry" | "signup" | "login" | "forgot-password";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const { login } = useAuth();
  
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentView("login");
      setEmail("");
      setFirstName("");
      setLastName("");
      setBirthDate("");
      setPassword("");
      setShowPassword(false);
      setReceiveMarketing(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (userEmail: string) => {
    login({
      name: "User",
      email: userEmail,
      avatar: undefined,
    });
    onClose();
  };

  const handleGoogleLogin = () => {
    login({
      name: "Google User",
      email: "user@gmail.com",
      avatar: undefined,
    });
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    login({
      name: `${provider} User`,
      email: `user@${provider}.com`,
      avatar: undefined,
    });
    onClose();
  };

  const handleSignupComplete = () => {
    login({
      name: `${firstName} ${lastName}`,
      email: email,
      avatar: undefined,
    });
    onClose();
  };

  const getTitle = () => {
    switch (currentView) {
      case "email-entry":
        return "Bienvenue sur HOMIQIO";
      case "signup":
        return "Terminer l'inscription";
      case "login":
        return "Connexion";
      case "forgot-password":
        return "Réinitialiser le mot de passe";
      default:
        return "";
    }
  };

  const showBackButton = currentView === "signup" || currentView === "email-entry";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Overlay background */}
      <div className="absolute inset-0 bg-black/60 transition-opacity" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-3xl w-full max-w-xl mx-4 shadow-lg max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          {showBackButton ? (
            <button
              onClick={() => setCurrentView("login")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          
          <h2 className="text-base font-semibold text-gray-900">{getTitle()}</h2>
          
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {currentView === "login" && (
            <StandardLoginView
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSignupClick={() => setCurrentView("email-entry")}
              onForgotPasswordClick={() => setCurrentView("forgot-password")}
            />
          )}

          {currentView === "email-entry" && (
            <EmailEntryView
              email={email}
              setEmail={setEmail}
              onContinue={() => setCurrentView("signup")}
              onSocialLogin={handleSocialLogin}
              onPhoneLogin={() => {
                // Handle phone login
                console.log("Phone login clicked");
              }}
            />
          )}

          {currentView === "signup" && (
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
              onAccept={handleSignupComplete}
              onBack={() => setCurrentView("email-entry")}
            />
          )}

          {currentView === "forgot-password" && (
            <div className="flex flex-col h-full">
              <div className="mb-8">
                <h3 className="text-[22px] font-semibold text-gray-900 mb-2">
                  Réinitialiser votre mot de passe
                </h3>
                <p className="text-gray-500 text-sm">
                  Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse e-mail"
                  className="w-full h-14 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-black transition-colors bg-gray-50/50"
                />
              </div>

              <button
                onClick={() => {
                  // Handle password reset
                  console.log("Password reset for:", email);
                  setCurrentView("login");
                }}
                className="w-full bg-black text-white h-14 rounded-xl font-semibold text-base hover:bg-gray-800 transition-colors mb-6"
              >
                Envoyer le lien
              </button>

              <div className="mt-auto pt-6 border-t border-gray-100 text-center">
                <button
                  onClick={() => setCurrentView("login")}
                  className="text-black font-semibold hover:underline"
                >
                  Retour à la connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

