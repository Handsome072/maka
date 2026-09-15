import { useState } from "react";

interface EmailSignupViewProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  receiveMarketing: boolean;
  setReceiveMarketing: (value: boolean) => void;
  onAccept: () => void | Promise<void>;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const labelClass = "block text-sm font-medium text-gray-900 mb-1.5";
const inputClass = "w-full h-12 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-gray-900 transition-colors placeholder:text-gray-400";
const termsLinkClass = "text-xs text-left text-blue-600 underline hover:text-blue-700";

export function EmailSignupView({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  birthDate,
  setBirthDate,
  email,
  setEmail,
  receiveMarketing,
  setReceiveMarketing,
  onAccept,
  onBack,
  isLoading = false,
  error = null,
}: EmailSignupViewProps) {
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAccept = async () => {
    if (!validateEmail(email)) {
      setEmailError("Veuillez entrer une adresse e-mail valide.");
      return;
    }
    setEmailError("");
    await onAccept();
  };

  const isFormValid = firstName && lastName && email;

  return (
    <>
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Official name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="signup-first-name" className={labelClass}>
            Prénom
          </label>
          <input
            id="signup-first-name"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="signup-last-name" className={labelClass}>
            Nom
          </label>
          <input
            id="signup-last-name"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Birth date and email */}
      <div className="grid gap-3 mt-3 sm:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
        <div>
          <label htmlFor="signup-birth-date" className={labelClass}>
            Date de naissance
          </label>
          <input
            id="signup-birth-date"
            type="date"
            autoComplete="bday"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="signup-email" className={labelClass}>
            Adresse e-mail
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
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
        </div>
      </div>

      {emailError && (
        <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{emailError}</span>
        </div>
      )}

      {/* Helper Text */}
      <p className="mt-2 text-xs text-gray-500 leading-relaxed">
        Nom tel qu'indiqué sur votre pièce d'identité. 18 ans minimum&nbsp;; votre date de naissance reste privée. Un e-mail de vérification vous sera envoyé.
      </p>

      {/* Marketing Checkbox */}
      <label className="mt-4 flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={!receiveMarketing}
          onChange={(e) => setReceiveMarketing(!e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
        />
        <span className="text-xs text-gray-600 leading-relaxed">
          Je ne souhaite pas recevoir d'offres, d'idées de voyage ni de messages promotionnels de Séjoura (modifiable à tout moment dans mon compte).
        </span>
      </label>

      {/* Accept Button */}
      <button
        onClick={handleAccept}
        disabled={!isFormValid || isLoading}
        className="mt-5 w-full h-12 bg-black text-white rounded-xl font-semibold text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Inscription en cours..." : "Accepter et continuer"}
      </button>

      {/* Terms and Conditions */}
      <p className="mt-4 text-xs text-gray-500 leading-relaxed">
        En cliquant sur{' '}
        <span className="font-semibold text-gray-700">Accepter et continuer</span>, j'accepte les{' '}
        <button type="button" className={termsLinkClass}>
          Conditions générales
        </button>
        , les{' '}
        <button type="button" className={termsLinkClass}>
          Conditions de service relatives aux paiements
        </button>
        , la{' '}
        <button type="button" className={termsLinkClass}>
          Politique de non-discrimination
        </button>
        {' '}et je reconnais avoir pris connaissance de la{' '}
        <button type="button" className={termsLinkClass}>
          Politique de confidentialité de Séjoura
        </button>
        .
      </p>
    </>
  );
}
