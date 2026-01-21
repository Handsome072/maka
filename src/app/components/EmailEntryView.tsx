interface EmailEntryViewProps {
  email: string;
  setEmail: (value: string) => void;
  onContinue: () => void;
  onSocialLogin: (provider: string) => void;
  onPhoneLogin: () => void;
}

export function EmailEntryView({
  email,
  setEmail,
  onContinue,
  onSocialLogin,
  onPhoneLogin
}: EmailEntryViewProps) {
  return (
    <>
      <p className="text-gray-500 text-base mb-8">
        Créez votre compte pour accéder à toutes nos fonctionnalités.
      </p>

      <div className="mb-6">
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

      <p className="text-xs text-gray-500 mb-8">
        Vous recevrez les confirmations par e-mail.{" "}
        <button className="underline font-medium text-gray-700 hover:text-black transition-colors">
          Confidentialité
        </button>
      </p>

      <button
        onClick={onContinue}
        className="w-full bg-black text-white h-12 rounded-xl font-medium text-base hover:bg-gray-800 transition-all transform active:scale-[0.98] mb-4"
      >
        Continuer
      </button>

      <button 
        onClick={() => onSocialLogin('google')}
        className="w-full h-12 border border-gray-200 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all"
      >
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-sm text-gray-700 font-medium">Continuer avec Google</span>
      </button>
    </>
  );
}