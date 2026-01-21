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
        return "Inscription";
      case "signup":
        return "Finaliser";
      case "login":
        return "Connexion";
      case "forgot-password":
        return "Récupération";
      default:
        return "";
    }
  };

  const showBackButton = currentView === "signup" || currentView === "email-entry";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {currentView === "login" ? (
            <StandardLoginView
              onLogin={handleLogin}
              onGoogleLogin={handleGoogleLogin}
              onSignupClick={() => setCurrentView("email-entry")}
              onForgotPasswordClick={() => setCurrentView("forgot-password")}
            />
          ) : (
            <>
              <div className="flex items-center mb-8">
                <button
                  onClick={() => currentView === "signup" ? setCurrentView("email-entry") : setCurrentView("login")}
                  className="mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Retour"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-900" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
              </div>

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
                  <p className="text-gray-500 text-sm mb-6">
                    Entrez votre adresse e-mail pour recevoir un lien de réinitialisation.
                  </p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                      Adresse e-mail
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
                    />
                  </div>

                  <button
                    onClick={() => {
                      console.log("Password reset for:", email);
                      setCurrentView("login");
                    }}
                    className="w-full bg-black text-white h-11 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors mb-6"
                  >
                    Envoyer le lien
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => setCurrentView("login")}
                      className="text-sm text-gray-900 font-semibold hover:underline transition-all"
                    >
                      Retour à la connexion
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

