'use client';

import { useState } from 'react';
import { Globe, DollarSign, Check } from 'lucide-react';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

const currencies = [
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'USD', name: 'Dollar américain', symbol: '$' },
  { code: 'GBP', name: 'Livre sterling', symbol: '£' },
  { code: 'CHF', name: 'Franc suisse', symbol: 'CHF' },
  { code: 'CAD', name: 'Dollar canadien', symbol: 'CA$' },
];

/**
 * Page Langues et devise
 */
export default function LanguagesPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Langue et devise</h1>
      <p className="text-gray-600 mb-8">
        Choisissez votre langue et votre devise préférées
      </p>

      {/* Language Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5" />
          <h2 className="text-lg font-medium">Langue</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                selectedLanguage === lang.code 
                  ? 'border-[#00A99D] bg-teal-50' 
                  : 'hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
              </div>
              {selectedLanguage === lang.code && (
                <Check className="w-5 h-5 text-[#00A99D]" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Currency Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5" />
          <h2 className="text-lg font-medium">Devise</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {currencies.map((currency) => (
            <button
              key={currency.code}
              onClick={() => setSelectedCurrency(currency.code)}
              className={`flex items-center justify-between p-4 border rounded-xl transition-all ${
                selectedCurrency === currency.code 
                  ? 'border-[#00A99D] bg-teal-50' 
                  : 'hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-gray-700">{currency.symbol}</span>
                <div className="text-left">
                  <p className="font-medium">{currency.code}</p>
                  <p className="text-sm text-gray-500">{currency.name}</p>
                </div>
              </div>
              {selectedCurrency === currency.code && (
                <Check className="w-5 h-5 text-[#00A99D]" />
              )}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-8">
        <button className="px-6 py-3 bg-[#00A99D] text-white rounded-lg hover:bg-[#008B82]">
          Enregistrer les préférences
        </button>
      </div>
    </div>
  );
}

