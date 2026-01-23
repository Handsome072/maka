'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { EmailEntryView } from "@/app/components/EmailEntryView";
import { EmailSignupView } from "@/app/components/EmailSignupView";

type AuthView = "email-entry" | "signup";

export default function InscriptionPage() {
  const router = useRouter();
  const { register, loginWithUser, error, clearError, isLoading } = useAuth();

  const [currentView, setCurrentView] = useState<AuthView>("email-entry");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(true);

  const handleSocialLogin = (provider: string) => {
    // For now, use mock data for social login
    // TODO: Implement real OAuth flow
    loginWithUser({
      name: `${provider} User`,
      email: `user@${provider}.com`,
      avatar: undefined,
    });
    router.push("/");
  };

  const handleSignupComplete = async () => {
    try {
      clearError();
      await register({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        birth_date: birthDate || undefined,
        receive_marketing: receiveMarketing,
      });
      // Redirect to a verification pending page or home
      router.push("/");
    } catch {
      // Error is handled by context
    }
  };

  const getTitle = () => {
    return "Inscription";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-3xl p-10 md:p-12 shadow-lg border border-gray-100">
          <div className="flex items-center mb-8">
            {currentView === "signup" && (
              <button
                onClick={() => setCurrentView("email-entry")}
                className="mr-4 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Retour"
              >
                <ChevronLeft className="w-6 h-6 text-gray-900" />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          </div>

          {currentView === "email-entry" && (
            <>
              <EmailEntryView
                email={email}
                setEmail={setEmail}
                onContinue={() => setCurrentView("signup")}
                onSocialLogin={handleSocialLogin}
                onPhoneLogin={() => {
                  console.log("Phone login clicked");
                }}
              />
              <div className="text-center mt-6">
                <span className="text-sm text-gray-500">
                  Déjà un compte ?{" "}
                  <button
                    onClick={() => router.push("/login")}
                    className="text-black font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
                  >
                    Se connecter
                  </button>
                </span>
              </div>
            </>
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
              isLoading={isLoading}
              error={error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
