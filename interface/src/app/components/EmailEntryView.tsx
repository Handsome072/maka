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
      {/* Title */}
      <h3 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>
        Bienvenue sur HOMIQIO
      </h3>

      {/* Email Input */}
      <div className="mb-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Adresse e-mail"
          className="w-full h-14 rounded-lg border border-gray-300 px-3 text-base focus:outline-none focus:border-gray-900 transition-colors"
        />
      </div>

      {/* Info Text */}
      <p className="text-xs text-[#222222] leading-relaxed mb-4">
        Nous vous enverrons les confirmations et les reçus de voyage par e-mail.{" "}
        <button className="underline" style={{ fontWeight: 600 }}>
          Politique de confidentialité
        </button>
      </p>

      {/* Continue Button */}
      <button
        onClick={onContinue}
        className="w-full rounded-lg text-white text-base py-3.5 hover:opacity-90 transition-opacity mb-4"
        style={{
          backgroundColor: "#059669",
          fontWeight: 600,
        }}
      >
        Continuer
      </button>

      {/* Divider */}
      <div className="relative mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">ou</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3">
        {/* Google */}
        <button 
          onClick={() => onSocialLogin('google')}
          className="w-full border border-gray-900 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.20454C17.64 8.56636 17.5827 7.95272 17.4764 7.36363H9V10.845H13.8436C13.635 11.97 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20454Z" fill="#4285F4"/>
            <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z" fill="#34A853"/>
            <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
            <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
          </svg>
          <span className="text-sm" style={{ fontWeight: 600 }}>
            Continuer avec Google
          </span>
        </button>

        {/* Apple */}
        <button 
          onClick={() => onSocialLogin('apple')}
          className="w-full border border-gray-900 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M14.5481 15.3527C13.9556 16.2623 13.2985 17.1029 12.4478 17.1166C11.6108 17.1303 11.3388 16.6056 10.3744 16.6056C9.40993 16.6056 9.11051 17.1029 8.31454 17.1303C7.49115 17.1578 6.75139 16.2212 6.15156 15.318C4.92448 13.4704 3.99 9.98594 5.2582 7.65234C5.88543 6.49297 7.02954 5.76562 8.26958 5.75195C9.07922 5.73828 9.84638 6.30391 10.3333 6.30391C10.8202 6.30391 11.7573 5.61133 12.7286 5.71094C13.1472 5.72461 14.3833 5.87461 15.2271 7.01484C15.1544 7.05938 13.7583 7.91406 13.7719 9.53203C13.7856 11.4891 15.4106 12.1953 15.4242 12.1953C15.4106 12.2398 15.1544 13.1494 14.5481 15.3527ZM11.9685 3.99844C12.7013 3.11719 13.2131 1.89375 13.0629 0.683594C12.0371 0.724219 10.7893 1.33828 10.0292 2.21953C9.34196 2.99766 8.73125 4.24219 8.89509 5.43867C10.0565 6.52734 11.2356 5.89336 11.9685 3.99844Z" fill="currentColor"/>
          </svg>
          <span className="text-sm" style={{ fontWeight: 600 }}>
            Continuer avec Apple
          </span>
        </button>

        {/* Phone */}
        <button 
          onClick={onPhoneLogin}
          className="w-full border border-gray-900 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M15.5 13.25C15.5 13.5 15.25 13.75 15 13.75C11.25 13.75 7.75 12.25 5 9.5C2.25 6.75 0.75 3.25 0.75 0C0.75 -0.25 1 -0.5 1.25 -0.5H4C4.25 -0.5 4.5 -0.25 4.5 0C4.5 1 4.75 2 5 2.75C5.25 3 5.25 3.25 5 3.5L3.5 5C4.75 7 6.5 8.75 8.5 10L10 8.5C10.25 8.25 10.5 8.25 10.75 8.5C11.5 8.75 12.5 9 13.5 9C13.75 9 14 9.25 14 9.5V12.75C14 13 13.75 13.25 13.5 13.25C13.75 13.25 14 13 14 12.75V9.5C14 9.25 13.75 9 13.5 9C12.5 9 11.5 8.75 10.75 8.5C10.5 8.25 10.25 8.25 10 8.5L8.5 10C6.5 8.75 4.75 7 3.5 5L5 3.5C5.25 3.25 5.25 3 5 2.75C4.75 2 4.5 1 4.5 0C4.5 -0.25 4.25 -0.5 4 -0.5H1.25C1 -0.5 0.75 -0.25 0.75 0C0.75 3.25 2.25 6.75 5 9.5C7.75 12.25 11.25 13.75 15 13.75C15.25 13.75 15.5 13.5 15.5 13.25Z" fill="currentColor" transform="translate(1.5 2)"/>
          </svg>
          <span className="text-sm" style={{ fontWeight: 600 }}>
            Continuer avec le numéro de téléphone
          </span>
        </button>

        {/* Facebook */}
        <button 
          onClick={() => onSocialLogin('facebook')}
          className="w-full border border-gray-900 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M18 9C18 4.02943 13.9706 0 9 0C4.02943 0 0 4.02943 0 9C0 13.4922 3.29115 17.2155 7.59375 17.8907V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.93742 3.51562 10.9932 3.51562C11.9776 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.873C10.755 5.90625 10.4062 6.60005 10.4062 7.3125V9H12.9023L12.5033 11.6016H10.4062V17.8907C14.7089 17.2155 18 13.4922 18 9Z" fill="#1877F2"/>
          </svg>
          <span className="text-sm" style={{ fontWeight: 600 }}>
            Continuer avec Facebook
          </span>
        </button>
      </div>
    </>
  );
}