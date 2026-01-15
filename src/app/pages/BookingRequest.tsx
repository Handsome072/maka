import { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';

interface BookingRequestProps {
  onBack: () => void;
  bookingData?: {
    title: string;
    image: string;
    rating: number;
    location: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    pricePerNight: number;
  };
}

export function BookingRequest({ onBack, bookingData }: BookingRequestProps) {
  const [paymentTiming, setPaymentTiming] = useState<'now' | 'later'>('now');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'googlepay'>('card');
  const [message, setMessage] = useState('');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [editingStep, setEditingStep] = useState<number | null>(null);

  // Default data si aucune donnée n'est passée
  const data = bookingData || {
    title: "Superbe studio de 15m² au calme tout confort",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    rating: 4.96,
    location: "Coup de cœur voyageurs",
    checkIn: "3-4",
    checkOut: "avr. 2026",
    guests: 1,
    nights: 2,
    pricePerNight: 87.56
  };

  const subtotal = data.nights * data.pricePerNight;
  const taxes = 18.99;
  const total = subtotal + taxes;

  const isStepCompleted = (step: number) => completedSteps.includes(step);
  const isStepEditable = (step: number) => {
    if (step === 1) return true;
    return isStepCompleted(step - 1);
  };
  const isStepEditing = (step: number) => editingStep === step || (!isStepCompleted(step) && isStepEditable(step));

  const completeStep = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
    setEditingStep(null);
  };

  const editStep = (step: number) => {
    setEditingStep(step);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-5">
          <div className="flex items-center justify-center">
            <img
              src="/logo.png"
              alt="HOMIQIO Logo"
              className="w-[150px] h-auto"
            />
          </div>
        </div>
      </header>

      <div className="max-w-[1120px] mx-auto px-6 md:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-16">
          {/* Left Column - Form */}
          <div>
            <div className="flex items-center gap-8 -ml-20">
            {/* Back Button */}
            <button onClick={onBack} className="flex items-center gap-2 mb-8 hover:underline bg-gray-100 p-4 rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Title */}
            <h1 className="text-[32px] mb-8" style={{ fontWeight: 600 }}>
              Demande de réservation
            </h1>
            </div>

            {/* Step 1: Choose payment timing */}
            <div className={`mb-6 ${isStepEditing(1) ? 'rounded-2xl p-6 shadow-lg' : 'rounded-2xl p-6 border border-gray-300'}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ fontWeight: 600 }}>
                  1. Choisissez quand vous souhaitez payer
                </h2>
                {isStepCompleted(1) && !isStepEditing(1) && (
                  <button 
                    onClick={() => editStep(1)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Changer
                  </button>
                )}
              </div>

              {isStepEditing(1) && (
                <div className="space-y-4">
                  {/* Pay now option */}
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-timing"
                      checked={paymentTiming === 'now'}
                      onChange={() => setPaymentTiming('now')}
                      className="mt-1 w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-base mb-1" style={{ fontWeight: 600 }}>
                        Payer ${total.toFixed(2)} maintenant
                      </p>
                    </div>
                  </label>

                  {/* Pay later option */}
                  <label className="flex items-start gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment-timing"
                      checked={paymentTiming === 'later'}
                      onChange={() => setPaymentTiming('later')}
                      className="mt-1 w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                    <div className="flex-1">
                      <p className="text-base mb-2">
                        Payer une partie maintenant et l'autre plus tard
                      </p>
                      <p className="text-sm text-gray-600">
                        ${(total / 2).toFixed(2)} maintenant, ${(total / 2).toFixed(2)} à payer le 25 mars. Pas de frais supplémentaires.{' '}
                        <button className="underline" style={{ fontWeight: 600 }}>
                          Plus d'informations
                        </button>
                      </p>
                    </div>
                  </label>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => completeStep(1)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-base"
                      style={{ fontWeight: 600 }}
                    >
                      {isStepCompleted(1) ? 'Terminer' : 'Suivant'}
                    </button>
                  </div>
                </div>
              )}

              {isStepCompleted(1) && !isStepEditing(1) && (
                <p className="text-base">
                  Payer ${total.toFixed(2)} maintenant
                </p>
              )}
            </div>

            {/* Step 2: Payment method */}
            <div className={`mb-6 p-6 ${isStepCompleted(2) && !isStepEditing(2) ? 'border border-gray-300 rounded-2xl' : ' shadow-lg border border-gray-300 rounded-2xl'} ${!isStepEditable(2) ? 'pointer-events-none shadow-none' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-bold" style={{ fontWeight: 600 }}>
                  2. Ajoutez un mode de paiement
                </h2>
                {isStepCompleted(2) && !isStepEditing(2) && (
                  <button 
                    onClick={() => editStep(2)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Changer
                  </button>
                )}
              </div>

              {isStepEditing(2) && (
                <div>
                  <div className="rounded-2xl mb-4">
                    {/* Card option */}
                    <label className="flex items-center justify-between mb-6 cursor-pointer pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="3" fill="#1A1F71"/>
                            <rect x="6" y="8" width="20" height="8" rx="1" fill="#FF5F00"/>
                            <circle cx="12" cy="12" r="5" fill="#EB001B"/>
                            <circle cx="20" cy="12" r="5" fill="#F79E1B"/>
                          </svg>
                          <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="3" fill="#0066B2"/>
                            <path d="M12 8h8v8h-8z" fill="#FFA500"/>
                          </svg>
                          <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="3" fill="#00579F"/>
                            <path d="M14 8l4 8h-8l4-8z" fill="#FAA61A"/>
                          </svg>
                          <svg className="w-8 h-6" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="3" fill="#E21836"/>
                          </svg>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="payment-method"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                      />
                    </label>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4">
                        <p className="text-base mb-4" style={{ fontWeight: 600 }}>
                          Carte de crédit ou de débit
                        </p>
                        
                        <input
                          type="text"
                          placeholder="Numéro de carte"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Expiration"
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <input
                            type="text"
                            placeholder="Cryptogramme"
                            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                        </div>
                        
                        <input
                          type="text"
                          placeholder="Code postal"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                        />
                        
                        <div className="relative">
                          <input
                            type="text"
                            value="France"
                            readOnly
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                          />
                          <select className="absolute inset-0 opacity-0 cursor-pointer">
                            <option>France</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* PayPal */}
                  <label className="flex items-center justify-between py-4 border-t border-gray-300 rounded-lg mb-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#003087">
                        <path d="M20.905 9.5c.21-1.342.095-2.256-.432-3.016C19.628 5.397 17.983 5 15.634 5H8.849c-.51 0-.945.37-1.025.876l-3.015 19.13c-.06.38.227.732.613.732h4.458l1.12-7.1-.035.224c.08-.506.51-.876 1.025-.876h2.138c4.201 0 7.49-1.707 8.45-6.644.027-.138.048-.272.067-.402.362-2.324-.001-3.904-1.74-5.44z"/>
                      </svg>
                      <span className="text-base">PayPal</span>
                    </div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'paypal'}
                      onChange={() => setPaymentMethod('paypal')}
                      className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                  </label>

                  {/* Google Pay */}
                  <label className="flex items-center justify-between py-4 border-t border-gray-300 rounded-lg mb-6 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#4285F4"/>
                      </svg>
                      <span className="text-base">Google Pay</span>
                    </div>
                    <input
                      type="radio"
                      name="payment-method"
                      checked={paymentMethod === 'googlepay'}
                      onChange={() => setPaymentMethod('googlepay')}
                      className="w-5 h-5 text-gray-900 border-gray-300 focus:ring-gray-900"
                    />
                  </label>

                  <div className="flex justify-end">
                    <button
                      onClick={() => completeStep(2)}
                      className={`px-6 py-3 text-white rounded-lg transition-colors text-base ${
                        paymentMethod === 'paypal' 
                          ? 'bg-[#0b3382] hover:bg-[#082a6b]' 
                          : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {paymentMethod === 'paypal' 
                        ? 'Associer à PayPal' 
                        : (isStepCompleted(2) ? 'Terminer' : 'Suivant')
                      }
                    </button>
                  </div>
                </div>
              )}

              {isStepCompleted(2) && !isStepEditing(2) && (
                <p className="text-base flex items-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#4285F4">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
                  </svg>
                  Google Pay
                </p>
              )}
            </div>

            {/* Step 3: Message to host */}
            <div className={`mb-6 rounded-2xl p-6 ${isStepCompleted(3) && !isStepEditing(3) ? 'border border-gray-300' : 'shadow-lg'} ${!isStepEditable(3) ? 'pointer-events-none shadow-none border border-gray-300 ' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px]" style={{ fontWeight: 600 }}>
                  3. Envoyez un message à l'hôte
                </h2>
                {isStepCompleted(3) && !isStepEditing(3) && (
                  <button 
                    onClick={() => editStep(3)}
                    className="text-base underline"
                    style={{ fontWeight: 600 }}
                  >
                    Changer
                  </button>
                )}
              </div>

              {isStepEditing(3) && (
                <div className="rounded-2xl">
                  <p className="text-sm text-gray-700 mb-4">
                    Avant de continuer, dites-lui un peu plus à Jeremy sur votre voyage et expliquez-lui pourquoi son logement est une bonne option.
                  </p>

                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1664482017668-91158897414c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
                      alt="Jérémy"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-base" style={{ fontWeight: 600 }}>Jérémy</p>
                      <p className="text-sm text-gray-600">Hôte depuis 2025</p>
                    </div>
                  </div>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Par exemple: « Bonjour Jérémy, mon partenaire et moi allons au mariage d'un ami et votre logement est tout proche. »"
                    className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 text-base"
                  />

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => completeStep(3)}
                      className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-base"
                      style={{ fontWeight: 600 }}
                    >
                      {isStepCompleted(3) ? 'Terminer' : 'Suivant'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4: Verify request */}
            <div className={`mb-6 p-6 ${isStepEditable(4) ? 'shadow-lg p-6 rounded-2xl' : ''} ${!isStepEditable(4) ? 'pointer-events-none shadow-none rounded-2xl border border-gray-300 ' : ''}`}>
              <h2 className="text-[22px] mb-4" style={{ fontWeight: 600 }}>
                4. Vérifiez votre demande
              </h2>
              
              {isStepEditable(4) && (
                <div>
                  <p className="text-base text-gray-700 mb-4">
                    L'hôte a 24 heures pour confirmer votre réservation. Nous vous débiterons une fois la demande acceptée.
                  </p>
                  
                  <p className="text-sm text-gray-700 mb-6">
                    En sélectionnant le bouton, j'accepte les{' '}
                    <button className="underline" style={{ fontWeight: 600 }}>
                      conditions de réservation
                    </button>
                    .
                  </p>

                  {/* Payment button based on selected method */}
                  {paymentMethod === 'googlepay' && (
                    <button className="w-full bg-black text-white rounded-lg py-4 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
                      <svg className="h-6" viewBox="0 0 48 20" fill="none">
                        <path d="M22.5 9.5h-3.6v5.9h-2.3V5.1h5.9c1.7 0 3 .4 3.9 1.3.9.9 1.4 2.1 1.4 3.6 0 1.6-.5 2.8-1.4 3.7-.9.9-2.2 1.3-3.9 1.3zm0-6.7h-3.6v4.4h3.6c.9 0 1.6-.3 2.1-.8.5-.5.8-1.2.8-2.1s-.3-1.6-.8-2.1c-.5-.3-1.2-.4-2.1-.4zm11.6 12.8c-1.2 0-2.1-.3-2.8-1-.7-.7-1-1.6-1-2.8V8.2h-1.7V6.5h1.7V3.7h2.3v2.8h2.8v1.7h-2.8v3.6c0 .5.1.9.4 1.2.3.3.6.4 1.1.4.6 0 1.1-.2 1.6-.5v1.9c-.6.5-1.3.8-2.6.8zm7.9.1c-1.2 0-2.1-.4-2.8-1.1V21h-2.3V6.5h2.3v1c.7-.8 1.6-1.2 2.8-1.2 1.3 0 2.3.4 3.1 1.3.8.9 1.2 2 1.2 3.5s-.4 2.7-1.2 3.6c-.8.8-1.9 1.3-3.1 1.3zm-.5-7.6c-.7 0-1.3.2-1.8.7-.5.5-.7 1.2-.7 2.1v.3c0 .9.2 1.6.7 2.1.5.5 1.1.7 1.8.7.7 0 1.3-.3 1.7-.8.4-.5.7-1.3.7-2.2s-.2-1.7-.7-2.2c-.4-.5-1-.7-1.7-.7z" fill="white"/>
                        <path d="M23.4 9.2c0-1.3-.4-2.3-1.1-3-.7-.7-1.7-1.1-3-1.1H15v10.3h2.3V11h2.1l2.1 4.4h2.5l-2.3-4.6c.9-.4 1.6-1 2.1-1.8.4-.5.6-1.2.6-1.8z" fill="#EA4335"/>
                        <path d="M30.1 6.3c-1.3 0-2.3.4-3.1 1.3-.8.8-1.2 2-1.2 3.5s.4 2.6 1.2 3.5c.8.9 1.9 1.3 3.1 1.3 1.3 0 2.3-.4 3.1-1.3.8-.9 1.2-2 1.2-3.5s-.4-2.6-1.2-3.5c-.8-.9-1.8-1.3-3.1-1.3zm1.7 6.5c-.4.5-1 .8-1.7.8s-1.3-.3-1.7-.8c-.4-.5-.7-1.3-.7-2.2s.2-1.7.7-2.2c.4-.5 1-.8 1.7-.8s1.3.3 1.7.8c.4.5.7 1.3.7 2.2s-.2 1.6-.7 2.2z" fill="#FBBC04"/>
                        <path d="M41.5 6.3c-1.3 0-2.3.4-3.1 1.3-.8.8-1.2 2-1.2 3.5s.4 2.6 1.2 3.5c.8.9 1.9 1.3 3.1 1.3 1.3 0 2.3-.4 3.1-1.3.8-.9 1.2-2 1.2-3.5s-.4-2.6-1.2-3.5c-.8-.9-1.8-1.3-3.1-1.3zm1.7 6.5c-.4.5-1 .8-1.7.8s-1.3-.3-1.7-.8c-.4-.5-.7-1.3-.7-2.2s.2-1.7.7-2.2c.4-.5 1-.8 1.7-.8s1.3.3 1.7.8c.4.5.7 1.3.7 2.2s-.2 1.6-.7 2.2z" fill="#4285F4"/>
                        <path d="M8.8 10.2c0-.3 0-.6-.1-.9H4.5v1.7h2.4c-.1.5-.4.9-.8 1.2v1.1h1.3c.8-.7 1.4-1.8 1.4-3.1z" fill="#4285F4"/>
                        <path d="M4.5 14.3c1.1 0 2-.4 2.6-1l-1.3-1c-.3.2-.7.3-1.3.3-1 0-1.9-.7-2.2-1.6H1v1.1c.6 1.2 1.9 2.2 3.5 2.2z" fill="#34A853"/>
                        <path d="M2.3 10.9c-.1-.3-.2-.6-.2-.9s.1-.6.2-.9V8H1c-.3.6-.5 1.2-.5 1.9s.2 1.3.5 1.9l1.3-1z" fill="#FBBC04"/>
                        <path d="M4.5 7.5c.6 0 1.1.2 1.5.6l1.1-1.1C6.5 6.4 5.6 6 4.5 6 2.9 6 1.6 7 1 8.2l1.3 1c.3-1 1.2-1.7 2.2-1.7z" fill="#EA4335"/>
                      </svg>
                    </button>
                  )}

                  {paymentMethod === 'paypal' && (
                    <button className="w-full bg-[#0070BA] text-white rounded-lg py-4 flex items-center justify-center gap-2 hover:bg-[#005A92] transition-colors">
                      <svg className="h-6" viewBox="0 0 100 32" fill="white">
                        <path d="M12.237 2.8H4.842a.8.8 0 00-.79.676L.856 26.264a.48.48 0 00.474.556h3.454a.8.8 0 00.79-.676l.858-5.435a.8.8 0 01.79-.676h1.822c3.791 0 5.982-1.834 6.555-5.468.262-1.588.003-2.835-.768-3.71-.848-.964-2.35-1.474-4.344-1.474zM13.092 12.3c-.297 1.947-1.786 1.947-3.226 1.947h-.818l.574-3.638a.48.48 0 01.474-.406h.398c1.039 0 2.019 0 2.526.591.304.355.397.881.297 1.506zm15.447-.051h-3.46a.48.48 0 00-.474.406l-.122.772-.193-.28c-.6-.87-1.937-1.162-3.268-1.162-3.056 0-5.665 2.316-6.172 5.564-.263 1.621.113 3.17 1.027 4.246.84 .99 2.037 1.4 3.464 1.4 2.45 0 3.805-1.574 3.805-1.574l-.123.77a.48.48 0 00.474.556h3.117a.8.8 0 00.79-.676l1.49-9.436a.48.48 0 00-.474-.556zm-4.81 5.423c-.264 1.564-1.514 2.615-3.11 2.615-.8 0-1.44-.258-1.847-.745-.403-.482-.555-1.17-.427-1.936.247-1.55 1.518-2.637 3.085-2.637.782 0 1.418.26 1.835.751.422.498.585 1.19.464 1.952zm17.335-5.423h-3.474a.8.8 0 00-.663.352l-3.827 5.637-1.621-5.41a.8.8 0 00-.764-.58h-3.413a.48.48 0 00-.454.633l3.056 8.968-2.873 4.056a.48.48 0 00.39.756h3.47a.8.8 0 00.66-.346l9.233-13.326a.48.48 0 00-.39-.756z"/>
                        <path d="M79.457 2.8h-7.395a.8.8 0 00-.79.676l-3.196 20.288a.48.48 0 00.474.556h3.694a.56.56 0 00.553-.475l.908-5.753a.8.8 0 01.79-.676h1.822c3.791 0 5.982-1.834 6.555-5.468.262-1.588.003-2.835-.768-3.71-.848-.964-2.35-1.474-4.344-1.474zm.855 5.5c-.297 1.947-1.786 1.947-3.226 1.947h-.818l.574-3.638a.48.48 0 01.474-.406h.398c1.039 0 2.019 0 2.526.591.304.355.397.881.297 1.506zm15.447-.051h-3.46a.48.48 0 00-.474.406l-.122.772-.193-.28c-.6-.87-1.937-1.162-3.268-1.162-3.056 0-5.665 2.316-6.172 5.564-.263 1.621.113 3.17 1.027 4.246.84.99 2.037 1.4 3.464 1.4 2.45 0 3.805-1.574 3.805-1.574l-.123.77a.48.48 0 00.474.556h3.117a.8.8 0 00.79-.676l1.49-9.436a.48.48 0 00-.474-.556zm-4.81 5.423c-.264 1.564-1.514 2.615-3.11 2.615-.8 0-1.44-.258-1.847-.745-.403-.482-.555-1.17-.427-1.936.247-1.55 1.518-2.637 3.085-2.637.782 0 1.418.26 1.835.751.422.498.585 1.19.464 1.952z"/>
                      </svg>
                    </button>
                  )}

                  {paymentMethod === 'card' && (
                    <button className="w-full bg-[#000000] text-white rounded-lg py-4 flex items-center justify-center gap-2 hover:bg-[#222222] transition-colors text-base" style={{ fontWeight: 600 }}>
                      Confirmer et payer
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="border border-gray-200 rounded-2xl p-6 mt-20">
              {/* Property info */}
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={data.image}
                  alt={data.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-base mb-2" style={{ fontWeight: 600 }}>
                    {data.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span style={{ fontWeight: 600 }}>{data.rating.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">{data.location}</p>
                </div>
              </div>

              {/* Cancellation */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="text-base mb-2" style={{ fontWeight: 600 }}>
                  Annulation gratuite
                </h4>
                <p className="text-sm text-gray-700">
                  Annulez avant le 2 avril pour recevoir un remboursement intégral.{' '}
                  <button className="underline" style={{ fontWeight: 600 }}>
                    Consulter les conditions complètes
                  </button>
                </p>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Dates</h4>
                  <p className="text-sm text-gray-700">{data.checkIn}-{data.checkOut}</p>
                </div>
                <button className="text-base underline" style={{ fontWeight: 600 }}>
                  Modifier
                </button>
              </div>

              {/* Guests */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div>
                  <h4 className="text-base" style={{ fontWeight: 600 }}>Voyageurs</h4>
                  <p className="text-sm text-gray-700">{data.guests} adulte</p>
                </div>
                <button className="text-base underline" style={{ fontWeight: 600 }}>
                  Modifier
                </button>
              </div>

              {/* Price breakdown */}
              <h4 className="text-base mb-4" style={{ fontWeight: 600 }}>
                Détail du prix
              </h4>
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center justify-between text-base">
                  <span className="underline">{data.nights} nuits x ${data.pricePerNight.toFixed(2)}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="underline">Taxes</span>
                  <span>${taxes.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-base" style={{ fontWeight: 600 }}>Total USD</span>
                <span className="text-base" style={{ fontWeight: 600 }}>${total.toFixed(2)}</span>
              </div>
              <button className="text-sm underline mb-6" style={{ fontWeight: 600 }}>
                Détail du prix
              </button>

              {/* Warning */}
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <svg className="w-5 h-5 flex-shrink-0 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-gray-900">
                  Perle rare ! Les réservations pour ce logement sont fréquentes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-[1480px] mx-auto px-6 md:px-10 lg:px-20 py-6">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
            <button className="hover:underline">Confidentialité</button>
            <span>·</span>
            <button className="hover:underline">Conditions générales</button>
            <span>·</span>
            <button className="hover:underline">Fonctionnement du site</button>
            <span>·</span>
            <button className="hover:underline">Infos sur l'entreprise</button>
          </div>
        </div>
      </footer>
    </div>
  );
}