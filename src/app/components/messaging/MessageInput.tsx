import { useState, useRef, useCallback } from 'react';
import { Send, Image as ImageIcon, X } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  onSendImage: (file: File, text?: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, onSendImage, disabled }: MessageInputProps) {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<{ file: File; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    if (disabled) return;

    if (imagePreview) {
      onSendImage(imagePreview.file, text.trim() || undefined);
      URL.revokeObjectURL(imagePreview.url);
      setImagePreview(null);
      setText('');
      return;
    }

    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  }, [text, imagePreview, disabled, onSendMessage, onSendImage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return; // 10MB max

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview.url);
    }

    setImagePreview({
      file,
      url: URL.createObjectURL(file),
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview.url);
      setImagePreview(null);
    }
  };

  const canSend = !disabled && (text.trim() || imagePreview);

  return (
    <div className="px-6 py-4 border-t border-gray-200">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={imagePreview.url}
            alt="Aperçu"
            className="h-20 rounded-lg object-cover border border-gray-200"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Image button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
        >
          <ImageIcon className="w-5 h-5" style={{ color: '#717171' }} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Text input */}
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          disabled={disabled}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
            canSend
              ? 'bg-black hover:bg-gray-800 cursor-pointer'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
}
