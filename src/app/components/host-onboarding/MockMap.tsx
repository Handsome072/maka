'use client';

import { MapPin, Plus, Minus } from 'lucide-react';

export function MockMap() {
  return (
    <div className="w-full h-full relative bg-[#E5E3DF] overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#999" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <path d="M0 100 Q 150 50 300 150 T 600 100" stroke="#fff" strokeWidth="15" fill="none" />
        <path d="M100 0 Q 150 300 100 600" stroke="#fff" strokeWidth="12" fill="none" />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full drop-shadow-lg">
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center relative z-10">
          <MapPin className="w-5 h-5 text-white" fill="white" />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rotate-45 transform origin-center z-[-1]" />
        </div>
        <div className="w-4 h-1.5 bg-black/20 rounded-[100%] absolute -bottom-2 left-1/2 -translate-x-1/2 blur-[2px]" />
      </div>
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition-colors border border-gray-100">
          <Plus className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-gray-50 text-gray-700 font-bold transition-colors border border-gray-100">
          <Minus className="w-4 h-4" />
        </button>
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-gray-600 bg-white/80 px-2 py-1 rounded pointer-events-none backdrop-blur-sm">
        © OpenStreetMap contributors
      </div>
    </div>
  );
}
