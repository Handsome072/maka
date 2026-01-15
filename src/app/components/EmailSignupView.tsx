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
          Assurez-vous que le nom correspond à celui qui figure sur votre pièce d'identité. Si vous utilisez un autre nom, vous pouvez{' '}
          <button className="underline text-gray-900" style={{ fontWeight: 600 }}>
            ajouter un prénom d'usage
          </button>
          .
        </p>
      </div>

      {/* Birth Date */}
      <div className="mb-8">
        <p className="text-base mb-4" style={{ fontWeight: 600 }}>
          Date de naissance
        </p>
        <input
          type="text"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          placeholder="Date de naissance"
          className="w-full h-16 rounded-xl border border-gray-300 px-4 text-base focus:outline-none focus:border-gray-900 transition-colors"
        />
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          Vous devez avoir au moins 18 ans pour vous inscrire. Nous n'indiquerons pas la date de votre anniversaire aux autres utilisateurs Airbnb.
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
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          className="w-full h-16 rounded-xl border border-gray-300 px-4 text-base focus:outline-none focus:border-gray-900 transition-colors"
        />
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          Nous vous enverrons les confirmations et les reçus de voyage par e-mail.
        </p>
      </div>

      {/* Password */}
      <div className="mb-3">
        <p className="text-base mb-4" style={{ fontWeight: 600 }}>
          Mot de passe
        </p>
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            className="w-full h-16 rounded-xl border border-gray-300 px-4 pr-24 text-base focus:outline-none focus:border-gray-900 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-900 hover:text-gray-600 text-sm underline"
            style={{ fontWeight: 600 }}
          >
            {showPassword ? 'Masquer' : 'Afficher'}
          </button>
        </div>
      </div>

      {/* Password Validation Errors */}
      {password && passwordErrors.length > 0 && (
        <div className="mb-8 space-y-2">
          {passwordErrors.map((error, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${error.valid ? 'text-green-600' : 'text-red-600'}`}>
                {error.valid ? '✓' : '✕'}
              </span>
              <span className={`text-sm ${error.valid ? 'text-green-600 line-through' : 'text-red-600'}`}>
                {error.text}
              </span>
            </div>
          ))}
        </div>
      )}

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
            Politique de confidentialité d'Airbnb
          </button>
          .
        </p>
      </div>

      {/* Accept Button */}
      <button
        onClick={onAccept}
        disabled={!isPasswordValid}
        className="w-full rounded-xl text-white text-base py-4 hover:opacity-90 transition-opacity mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: "#000000",
          fontWeight: 600,
        }}
      >
        Accepter et continuer
      </button>

      {/* Marketing Checkbox */}
      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Airbnb vous enverra des offres réservées aux membres, des idées de voyages, des e-mails promotionnels et des notifications push. Vous pouvez désactiver cette option à tout moment dans les paramètres de votre compte ou directement à partir de la notification promotionnelle.
        </p>
        
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={!receiveMarketing}
            onChange={(e) => setReceiveMarketing(!e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">
            Je ne souhaite pas recevoir de messages promotionnels d'Airbnb.
          </span>
        </label>
      </div>
    </>
  );
}