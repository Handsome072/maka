'use client';

import { Check, ChevronDown, ChevronUp, HelpCircle, Info } from 'lucide-react';
import { useHostOnboarding } from '../HostOnboardingContext';
import { DAYS_OF_WEEK } from '../constants';

export function ReservationModeStep() {
  const {
    reservationMode,
    setReservationMode,
    arrivalTime,
    setArrivalTime,
    departureTime,
    setDepartureTime,
    minStay,
    setMinStay,
    maxStay,
    setMaxStay,
    advancedStaySettingsOpen,
    setAdvancedStaySettingsOpen,
    departureDays,
    setDepartureDays,
    arrivalDays,
    setArrivalDays,
  } = useHostOnboarding();

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-[#222222]">Définissez le mode de réservation</h1>
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#222222]">Indiquez aux invités comment réserver votre chalet</h3>
        <div className="space-y-4">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="mt-1 relative">
              <input type="radio" name="reservationMode" className="peer sr-only" checked={reservationMode === 'request'} onChange={() => setReservationMode('request')} />
              <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-black peer-checked:border-[6px] transition-all" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className="font-medium text-[#222222]">Demande de réservation</span><Info className="w-4 h-4 text-gray-400" /></div>
              <p className="text-[#717171] text-sm leading-relaxed">Les locations seront approuvées par l'équipe de HOMIQIO. Il est essentiel de maintenir vos calendriers de disponibilité à jour en tout temps.</p>
            </div>
          </label>
          <label className="flex items-start gap-4 cursor-pointer group opacity-75">
            <div className="mt-1 relative">
              <input type="radio" name="reservationMode" className="peer sr-only" checked={reservationMode === 'instant'} onChange={() => setReservationMode('instant')} />
              <div className="w-5 h-5 rounded-full border border-gray-300 peer-checked:border-black peer-checked:border-[6px] transition-all" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1"><span className="font-medium text-[#222222]">Réservation instantanée</span><span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">À venir</span></div>
              <p className="text-[#717171] text-sm leading-relaxed">Vous pourrez louer votre chalet de façon instantanée, sans avoir à répondre à chaque demande individuelle.</p>
            </div>
          </label>
        </div>
      </div>
      <div className="w-full h-px bg-gray-100" />
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-[#222222]">Indiquez aux invités l'heure d'arrivée et de départ</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#222222]">Heure d'arrivée</label>
            <div className="relative">
              <select value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                {['15:00', '16:00', '17:00', '18:00', '19:00'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#222222]">Heure de départ</label>
            <div className="relative">
              <select value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
                {['10:00', '11:00', '12:00', '13:00'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-px bg-gray-100" />
      <div className="space-y-8">
        <h2 className="text-lg font-bold text-[#222222]">Durée du séjour</h2>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-500 uppercase">Durée minimum d'un séjour</label>
          <div className="relative">
            <select value={minStay} onChange={(e) => setMinStay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
              {[1, 2, 3, 4, 5, 6, 7].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-500 uppercase">Durée maximale d'un séjour</label>
          <div className="relative">
            <select value={maxStay} onChange={(e) => setMaxStay(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white cursor-pointer focus:outline-none focus:border-black">
              <option value="Aucun maximum">Aucun maximum</option>
              {[7, 14, 28].map((n) => <option key={n} value={n}>{n} jours</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="pt-4 border-t border-gray-100">
          <button onClick={() => setAdvancedStaySettingsOpen(!advancedStaySettingsOpen)} className="flex items-center justify-between w-full py-2">
            <span className="font-medium text-[#222222]">Paramètres avancés</span>
            {advancedStaySettingsOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </button>
          {advancedStaySettingsOpen && (
            <div className="pt-6 space-y-8 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-[#222222]">Sélectionnez les jours de départ</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day} className="flex flex-col items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-500">{day}</span>
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${departureDays[day] ? 'bg-black border-black' : 'border-gray-300 bg-white'}`} onClick={() => setDepartureDays((prev) => ({ ...prev, [day]: !prev[day] }))}>
                        {departureDays[day] && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-[#222222]">Sélectionnez les jours d'arrivée</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                <div className="flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day) => (
                    <label key={day} className="flex flex-col items-center gap-2 cursor-pointer">
                      <span className="text-sm text-gray-500">{day}</span>
                      <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${arrivalDays[day] ? 'bg-black border-black' : 'border-gray-300 bg-white'}`} onClick={() => setArrivalDays((prev) => ({ ...prev, [day]: !prev[day] }))}>
                        {arrivalDays[day] && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2"><label className="text-sm font-medium text-[#222222]">Durée minimale du séjour en fonction du jour</label><HelpCircle className="w-4 h-4 text-gray-400" /></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Lundi', 'Mardi', 'Mercredi'].map((day) => (
                    <div key={day} className="space-y-2">
                      <label className="text-xs font-medium text-gray-500">{day}</label>
                      <div className="relative">
                        <select className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white"><option>-</option>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
