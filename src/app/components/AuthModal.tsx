import { X, ChevronLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { EmailEntryView } from "./EmailEntryView";
import { StandardLoginView } from "./StandardLoginView";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = "email-entry" | "login" | "forgot-password";

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { login, loginWithUser, requestSignup, error, clearError, isLoading } = useAuth();

  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [signupSending, setSignupSending] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

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
      setSignupSending(false);
      setSignupError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = async (userEmail: string, password: string) => {
    try {
      clearError();
      await login(userEmail, password);
      onClose();
    } catch {
      // Error is handled by context and shown in the login view
    }
  };

  const handleSocialLogin = (provider: string) => {
    // For now, use mock data for social login (same as the login and signup pages)
    // TODO: Implement real OAuth flow
    loginWithUser({
      name: `${provider} User`,
      email: `user@${provider}.com`,
      avatar: undefined,
    });
    onClose();
  };

  // Même parcours que la page d'inscription : envoi du lien, puis écran « Consultez votre boîte mail »
  const handleSignupRequest = async () => {
    setSignupError(null);
    setSignupSending(true);
    try {
      const sentTo = await requestSignup(email.trim());
      onClose();
      router.push(`/check-email?email=${encodeURIComponent(sentTo)}`);
    } catch (err: any) {
      setSignupError(
        err?.status === 422
          ? "Veuillez entrer une adresse e-mail valide."
          : "Impossible d'envoyer l'e-mail pour le moment. Réessayez dans quelques instants.",
      );
      setSignupSending(false);
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case "email-entry":
        return "Inscription";
      case "login":
        return "Connexion";
      case "forgot-password":
        return "Réinitialiser le mot de passe";
      default:
        return "";
    }
  };

  const showBackButton = currentView === "email-entry";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Overlay background */}
      <div className="absolute inset-0 bg-black/50 transition-opacity" />

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
              onGoogleLogin={() => handleSocialLogin("google")}
              onSignupClick={() => {
                clearError();
                setCurrentView("email-entry");
              }}
              onForgotPasswordClick={() => {
                onClose();
                router.push("/login?forgot=1");
              }}
              isLoading={isLoading}
              error={error}
            />
          )}

          {currentView === "email-entry" && (
            <EmailEntryView
              email={email}
              setEmail={(value) => {
                setEmail(value);
                if (signupError) setSignupError(null);
              }}
              onContinue={handleSignupRequest}
              onSocialLogin={handleSocialLogin}
              isLoading={signupSending}
              error={signupError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
