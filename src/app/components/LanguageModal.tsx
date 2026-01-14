import { X } from "lucide-react";
import { useState } from "react";

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const currencies = [
  { name: "Dollar américain", code: "USD – $" },
  { name: "Baht thaïlandais", code: "THB – ฿" },
  { name: "Cedi ghanéen", code: "GHS – GH₵" },
  { name: "Colon costaricain", code: "CRC – ₡" },
  { name: "Couronne danoise", code: "DKK – kr" },
  { name: "Couronne norvégienne", code: "NOK – kr" },
  { name: "Couronne suédoise", code: "SEK – kr" },
  { name: "Couronne tchèque", code: "CZK – Kč" },
  { name: "Dirham émirien", code: "AED – د.إ" },
  { name: "Dirham marocain", code: "MAD" },
  { name: "Dollar australien", code: "AUD – $" },
  { name: "Dollar canadien", code: "CAD – $" },
  { name: "Dollar de Hong Kong", code: "HKD – $" },
  { name: "Dollar de Singapour", code: "SGD – $" },
  { name: "Dollar néo-zélandais", code: "NZD – $" },
  { name: "Dong vietnamien", code: "VND – ₫" },
  { name: "Euro", code: "EUR – €" },
  { name: "Forint hongrois", code: "HUF – Ft" },
  { name: "Franc suisse", code: "CHF" },
  { name: "Hryvnia ukrainienne", code: "UAH – ₴" },
  { name: "Leu roumain", code: "RON – lei" },
  { name: "Lev bulgare", code: "BGN – лв." },
  { name: "Livre égyptienne", code: "EGP – ج.م" },
  { name: "Livre sterling", code: "GBP – £" },
  { name: "Livre turque", code: "TRY – ₺" },
  { name: "Nouveau dollar de Taïwan", code: "TWD – $" },
  { name: "Nouveau Shekel israélien", code: "ILS – ₪" },
  { name: "Peso chilien", code: "CLP – $" },
  { name: "Peso colombien", code: "COP – $" },
  { name: "Peso mexicain", code: "MXN – $" },
  { name: "Peso philippin", code: "PHP – ₱" },
  { name: "Peso uruguayen", code: "UYU – $U" },
  { name: "Rand sud-africain", code: "ZAR – R" },
  { name: "Real brésilien", code: "BRL – R$" },
  { name: "Ringgit malais", code: "MYR – RM" },
];

const languages = [
  { language: "Français", region: "France" },
  { language: "Azərbaycanca", region: "Azərbaycan" },
  { language: "Bahasa Indonesia", region: "Indonesia" },
  { language: "Bosanski", region: "Bosna i Hercegovina" },
  { language: "Català", region: "Espanya" },
  { language: "Čeština", region: "Česká republika" },
  { language: "Crnogorski", region: "Crna Gora" },
  { language: "Dansk", region: "Danmark" },
  { language: "Deutsch", region: "Deutschland" },
  { language: "Deutsch", region: "Österreich" },
  { language: "Deutsch", region: "Schweiz" },
  { language: "Deutsch", region: "Luxembourg" },
  { language: "Eesti", region: "Eesti" },
  { language: "English", region: "Australia" },
  { language: "English", region: "Canada" },
];

const suggestedLanguages = [
  { language: "English", region: "United States" },
  { language: "English", region: "United Kingdom" },
];

export function LanguageModal({
  isOpen,
  onClose,
}: LanguageModalProps) {
  const [activeTab, setActiveTab] = useState<
    "language" | "currency"
  >("language");
  const [translationEnabled, setTranslationEnabled] =
    useState(false);
  const [selectedLanguage, setSelectedLanguage] =
    useState("Français");
  const [selectedCurrency, setSelectedCurrency] = useState(
    "Dollar américain",
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center pt-20"
      onClick={onClose}
    >
      {/* Overlay background */}
      <div
        className="absolute inset-0 bg-black/50"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-4xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div className='absolute bg-white inset-0 w-full rounded-tl-4xl rounded-tr-4xl h-16 z-40'>
        <button
          onClick={onClose}
          aria-label="Fermer"
          className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-4 h-4" />
        </button>
        </div>        
        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-6 scrollbar-thin">
          {/* Tabs */}
          <div className="border-b border-gray-200 mt-12 mb-12">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("language")}
                className={`pb-3 text-sm transition-colors relative ${
                  activeTab === "language"
                    ? ""
                    : "text-gray-500"
                }`}
                style={{
                  fontWeight:
                    activeTab === "language" ? 600 : 400,
                }}
              >
                Langue et région
                {activeTab === "language" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("currency")}
                className={`pb-3 text-sm transition-colors relative ${
                  activeTab === "currency"
                    ? ""
                    : "text-gray-500"
                }`}
                style={{
                  fontWeight:
                    activeTab === "currency" ? 600 : 400,
                }}
              >
                Devise
                {activeTab === "currency" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></div>
                )}
              </button>
            </div>
          </div>
          {activeTab === "currency" && (
            <div>
              <h2
                className="text-xl mb-6"
                style={{ fontWeight: 600 }}
              >
                Choisissez une devise
              </h2>
              <div className="grid grid-cols-5 gap-3">
                {currencies.map((currency, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedCurrency(currency.name)
                    }
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedCurrency === currency.name
                        ? "border-black bg-gray-50"
                        : "hover:bg-gray-50 border-none"
                    }`}
                  >
                    <div className="text-sm mb-0.5">
                      {currency.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {currency.code}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div>
              {/* Translation toggle */}
              <div className="mb-8 p-4 bg-gray-50 rounded-lg flex items-center justify-between w-fit">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-2 mr-4">
                    <div
                      className="text-sm flex items-center gap-2"
                      style={{ fontWeight: 600 }}
                    >
                      Traduction
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 7.5H6M6 7.5C6 9.98528 4.20914 12 2 12M6 7.5C6 5.01472 4.20914 3 2 3"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M10 4L7 12M13 4L10 12"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-600">
                      Traduire automatiquement les descriptions
                      et les commentaires en Français
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setTranslationEnabled(!translationEnabled)
                  }
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    translationEnabled
                      ? "bg-black"
                      : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      translationEnabled
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  ></div>
                </button>
              </div>

              {/* Suggested languages */}
              <h3
                className="text-base mb-4"
                style={{ fontWeight: 600 }}
              >
                Langues et régions suggérées
              </h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {suggestedLanguages.map((lang, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedLanguage(
                        `${lang.language} ${lang.region}`,
                      )
                    }
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedLanguage ===
                      `${lang.language} ${lang.region}`
                        ? "border-black bg-gray-50"
                        : "border-gray-300 hover:border-black"
                    }`}
                  >
                    <div className="text-sm mb-0.5">
                      {lang.language}
                    </div>
                    <div className="text-xs text-gray-600">
                      {lang.region}
                    </div>
                  </button>
                ))}
              </div>

              {/* All languages */}
              <h3
                className="text-base mb-4"
                style={{ fontWeight: 600 }}
              >
                Choisissez une langue et une région
              </h3>
              <div className="grid grid-cols-5 gap-3">
                {languages.map((lang, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setSelectedLanguage(
                        `${lang.language} ${lang.region}`,
                      )
                    }
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedLanguage ===
                      `${lang.language} ${lang.region}`
                        ? "border-black bg-gray-50"
                        : "hover:bg-gray-50 border-none"
                    }`}
                  >
                    <div className="text-sm mb-0.5">
                      {lang.language}
                    </div>
                    <div className="text-xs text-gray-600">
                      {lang.region}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}