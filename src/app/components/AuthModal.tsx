import { X, ChevronDown, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { EmailSignupView } from "./EmailSignupView";
import { EmailEntryView } from "./EmailEntryView";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'phone' | 'email-entry' | 'email-signup';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "France",
    code: "+33"
  });
  const [isFocused, setIsFocused] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('phone');
  
  // Email signup fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [receiveMarketing, setReceiveMarketing] = useState(false);
  
  const { login } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const countries = [
    { name: "France", code: "+33" },
    { name: "Belgique", code: "+32" },
    { name: "Suisse", code: "+41" },
    { name: "Canada", code: "+1" },
    { name: "États-Unis", code: "+1" },
  ];

  const handlePhoneLogin = () => {
    login({
      name: "Utilisateur",
      email: `${selectedCountry.code}${phoneNumber}`,
    });
    onClose();
  };

  const handleSocialLogin = (provider: string) => {
    login({
      name: "Utilisateur",
      email: `user@${provider}.com`,
    });
    onClose();
  };

  const handleEmailSignup = () => {
    login({
      name: `${firstName} ${lastName}`,
      email: email,
    });
    onClose();
  };

  const handleBack = () => {
    if (authStep === 'email-signup') {
      setAuthStep('email-entry');
    } else if (authStep === 'email-entry') {
      setAuthStep('phone');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-[680px] w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-8 py-5 flex items-center justify-between">
          <button
            onClick={authStep === 'email-signup'? handleBack : onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors -ml-2"
          >
            {authStep === 'email-signup' ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <X className="w-5 h-5" />
            )}
          </button>
          <h2
            className="text-lg absolute left-1/2 transform -translate-x-1/2"
            style={{ fontWeight: 600 }}
          >
            {authStep === 'email-signup' ? 'Terminer mon inscription' : 'Connexion ou inscription'}
          </h2>
          <div className="w-8"></div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="px-8 py-8">
            {/* Phone View */}
            {authStep === 'phone' && (
              <>
                <h3 className="text-[22px] mb-6" style={{ fontWeight: 600 }}>
                  Bienvenue sur HOMIQIO
                </h3>

                {/* Country/Region Selector */}
                <div className="relative mb-4">
                  <button
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-3 text-left flex items-center justify-between hover:border-gray-900 transition-colors"
                  >
                    <span className="text-base">
                      {selectedCountry.name} ({selectedCountry.code})
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {/* Country Dropdown */}
                  {showCountryDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <button
                          key={country.name}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                          }}
                          className="w-full px-3 py-3 text-left hover:bg-gray-50 transition-colors text-base"
                        >
                          {country.name} ({country.code})
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <div className="relative mb-2">
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, '');
                      setPhoneNumber(value);
                    }}
                    placeholder="Numéro de téléphone"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="placeholder-transparent peer w-full h-14 rounded-lg border border-gray-300 px-3 text-base focus:outline-none focus:border-gray-300 transition-colors"
                    style={{ 
                      paddingTop: (isFocused || phoneNumber) ? '20px' : '14px',
                      paddingLeft: (isFocused || phoneNumber) ? '52px' : '12px'
                    }}
                  />
                  
                  <label
                    htmlFor="phone"
                    className={`
                      pointer-events-none absolute left-3 text-gray-500 transition-all duration-150
                      ${(isFocused || phoneNumber) ? 'top-2 text-xs' : 'top-1/2 -translate-y-1/2 text-base'}
                    `}
                    style={{ fontWeight: 600 }}
                  >
                    Numéro de téléphone
                  </label>

                  {(isFocused || phoneNumber) && (
                    <div className="absolute left-3 bottom-[5px] text-base text-gray-900 pointer-events-none">
                      {selectedCountry.code}
                    </div>
                  )}
                </div>

                {/* SMS Info Text */}
                <p className="text-xs text-[#222222] leading-relaxed mb-4">
                  Nous vous appellerons ou vous enverrons un SMS
                  pour confirmer votre numéro. Les frais standards
                  d'envoi de messages et d'échange de données
                  s'appliquent.{" "}
                  <button className="underline" style={{ fontWeight: 600 }}>
                    Politique de confidentialité
                  </button>
                </p>

                {/* Continue Button */}
                <button
                  onClick={handlePhoneLogin}
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
                    onClick={() => handleSocialLogin('google')}
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
                    onClick={() => handleSocialLogin('apple')}
                    className="w-full border border-gray-900 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M14.5481 15.3527C13.9556 16.2623 13.2985 17.1029 12.4478 17.1166C11.6108 17.1303 11.3388 16.6056 10.3744 16.6056C9.40993 16.6056 9.11051 17.1029 8.31454 17.1303C7.49115 17.1578 6.75139 16.2212 6.15156 15.318C4.92448 13.4704 3.99 9.98594 5.2582 7.65234C5.88543 6.49297 7.02954 5.76562 8.26958 5.75195C9.07922 5.73828 9.84638 6.30391 10.3333 6.30391C10.8202 6.30391 11.7573 5.61133 12.7286 5.71094C13.1472 5.72461 14.3833 5.87461 15.2271 7.01484C15.1544 7.05938 13.7583 7.91406 13.7719 9.53203C13.7856 11.4891 15.4106 12.1953 15.4242 12.1953C15.4106 12.2398 15.1544 13.1494 14.5481 15.3527ZM11.9685 3.99844C12.7013 3.11719 13.2131 1.89375 13.0629 0.683594C12.0371 0.724219 10.7893 1.33828 10.0292 2.21953C9.34196 2.99766 8.73125 4.24219 8.89509 5.43867C10.0565 6.52734 11.2356 5.89336 11.9685 3.99844Z" fill="currentColor"/>
                    </svg>
                    <span className="text-sm" style={{ fontWeight: 600 }}>
                      Continuer avec Apple
                    </span>
                  </button>

                  {/* Email */}
                  <button 
                    onClick={() => setAuthStep('email-entry')}
                    className="w-full border border-gray-900 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M16.5 4.5C16.5 3.675 15.825 3 15 3H3C2.175 3 1.5 3.675 1.5 4.5V13.5C1.5 14.325 2.175 15 3 15H15C15.825 15 16.5 14.325 16.5 13.5V4.5ZM15 4.5L9 8.25L3 4.5H15ZM15 13.5H3V6L9 9.75L15 6V13.5Z" fill="currentColor"/>
                    </svg>
                    <span className="text-sm" style={{ fontWeight: 600 }}>
                      Continuer avec une adresse e-mail
                    </span>
                  </button>

                  {/* Facebook */}
                  <button 
                    onClick={() => handleSocialLogin('facebook')}
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
            )}

            {/* Email Entry View */}
            {authStep === 'email-entry' && (
              <EmailEntryView
                email={email}
                setEmail={setEmail}
                onContinue={() => setAuthStep('email-signup')}
                onSocialLogin={handleSocialLogin}
                onPhoneLogin={() => setAuthStep('phone')}
              />
            )}

            {/* Email Signup View */}
            {authStep === 'email-signup' && (
              <EmailSignupView
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                birthDate={birthDate}
                setBirthDate={setBirthDate}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                receiveMarketing={receiveMarketing}
                setReceiveMarketing={setReceiveMarketing}
                onAccept={handleEmailSignup}
                onBack={handleBack}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}