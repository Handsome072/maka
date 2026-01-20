import { useState } from 'react';

interface IdentityVerificationProps {
  onNavigate: (page: string) => void;
  listingTitle?: string;
}

export function IdentityVerification({ onNavigate, listingTitle = 'Maison hôte calme' }: IdentityVerificationProps) {
  const [currentStep, setCurrentStep] = useState<'choice' | 'form' | 'add-id' | 'upload-method'>('choice');
  const [selectedType, setSelectedType] = useState<'official' | 'id' | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'webcam' | 'mobile' | null>(null);
  
  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('Madagascar');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const isFormValid = firstName && lastName && country && address && city && state && postalCode;

  const handleContinueFromChoice = () => {
    if (selectedType === 'official') {
      setCurrentStep('form');
    } else if (selectedType === 'id') {
      setCurrentStep('add-id');
    }
  };

  const handleSubmitForm = () => {
    if (isFormValid) {
      // Navigate back to Annonces page
      onNavigate('annonces');
    }
  };

  if (currentStep === 'choice') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
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
        <div className="max-w-2xl mx-auto px-8 py-12">
          <div className="mb-12">
            <p className="text-sm mb-2" style={{ color: '#717171' }}>
              Mettez à jour votre annonce
            </p>
            <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
              Quel type d'informations souhaitez-vous fournir ?
            </h1>

            {/* Option 1: Official Name and Address */}
            <div 
              onClick={() => setSelectedType('official')}
              className={`border-2 rounded-xl p-6 mb-4 cursor-pointer transition-all ${
                selectedType === 'official' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Nom officiel et adresse
                  </h3>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Vos informations seront vérifiées par nos partenaires de confiance.
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                  selectedType === 'official' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {selectedType === 'official' && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Option 2: ID Document */}
            <div 
              onClick={() => setSelectedType('id')}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedType === 'id' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                    Pièce d'identité
                  </h3>
                  <p className="text-sm" style={{ color: '#717171' }}>
                    Vous prendrez des photos que notre équipe vérifiera.
                  </p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                  selectedType === 'id' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {selectedType === 'id' && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm" style={{ color: '#717171' }}>
                Vos informations sont traitées conformément à notre{' '}
                <button className="underline hover:opacity-70" style={{ color: '#222222' }}>
                  Politique de confidentialité
                </button>
                .{' '}
                <button className="underline hover:opacity-70" style={{ color: '#222222' }}>
                  En savoir plus sur la vérification d'identité
                </button>
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
              disabled={!selectedType}
              onClick={handleContinueFromChoice}
              className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                selectedType ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600, backgroundColor: selectedType ? '#222222' : '#E5E5E5' }}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add ID step
  if (currentStep === 'add-id') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
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
              Ajoutez votre pièce d'identité
            </h1>
            
            <p className="text-base mb-4" style={{ color: '#484848' }}>
              Vous allez devoir ajouter une pièce d'identité officielle. Cette étape permet de confirmer votre identité.
            </p>

            <p className="text-base mb-8" style={{ color: '#484848' }}>
              Selon votre pays, vous pouvez ajouter un permis de conduire, un passeport ou une carte d'identité.
            </p>

            {/* Add ID Button */}
            <button
              onClick={() => setCurrentStep('upload-method')}
              className="px-6 py-3 rounded-lg text-white text-base hover:opacity-90 transition-opacity mb-8"
              style={{ fontWeight: 600, backgroundColor: '#222222' }}
            >
              Ajouter une pièce d'identité
            </button>

            {/* Confidentiality Box */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h2 className="text-base mb-4" style={{ fontWeight: 600, color: '#222222' }}>
                Votre confidentialité
              </h2>
              <p className="text-sm mb-4" style={{ color: '#717171', lineHeight: '1.6' }}>
                Nous veillons à assurer la confidentialité et la protection des données que vous nous communiquez tout au long de ce processus. Pour en savoir plus, consultez notre{' '}
                <button className="underline hover:opacity-70" style={{ color: '#222222' }}>
                  Politique de confidentialité
                </button>
                .
              </p>
              <button className="underline text-sm hover:opacity-70" style={{ color: '#222222', fontWeight: 600 }}>
                Comment fonctionne la vérification d'identité ?
              </button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep('choice')}
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

  // Upload method step
  if (currentStep === 'upload-method') {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
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
            <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
              Comment souhaitez-vous ajouter votre pièce d'identité ?
            </h1>

            {/* Option 1: Webcam */}
            <div 
              onClick={() => setUploadMethod('webcam')}
              className={`border-2 rounded-xl p-6 mb-4 cursor-pointer transition-all ${
                uploadMethod === 'webcam' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                    Prendre une photo avec la webcam
                  </h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                  uploadMethod === 'webcam' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {uploadMethod === 'webcam' && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>

            {/* Option 2: Mobile App */}
            <div 
              onClick={() => setUploadMethod('mobile')}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                uploadMethod === 'mobile' ? 'border-gray-900 bg-gray-50' : 'border-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-base" style={{ fontWeight: 600, color: '#222222' }}>
                    Prendre une photo avec l'application mobile HOMIQIO
                  </h3>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-4 ${
                  uploadMethod === 'mobile' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                }`}>
                  {uploadMethod === 'mobile' && (
                    <div className="w-3 h-3 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep('add-id')}
              className="px-6 py-3 rounded-lg text-base hover:bg-gray-100 transition-colors flex items-center gap-2"
              style={{ fontWeight: 600, color: '#222222' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Retour
            </button>
            <button
              disabled={!uploadMethod}
              onClick={() => onNavigate('annonces')}
              className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
                uploadMethod ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
              }`}
              style={{ fontWeight: 600, backgroundColor: uploadMethod ? '#222222' : '#E5E5E5' }}
            >
              Continuer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form step
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between z-20">
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
          <p className="text-sm mb-2" style={{ color: '#717171' }}>
            Mettez à jour votre annonce
          </p>
          <h1 className="text-3xl mb-8" style={{ fontWeight: 600, color: '#222222' }}>
            Fournissez vos informations légales
          </h1>
          <p className="text-base mb-8" style={{ color: '#717171' }}>
            Nous utilisons vos informations pour vérifier votre identité par l'intermédiaire de nos partenaires de confiance.
          </p>

          {/* Name Fields */}
          <div className="mb-6">
            <label className="block text-sm mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Vérifiez votre nom officiel
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Nom"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base mb-3 focus:border-gray-900 focus:outline-none transition-colors"
              style={{ color: '#222222' }}
            />
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Prénom(s)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
              style={{ color: '#222222' }}
            />
            <p className="text-xs mt-2" style={{ color: '#717171' }}>
              Assurez-vous que cela correspond au nom qui figure dans votre pièce d'identité.
            </p>
          </div>

          {/* Address Fields */}
          <div className="mb-6">
            <label className="block text-sm mb-2" style={{ fontWeight: 600, color: '#222222' }}>
              Ajoutez votre adresse
            </label>
            <p className="text-sm mb-3" style={{ color: '#717171' }}>
              Il s'agit de l'adresse qui figure sur vos documents bancaires ou toute autre pièce d'identité que vous utilisez.
            </p>

            {/* Country */}
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Pays/région
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              >
                <option value="Madagascar">Madagascar</option>
                <option value="France">France</option>
                <option value="Belgique">Belgique</option>
                <option value="Suisse">Suisse</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            {/* Street Address */}
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Adresse postale
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              />
              <p className="text-xs mt-1" style={{ color: '#717171' }}>
                Numéro de rue, nom de la rue, etc.
              </p>
            </div>

            {/* Apartment */}
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Appartement, bâtiment (facultatif)
              </label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              />
              <p className="text-xs mt-1" style={{ color: '#717171' }}>
                Apt., unité, bâtiment, etc.
              </p>
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Ville
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              />
            </div>

            {/* State */}
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                État
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              />
            </div>

            {/* Postal Code */}
            <div className="mb-3">
              <label className="block text-xs mb-1" style={{ color: '#717171' }}>
                Code postal
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base focus:border-gray-900 focus:outline-none transition-colors"
                style={{ color: '#222222' }}
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-sm" style={{ color: '#717171' }}>
              Vos informations sont traitées conformément à notre{' '}
              <button className="underline hover:opacity-70" style={{ color: '#222222' }}>
                Politique de confidentialité
              </button>
              .{' '}
              <button className="underline hover:opacity-70" style={{ color: '#222222' }}>
                En savoir plus sur la vérification d'identité
              </button>
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStep('choice')}
            className="px-6 py-3 rounded-lg text-base hover:bg-gray-100 transition-colors flex items-center gap-2"
            style={{ fontWeight: 600, color: '#222222' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Retour
          </button>
          <button
            disabled={!isFormValid}
            onClick={handleSubmitForm}
            className={`px-8 py-3 rounded-lg text-white text-base transition-opacity ${
              isFormValid ? 'hover:opacity-90' : 'opacity-40 cursor-not-allowed'
            }`}
            style={{ fontWeight: 600, backgroundColor: isFormValid ? '#222222' : '#E5E5E5' }}
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}