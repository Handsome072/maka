import { useState } from 'react';

interface PhoneVerificationProps {
  onNavigate: (page: string) => void;
}

export function PhoneVerification({ onNavigate }: PhoneVerificationProps) {
  const [currentStep, setCurrentStep] = useState<'phone-number' | 'verification-code'>('phone-number');
  const [phoneCountry, setPhoneCountry] = useState('France (+33)');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);

  const isPhoneValid = phoneNumber.length >= 9;
  const isCodeComplete = verificationCode.every(digit => digit !== '');

  // Format phone number for display
  const getFormattedPhoneNumber = () => {
    const countryCode = phoneCountry.match(/\(([^)]+)\)/)?.[1] || '+33';
    return `${countryCode} ${phoneNumber}`;
  };

  const handlePhoneSubmit = () => {
    if (isPhoneValid) {
      setCurrentStep('verification-code');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleCodeSubmit = () => {
    if (isCodeComplete) {
      onNavigate('annonces');
    }
  };

  // Phone number input step
  if (currentStep === 'phone-number') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-20">
          <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
            <img
              src="/logo.png"
              alt="HOMIQIO Logo"
              className="w-[120px] h-auto"
            />
          </button>
          <button
            onClick={() => onNavigate('annonces')}
            className="text-sm hover:underline transition-all"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            Enregistrer et quitter
          </button>
        </header>

        {/* Content */}
        <div className="max-w-xl mx-auto px-8 py-12">
          <div className="mb-12">
            <h1 className="text-3xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
              Quel numéro de téléphone les voyageurs peuvent-ils utiliser pour vous contacter ?
            </h1>
            
            <p className="text-base mb-8" style={{ color: '#484848' }}>
              Nous vous enverrons des demandes de réservation, des rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des SMS ou des appels.
            </p>

            {/* Country Selector */}
            <div className="mb-4">
              <label className="block text-sm mb-2" style={{ fontWeight: 600, color: '#717171' }}>
                Pays/région
              </label>
              <select
                value={phoneCountry}
                onChange={(e) => setPhoneCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              >
                <option value="France (+33)">France (+33)</option>
                <option value="Madagascar (+261)">Madagascar (+261)</option>
                <option value="Belgique (+32)">Belgique (+32)</option>
                <option value="Suisse (+41)">Suisse (+41)</option>
                <option value="Canada (+1)">Canada (+1)</option>
              </select>
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm mb-2" style={{ fontWeight: 600, color: '#717171' }}>
                Numéro de téléphone
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              />
              <p className="text-xs mt-2" style={{ color: '#717171' }}>
                Nous vous appellerons ou vous enverrons un SMS pour confirmer votre numéro. Les frais standards d'envoi de messages et d'échange de données s'appliquent.
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => onNavigate('verification-points')}
              className="px-6 py-3 rounded-lg text-base hover:bg-gray-100 transition-colors flex items-center gap-2"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Retour
            </button>
            <button
              disabled={!isPhoneValid}
              onClick={handlePhoneSubmit}
              className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                isPhoneValid ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600, backgroundColor: isPhoneValid ? '#222222' : '#E5E5E5' }}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verification code step
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between z-20">
        <button onClick={() => onNavigate('logements')} className="hover:opacity-70 transition-opacity">
          <img
            src="/logo.png"
            alt="HOMIQIO Logo"
            className="w-[120px] h-auto"
          />
        </button>
        <button
          onClick={() => onNavigate('annonces')}
          className="text-sm hover:underline transition-all"
          style={{ fontWeight: 600, color: '#222222' }}
        >
          Enregistrer et quitter
        </button>
      </header>

      {/* Content */}
      <div className="max-w-xl mx-auto px-8 py-12">
        <div className="mb-12">
          <h1 className="text-3xl mb-6" style={{ fontWeight: 600, color: '#222222' }}>
            Quel numéro de téléphone les voyageurs peuvent-ils utiliser pour vous contacter ?
          </h1>
          
          <p className="text-base mb-4" style={{ color: '#484848' }}>
            Nous vous enverrons des demandes de réservation, des rappels et d'autres notifications. Ce numéro doit pouvoir recevoir des SMS ou des appels.
          </p>

          <p className="text-base mb-8" style={{ color: '#222222' }}>
            Saisissez le code à 4 chiffres que HOMIQIO vient d'envoyer au {getFormattedPhoneNumber()} :
          </p>

          {/* Verification Code Inputs */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className="w-14 h-14 text-center text-2xl border-2 border-gray-300 rounded-lg focus:border-gray-900 focus:outline-none transition-colors"
                style={{ fontWeight: 600, color: '#222222' }}
              />
            ))}
          </div>

          {/* Continuer Button */}
          <div className="flex justify-center mb-8">
            <button
              disabled={!isCodeComplete}
              onClick={handleCodeSubmit}
              className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                isCodeComplete ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600, backgroundColor: isCodeComplete ? '#222222' : '#E5E5E5' }}
            >
              Continuer
            </button>
          </div>

          {/* Links */}
          <div className="text-center">
            <p className="text-sm mb-2" style={{ color: '#717171' }}>
              Vous n'avez pas reçu de SMS ?{' '}
              <button className="underline hover:opacity-70" style={{ color: '#222222', fontWeight: 600 }}>
                Renvoyer
              </button>
            </p>
            <button className="text-sm underline hover:opacity-70" style={{ color: '#222222', fontWeight: 600 }}>
              Je préfère recevoir un appel
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep('phone-number')}
            className="px-6 py-3 rounded-lg text-base hover:bg-gray-100 transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
        </div>
      </div>
    </div>
  );
}