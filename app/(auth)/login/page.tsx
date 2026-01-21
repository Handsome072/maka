'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { EmailEntryView } from "@/app/components/EmailEntryView";
import { EmailSignupView } from "@/app/components/EmailSignupView";
import { StandardLoginView } from "@/app/components/StandardLoginView";

type AuthView = "email-entry" | "signup" | "login" | "forgot-password";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(true);

  const handleLogin = (userEmail: string) => {
    login({
      name: "User",
      email: userEmail,
      avatar: undefined,
    });
    router.push("/");
  };

  const handleGoogleLogin = () => {
    login({
      name: "Google User",
      email: "user@gmail.com",
      avatar: undefined,
    });
    router.push("/");
  };

  const handleSocialLogin = (provider: string) => {
    login({
      name: `${provider} User`,
      email: `user@${provider}.com`,
      avatar: undefined,
    });
    router.push("/");
  };

  const handleSignupComplete = () => {
    login({
      name: `${firstName} ${lastName}`,
      email: email,
      avatar: undefined,
    });
    router.push("/");
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {showBackButton ? (
            <button
              onClick={() => setCurrentView("login")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
              aria-label="Back"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          ) : (
            <button
              onClick={() => router.push("/")}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all"
              aria-label="Back to home"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          <h1 className="text-xl font-semibold text-gray-900">{getTitle()}</h1>
          
          <div className="w-10" />
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl shadow-lg p-8">
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
            <div className="flex flex-col">
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

              <div className="pt-6 border-t border-gray-100 text-center">
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

