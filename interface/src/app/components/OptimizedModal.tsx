import { memo, ReactNode } from "react";
import { X } from "lucide-react";

interface OptimizedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
  hasScrollableContent?: boolean;
  zIndex?: number;
}

export const OptimizedModal = memo(function OptimizedModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "max-w-md",
  hasScrollableContent = false,
  zIndex = 80
}: OptimizedModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 gpu-accelerated"
      style={{ zIndex }}
    >
      <div 
        className={`bg-white rounded-2xl w-full ${maxWidth} relative ${
          hasScrollableContent ? 'max-h-[90vh] flex flex-col' : ''
        } gpu-accelerated`}
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 p-4 flex items-center justify-center relative flex-shrink-0">
          <h2 className="text-base" style={{ fontWeight: 600, color: "#222222" }}>
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="absolute right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" style={{ color: "#222222" }} />
          </button>
        </div>

        {/* Modal Content */}
        <div className={hasScrollableContent ? "overflow-y-auto flex-1 scrollbar-hide" : ""}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
});
