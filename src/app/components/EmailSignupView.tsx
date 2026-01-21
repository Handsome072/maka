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
      <div className="space-y-5 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Prénom
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Nom
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Date de naissance
          </label>
          <input
            type="text"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            placeholder="JJ/MM/AAAA"
            className="w-full h-12 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Adresse e-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl border border-gray-200 px-4 text-base focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 rounded-xl border border-gray-200 px-4 pr-12 text-base focus:outline-none focus:border-gray-900 focus:ring-0 transition-all placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {password && passwordErrors.length > 0 && (
        <div className="mb-6 space-y-2">
          {passwordErrors.map((error, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`text-xs ${error.valid ? 'text-green-600' : 'text-gray-300'}`}>
                {error.valid ? '✓' : '○'}
              </span>
              <span className={`text-xs ${error.valid ? 'text-green-600' : 'text-gray-500'}`}>
                {error.text}
              </span>
            </div>
          ))}
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer mb-8">
        <input
          type="checkbox"
          checked={!receiveMarketing}
          onChange={(e) => setReceiveMarketing(!e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
        />
        <span className="text-xs text-gray-600 leading-snug">
          Je ne souhaite pas recevoir d'e-mails promotionnels
        </span>
      </label>

      <p className="text-xs text-gray-500 mb-8 leading-relaxed">
        En cliquant sur Créer un compte, vous acceptez nos{' '}
        <button className="text-black underline hover:text-gray-700 font-medium">
          CGU
        </button>
        {' '}et notre{' '}
        <button className="text-black underline hover:text-gray-700 font-medium">
          Politique de confidentialité
        </button>
        .
      </p>

      <button
        onClick={onAccept}
        disabled={!isPasswordValid}
        className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none"
      >
        Créer un compte
      </button>
    </>
  );
}