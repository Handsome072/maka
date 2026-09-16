import { useState } from "react";

interface EmailEntryViewProps {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void | Promise<void>;
  onSocialLogin: (provider: string) => void;
  onPhoneLogin?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function EmailEntryView({
  email,
  setEmail,
  onContinue,
  onSocialLogin,
  isLoading = false,
  error = null,
}: EmailEntryViewProps) {
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;
    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    setEmailError("");
    await onContinue();
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-gray-500 text-base mb-6">
        Saisissez votre adresse e-mail&nbsp;: nous vous envoyons un lien pour continuer votre inscription.
      </p>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-900 mb-2">
          Adresse e-mail
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          className={`w-full h-12 rounded-xl border px-4 text-base focus:outline-none focus:ring-0 transition-all placeholder:text-gray-400 ${
            emailError
              ? "border-red-500 focus:border-red-500 bg-red-50"
              : "border-gray-200 focus:border-gray-900"
          }`}
        />
        {emailError && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{emailError}</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2 mb-6">
        Le lien reçu est valable 24&nbsp;heures.{" "}
        <a href="/privacy/" target="_blank" rel="noopener noreferrer" className="text-xs underline font-medium text-gray-700 hover:text-black transition-colors">
          Confidentialité
        </a>
      </p>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? "Envoi en cours…" : "Recevoir mon lien d'inscription"}
      </button>

      <button
        type="button"
        onClick={() => onSocialLogin('google')}
        className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-sm text-gray-700 font-medium">Continuer avec Google</span>
      </button>
    </form>
  );
}
