import { useState } from "react";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

type LinkProblem = "expired" | "used" | "invalid";

interface CompleteSignupFormProps {
  token: string;
  email: string;
  onCompleted: () => void;
  onLinkProblem: (problem: LinkProblem, email?: string) => void;
}

const PASSWORD_RULES = [
  { label: "8 caractères", test: (value: string) => value.length >= 8 },
  { label: "Une majuscule", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Un chiffre", test: (value: string) => /[0-9]/.test(value) },
  { label: "Un caractère spécial", test: (value: string) => /[^A-Za-z0-9]/.test(value) },
];

const inputClass =
  "w-full h-12 rounded-xl border px-4 text-base focus:outline-none focus:ring-0 transition-colors placeholder:text-gray-400";
const labelClass = "block text-sm font-medium text-gray-900 mb-1";

/** Date du jour moins 18 ans, au format AAAA-MM-JJ (heure locale). */
function latestAdultBirthDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 18);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Messages du serveur en français ; les messages de validation génériques (en anglais) sont remplacés. */
function fieldMessage(field: string, serverMessage?: string): string {
  if (serverMessage && !/^The /.test(serverMessage)) return serverMessage;
  switch (field) {
    case "first_name":
      return "Indiquez votre prénom.";
    case "last_name":
      return "Indiquez votre nom.";
    case "birth_date":
      return "Indiquez une date de naissance valide.";
    case "password":
    case "password_confirmation":
      return "Le mot de passe ne respecte pas les règles indiquées.";
    default:
      return "Vérifiez les informations saisies.";
  }
}

export function CompleteSignupForm({ token, email, onCompleted, onLinkProblem }: CompleteSignupFormProps) {
  const { completeSignup } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxBirthDate = latestAdultBirthDate();
  const birthDateTooRecent = birthDate !== "" && birthDate > maxBirthDate;
  const passwordValid = PASSWORD_RULES.every((rule) => rule.test(password));
  const confirmationMismatch = confirmation !== "" && confirmation !== password;

  const canSubmit =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    birthDate !== "" &&
    !birthDateTooRecent &&
    passwordValid &&
    confirmation === password &&
    !isSubmitting;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await completeSignup({
        token,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        birth_date: birthDate,
        password,
        password_confirmation: confirmation,
        receive_marketing: receiveMarketing,
      });
      onCompleted();
    } catch (err: any) {
      const data = err?.data ?? {};
      if (data.status === "expired" || data.status === "used" || data.status === "invalid") {
        onLinkProblem(data.status, data.email);
        return;
      }
      if (err?.status === 422 && data.errors) {
        const [field, messages] = Object.entries(data.errors as Record<string, string[]>)[0] ?? [];
        setError(fieldMessage(field ?? "", messages?.[0]));
      } else {
        setError("La création du compte a échoué. Réessayez dans quelques instants.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">Finalisez votre inscription</h1>

      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm mb-5">
        <ShieldCheck className="w-4 h-4 text-[#0A6B78] shrink-0" aria-hidden="true" />
        <span className="font-medium text-gray-900 break-all">{email}</span>
        <span className="text-xs font-semibold text-[#0A6B78] bg-[#E1F2F4] rounded-full px-2.5 py-0.5">
          Adresse confirmée
        </span>
      </p>

      {error && (
        <div role="alert" className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="complete-first-name" className={labelClass}>Prénom</label>
          <input
            id="complete-first-name"
            type="text"
            autoComplete="given-name"
            maxLength={255}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`${inputClass} border-gray-200 focus:border-gray-900`}
          />
        </div>
        <div>
          <label htmlFor="complete-last-name" className={labelClass}>Nom</label>
          <input
            id="complete-last-name"
            type="text"
            autoComplete="family-name"
            maxLength={255}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`${inputClass} border-gray-200 focus:border-gray-900`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3 items-end">
        <div>
          <label htmlFor="complete-birth-date" className={labelClass}>Date de naissance</label>
          <input
            id="complete-birth-date"
            type="date"
            autoComplete="bday"
            max={maxBirthDate}
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            aria-invalid={birthDateTooRecent}
            aria-describedby="complete-birth-date-hint"
            className={`${inputClass} px-3 sm:px-4 ${birthDateTooRecent ? "border-red-500 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-gray-900"}`}
          />
        </div>
        <p
          id="complete-birth-date-hint"
          className={`text-xs leading-snug pb-1.5 ${birthDateTooRecent ? "text-red-600" : "text-gray-500"}`}
        >
          {birthDateTooRecent
            ? "Vous devez avoir au moins 18 ans pour vous inscrire."
            : "18 ans minimum. Votre date de naissance reste privée."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label htmlFor="complete-password" className={labelClass}>Mot de passe</label>
          <div className="relative">
            <input
              id="complete-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              maxLength={72}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-11 border-gray-200 focus:border-gray-900`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="complete-password-confirmation" className={labelClass}>Confirmation</label>
          <input
            id="complete-password-confirmation"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            maxLength={72}
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            aria-invalid={confirmationMismatch}
            className={`${inputClass} ${confirmationMismatch ? "border-red-500 focus:border-red-500 bg-red-50" : "border-gray-200 focus:border-gray-900"}`}
          />
        </div>
      </div>

      <ul className="flex flex-wrap gap-x-4 gap-y-0.5 mt-2 text-xs" aria-label="Règles du mot de passe">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className={ok ? "text-teal-700" : "text-gray-500"}>
              {ok ? "✓" : "○"} {rule.label}
            </li>
          );
        })}
        {confirmationMismatch && <li className="text-red-600">Les mots de passe ne correspondent pas</li>}
      </ul>

      <label htmlFor="complete-no-marketing" className="flex items-start gap-2.5 mt-3 cursor-pointer">
        <input
          id="complete-no-marketing"
          type="checkbox"
          checked={!receiveMarketing}
          onChange={(e) => setReceiveMarketing(!e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 rounded border-gray-300 text-black focus:ring-0 focus:ring-offset-0"
        />
        <span className="text-xs text-gray-600 leading-snug">
          Je ne souhaite pas recevoir d'offres ni de messages promotionnels de Séjoura.
        </span>
      </label>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-4 w-full h-12 bg-black text-white rounded-xl font-semibold text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Création du compte…" : "Créer mon compte"}
      </button>

      <p className="mt-3 text-xs text-gray-500 leading-snug">
        En cliquant sur <span className="font-semibold text-gray-700">Créer mon compte</span>, j'accepte les{" "}
        <a href="/terms/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
          Conditions générales
        </a>
        , les Conditions de service relatives aux paiements, la Politique de non-discrimination et je reconnais avoir pris connaissance de la{" "}
        <a href="/privacy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-700">
          Politique de confidentialité de Séjoura
        </a>
        .
      </p>
    </form>
  );
}
