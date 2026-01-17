import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface BecomeHostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption?: (
    option: "logement" | "experience" | "service",
  ) => void;
}

export function BecomeHostModal({
  isOpen,
  onClose,
  onSelectOption,
}: BecomeHostModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [selectedOption, setSelectedOption] = useState<"logement" | "experience" | "service" | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Reset selection when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOption(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptionClick = (
    option: "logement" | "experience" | "service",
  ) => {
    setSelectedOption(option);
  };

  const handleNextClick = () => {
    if (selectedOption && onSelectOption) {
      onSelectOption(selectedOption);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Overlay background with subtle blur */}
      <div className="absolute inset-0 bg-black/60 transition-opacity" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-3xl w-full max-w-5xl mx-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ height: "85vh", maxHeight: "700px" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 z-10 w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Content */}
        <div className="px-8 py-12 w-full h-full flex flex-col">
          {/* Title */}
          <div className="text-center mb-16 mt-8">
            <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
              Que souhaitez-vous proposer ?
            </h2>
            <p className="text-gray-500 mt-3 text-sm">
              Sélectionnez le type d'offre que vous souhaitez créer
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto flex-1 items-center">
            {/* Logement */}
            <button
              onClick={() => handleOptionClick("logement")}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedOption === 'logement'
                  ? 'bg-gray-900 shadow-xl scale-105 ring-2 ring-gray-900 ring-offset-4'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:scale-102 active:scale-98'
              }`}
            >
              <div className="mb-5 transition-transform duration-300 group-hover:scale-105 relative">
                <div className={`w-32 h-32 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  selectedOption === 'logement' ? 'ring-4 ring-white/20' : ''
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Modern house exterior"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className={`text-lg font-semibold transition-colors ${
                selectedOption === 'logement' ? 'text-white' : 'text-gray-900'
              }`}>
                Logement
              </span>
              <span className={`text-xs mt-2 transition-colors ${
                selectedOption === 'logement' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Maison, appartement...
              </span>
            </button>

            {/* Expérience */}
            <button
              onClick={() => handleOptionClick("experience")}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedOption === 'experience'
                  ? 'bg-gray-900 shadow-xl scale-105 ring-2 ring-gray-900 ring-offset-4'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:scale-102 active:scale-98'
              }`}
            >
              <div className="mb-5 transition-transform duration-300 group-hover:scale-105 relative">
                <div className={`w-32 h-32 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  selectedOption === 'experience' ? 'ring-4 ring-white/20' : ''
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Adventure experience - mountain landscape"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className={`text-lg font-semibold transition-colors ${
                selectedOption === 'experience' ? 'text-white' : 'text-gray-900'
              }`}>
                Expérience
              </span>
              <span className={`text-xs mt-2 transition-colors ${
                selectedOption === 'experience' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Activité, visite guidée...
              </span>
            </button>

            {/* Service */}
            <button
              onClick={() => handleOptionClick("service")}
              className={`group relative flex flex-col items-center justify-center p-8 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedOption === 'service'
                  ? 'bg-gray-900 shadow-xl scale-105 ring-2 ring-gray-900 ring-offset-4'
                  : 'bg-white border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg hover:scale-102 active:scale-98'
              }`}
            >
              <div className="mb-5 transition-transform duration-300 group-hover:scale-105 relative">
                <div className={`w-32 h-32 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                  selectedOption === 'service' ? 'ring-4 ring-white/20' : ''
                }`}>
                  <img
                    src="https://images.unsplash.com/photo-1556761175-b413da4baf72?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                    alt="Professional service - team collaboration"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <span className={`text-lg font-semibold transition-colors ${
                selectedOption === 'service' ? 'text-white' : 'text-gray-900'
              }`}>
                Service
              </span>
              <span className={`text-xs mt-2 transition-colors ${
                selectedOption === 'service' ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Prestation, assistance...
              </span>
            </button>
          </div>

          {/* Footer with Next button */}
          <div className="border-t border-gray-100 mt-auto pt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {selectedOption ? '1 option sélectionnée' : 'Aucune sélection'}
              </p>
              <button
                onClick={handleNextClick}
                disabled={!selectedOption}
                className={`px-8 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedOption
                    ? 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:scale-105 active:scale-95'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}