import { ChevronLeft, Eye, EyeOff } from 'lucide-react';

interface EmailSignupViewProps {
  firstName: string;
  setFirstName: (value: string) => void;
  lastName: string;
  setLastName: (value: string) => void;
  birthDate: string;
  setBirthDate: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  receiveMarketing: boolean;
  setReceiveMarketing: (value: boolean) => void;
  onAccept: () => void;
  onBack: () => void;
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
  password,
  setPassword,
  showPassword,
  setShowPassword,
  receiveMarketing,
  setReceiveMarketing,
  onAccept,
  onBack
}: EmailSignupViewProps) {
  // Validate password
  const passwordErrors = password ? [
    { valid: password.length >= 8, text: "Au moins 8 caractères" },
    { valid: !/\s/.test(password), text: "Ne doit pas contenir votre nom ni votre adresse e-mail" },
    { valid: /[A-Z]/.test(password) || /[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password), text: "Faiblesse du mot de passe : faible" },
    { valid: /[0-9]/.test(password) || /[^a-zA-Z0-9]/.test(password), text: "Contient un chiffre ou un symbole" }
  ] : [];

  const isPasswordValid = password.length >= 8;

  return (
    <>
      <div className="space-y-5 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            Prénom
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            Nom
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            Date de naissance
          </label>
          <input
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="JJ/MM/AAAA"
            className="w-full h-11 rounded-lg border border-gray-300 px-3.5 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
          />
        </div>

        <div>
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

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1.5">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 px-3.5 pr-11 text-sm focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {password && passwordErrors.length > 0 && (
        <div className="mb-6 space-y-1">
          {passwordErrors.map((error, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`text-xs ${error.valid ? 'text-green-600' : 'text-gray-400'}`}>
                {error.valid ? '✓' : '○'}
              </span>
              <span className={`text-xs ${error.valid ? 'text-green-600' : 'text-gray-500'}`}>
                {error.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-start gap-2.5 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={!receiveMarketing}
          onChange={(e) => setReceiveMarketing(!e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-0 focus:ring-offset-0"
        />
        <span className="text-xs text-gray-600">
          Je ne souhaite pas recevoir d'e-mails promotionnels
        </span>
      </label>

      <p className="text-xs text-gray-500 mb-6 leading-relaxed">
        En cliquant sur Créer un compte, vous acceptez nos{' '}
        <button className="text-gray-900 underline hover:text-gray-700 font-medium">
          CGU
        </button>
        {' '}et notre{' '}
        <button className="text-gray-900 underline hover:text-gray-700 font-medium">
          Politique de confidentialité
        </button>
        .
      </p>

      <button
        onClick={onAccept}
        disabled={!isPasswordValid}
        className="w-full bg-black text-white h-11 rounded-lg font-semibold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        Créer un compte
      </button>
    </>
  );
}