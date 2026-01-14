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
      className="fixed inset-0 z-[70] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Overlay background */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-4xl w-full max-w-6xl mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{ height: "80vh" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-6 py-16 w-full h-full flex flex-col">
          {/* Title */}
          <h2
            className="text-center text-2xl mb-20 mt-4"
            style={{ fontWeight: 600 }}
          >
            Que souhaitez-vous proposer ?
          </h2>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full flex-1 mx-auto mb-20">
            {/* Logement */}
            <button
              onClick={() => handleOptionClick("logement")}
              className={`flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
                selectedOption === 'logement' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="mb-6">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* House icon */}
                  <rect
                    x="16"
                    y="28"
                    width="32"
                    height="28"
                    fill="#E8E8E8"
                  />
                  <rect
                    x="16"
                    y="28"
                    width="32"
                    height="4"
                    fill="#B8B8B8"
                  />
                  <polygon
                    points="32,12 12,28 16,28 16,24 48,24 48,28 52,28"
                    fill="#6B6B6B"
                  />
                  <rect
                    x="26"
                    y="38"
                    width="12"
                    height="18"
                    fill="#10B981"
                  />
                  <circle
                    cx="20"
                    cy="18"
                    r="3"
                    fill="#4CAF50"
                  />
                </svg>
              </div>
              <span
                className="text-base"
                style={{ fontWeight: 600 }}
              >
                Logement
              </span>
            </button>

            {/* Expérience */}
            <button
              onClick={() => handleOptionClick("experience")}
              className={`flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
                selectedOption === 'experience' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="mb-6">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Hot air balloon */}
                  <ellipse
                    cx="32"
                    cy="28"
                    rx="16"
                    ry="20"
                    fill="#10B981"
                  />
                  <path
                    d="M24 44 L28 28 L36 28 L40 44 Z"
                    fill="#8B4513"
                  />
                  <rect
                    x="26"
                    y="44"
                    width="12"
                    height="8"
                    fill="#D4A574"
                    stroke="#8B4513"
                    strokeWidth="1"
                  />
                  <line
                    x1="28"
                    y1="28"
                    x2="26"
                    y2="44"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="36"
                    y1="28"
                    x2="38"
                    y2="44"
                    stroke="#8B4513"
                    strokeWidth="1.5"
                  />
                  <line
                    x1="32"
                    y1="28"
                    x2="32"
                    y2="44"
                    stroke="#8B4513"
                    strokeWidth="1"
                  />
                </svg>
              </div>
              <span
                className="text-base"
                style={{ fontWeight: 600 }}
              >
                Expérience
              </span>
            </button>

            {/* Service */}
            <button
              onClick={() => handleOptionClick("service")}
              className={`flex flex-col items-center justify-center p-8 border-2 rounded-xl cursor-pointer transition-all ${
                selectedOption === 'service' ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="mb-6">
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Bell icon */}
                  <path
                    d="M32 16 L32 20 M32 20 C26 20 22 24 22 30 L22 38 L18 42 L46 42 L42 38 L42 30 C42 24 38 20 32 20 Z M28 46 C28 48 30 50 32 50 C34 50 36 48 36 46"
                    stroke="#2C2C2C"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <line
                    x1="18"
                    y1="42"
                    x2="46"
                    y2="42"
                    stroke="#2C2C2C"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="40"
                    cy="24"
                    r="3"
                    fill="#10B981"
                  />
                </svg>
              </div>
              <span
                className="text-base"
                style={{ fontWeight: 600 }}
              >
                Service
              </span>
            </button>
          </div>

          <div className='border absolute bottom-0 right-0 w-full'>
            {/* Footer with Next button */}
            <div className="flex justify-end pt-6 pb-4 px-6 ">
              <button
                onClick={handleNextClick}
                disabled={!selectedOption}
                className={`px-6 py-3 rounded-lg text-sm transition-opacity ${
                  selectedOption 
                    ? 'bg-gray-900 text-white hover:opacity-90' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                style={{ fontWeight: 600 }}
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