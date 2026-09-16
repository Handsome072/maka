'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { AuthShell } from "@/app/components/AuthShell";
import { EmailEntryView } from "@/app/components/EmailEntryView";

function signupErrorMessage(err: any): string {
  if (err?.status === 422) {
    return "Veuillez entrer une adresse e-mail valide.";
  }
  return "Impossible d'envoyer l'e-mail pour le moment. Réessayez dans quelques instants.";
}

export default function InscriptionPage() {
  const router = useRouter();
  const { requestSignup, loginWithUser, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Adresse pré-remplie en revenant de « Modifier l'adresse e-mail »
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("email");
    if (initial) setEmail(initial);
  }, []);

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

  const handleContinue = async () => {
    setError(null);
    setIsSending(true);
    try {
      const sentTo = await requestSignup(email.trim());
      router.push(`/check-email?email=${encodeURIComponent(sentTo)}`);
    } catch (err: any) {
      setError(signupErrorMessage(err));
      setIsSending(false);
    }
  };

  return (
    <AuthShell>
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">Inscription</h1>

      <EmailEntryView
        email={email}
        setEmail={(value) => {
          setEmail(value);
          if (error) setError(null);
        }}
        onContinue={handleContinue}
        onSocialLogin={handleSocialLogin}
        isLoading={isSending}
        error={error}
      />

      <div className="text-center mt-8">
        <span className="text-sm text-gray-500">
          Déjà un compte ?{" "}
          <button
            type="button"
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
    </AuthShell>
  );
}
