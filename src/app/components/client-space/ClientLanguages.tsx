'use client';


export function ClientLanguages() {
  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 md:py-8 w-full">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <h2 className="text-xl md:text-3xl" style={{ fontWeight: 600, color: '#222222' }}>
            Langues et devise
          </h2>
        </div>

        <div className="space-y-6">
          {/* Langue préférée */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Langue préférée
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Français
                </p>
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600, color: '#222222' }}>
                Modifier
              </button>
            </div>
          </div>

          {/* Devise préférée */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Devise préférée
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Euro
                </p>
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600, color: '#222222' }}>
                Modifier
              </button>
            </div>
          </div>

          {/* Fuseau horaire */}
          <div className="border-b border-gray-200 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm md:text-base mb-2" style={{ fontWeight: 600, color: '#222222' }}>
                  Fuseau horaire
                </h3>
              </div>
              <button className="text-sm underline" style={{ fontWeight: 600, color: '#222222' }}>
                Modifier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
