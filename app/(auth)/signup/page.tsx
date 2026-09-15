'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { AuthShell } from "@/app/components/AuthShell";
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
      const userEmail = await register({
        first_name: firstName,
        last_name: lastName,
        email: email,
        birth_date: birthDate || undefined,
        receive_marketing: receiveMarketing,
      });
      // Redirect to check-email page with the email
      router.push(`/check-email?email=${encodeURIComponent(userEmail)}`);
    } catch {
      // Error is handled by context
    }
  };

  const getTitle = () => {
    return "Inscription";
  };

  return (
    <AuthShell>
      <div className={`flex items-center ${currentView === "signup" ? "mb-5" : "mb-3"}`}>
        {currentView === "signup" && (
          <button
            onClick={() => setCurrentView("email-entry")}
            className="mr-3 -ml-1 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Retour"
          >
            <ChevronLeft className="w-6 h-6 text-gray-900" />
          </button>
        )}
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{getTitle()}</h1>
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
          <div className="text-center mt-8">
            <span className="text-sm text-gray-500">
              Déjà un compte ?{" "}
              <button
                onClick={() => {
                  clearError();
                  router.push("/login");
                }}
                className="text-sm text-black font-semibold hover:underline decoration-2 underline-offset-2 transition-all"
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
          receiveMarketing={receiveMarketing}
          setReceiveMarketing={setReceiveMarketing}
          onAccept={handleSignupComplete}
          onBack={() => setCurrentView("email-entry")}
          isLoading={isLoading}
          error={error}
        />
      )}
    </AuthShell>
  );
}
