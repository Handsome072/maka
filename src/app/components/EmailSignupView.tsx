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

      {/* Official Name Label */}
      <div className="mb-8">
        <p className="text-base mb-4" style={{ fontWeight: 600 }}>
          Nom officiel
        </p>

        {/* First Name Input */}
        <div className="mb-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom sur la pièce d'identité"
            className="w-full h-16 rounded-xl border border-gray-300 px-4 text-base focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        {/* Last Name Input */}
        <div className="mb-3">
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Nom sur la pièce d'identité"
            className="w-full h-16 rounded-xl border border-gray-300 px-4 text-base focus:outline-none focus:border-gray-900 transition-colors"
          />
        </div>

        {/* Helper Text */}
        <p className="text-sm text-gray-600 leading-relaxed">
          Assurez-vous que le nom correspond à celui qui figure sur votre pièce d'identité.
        </p>
      </div>

      {/* Birth Date */}
      <div className="mb-8">
        <p className="text-base mb-4" style={{ fontWeight: 600 }}>
          Date de naissance
        </p>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          className="w-full h-16 rounded-xl border border-gray-300 px-4 text-base focus:outline-none focus:border-gray-900 transition-colors"
        />
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          Vous devez avoir au moins 18 ans pour vous inscrire. Nous n'indiquerons pas la date de votre anniversaire aux autres utilisateurs Homiqio.
        </p>
      </div>

      {/* Email */}
      <div className="mb-8">
        <p className="text-base mb-4" style={{ fontWeight: 600 }}>
          Coordonnées
        </p>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError("");
          }}
          placeholder="Adresse e-mail"
          className={`w-full h-16 rounded-xl border px-4 text-base focus:outline-none focus:ring-0 transition-all ${
            emailError 
              ? "border-red-500 focus:border-red-500 bg-red-50" 
              : "border-gray-300 focus:border-gray-900"
          }`}
        />
        {emailError && (
          <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{emailError}</span>
          </div>
        )}
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          Nous vous enverrons un e-mail de vérification pour confirmer votre adresse.
        </p>
      </div>

      {/* Terms and Conditions */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-700 leading-relaxed">
          En cliquant sur{' '}
          <span style={{ fontWeight: 600 }}>Accepter et continuer</span>, j'accepte les{' '}
          <button className="text-blue-600 underline hover:text-blue-700">
            Conditions générales
          </button>
          , les{' '}
          <button className="text-blue-600 underline hover:text-blue-700">
            Conditions de service relatives aux paiements
          </button>
          , la{' '}
          <button className="text-blue-600 underline hover:text-blue-700">
            Politique de non-discrimination
          </button>
          {' '}et je reconnais avoir pris connaissance de la{' '}
          <button className="text-blue-600 underline hover:text-blue-700">
            Politique de confidentialité d'Homiqio
          </button>
          .
        </p>
      </div>

      {/* Accept Button */}
      <button
        onClick={handleAccept}
        disabled={!isFormValid || isLoading}
        className="w-full rounded-xl text-white text-base py-4 hover:opacity-90 transition-opacity mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#000000",
          fontWeight: 600,
        }}
      >
        {isLoading ? "Inscription en cours..." : "Accepter et continuer"}
      </button>

      {/* Marketing Checkbox */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Homiqio vous enverra des offres réservées aux membres, des idées de voyages, des e-mails promotionnels et des notifications push. Vous pouvez désactiver cette option à tout moment dans les paramètres de votre compte ou directement à partir de la notification promotionnelle.
        </p>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!receiveMarketing}
            onChange={(e) => setReceiveMarketing(!e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            Je ne souhaite pas recevoir de messages promotionnels d'Homiqio.
          </span>
        </label>
      </div>
    </>
  );
}
