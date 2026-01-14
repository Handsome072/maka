import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react';
import { useState, useMemo } from 'react';
import { ExperienceDatePicker } from './ExperienceDatePicker';

interface DatePickerProps {
  onClose: () => void;
  onDatesChange?: (startDate: Date | null, endDate: Date | null) => void;
}

export function DatePicker({ onClose, onDatesChange }: DatePickerProps) {
  const [activeTab, setActiveTab] = useState<'dates' | 'mois' | 'flexible'>('dates');
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 0)); // Janvier 2026
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedMonthCount, setSelectedMonthCount] = useState(3);
  const [selectedDuration, setSelectedDuration] = useState<'weekend' | 'week' | 'month' | null>(null);
  const [selectedFlexibleMonth, setSelectedFlexibleMonth] = useState<string | null>(null);
  const [flexibleMonthOffset, setFlexibleMonthOffset] = useState(0);
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);

  const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const dayNames = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // Calculer dynamiquement les dates rapides
  const quickDates = useMemo(() => {
    const today = new Date(2026, 0, 6); // 6 janvier 2026
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Calculer le prochain week-end (samedi-dimanche)
    const dayOfWeek = today.getDay();
    const daysUntilSaturday = dayOfWeek === 0 ? 6 : (6 - dayOfWeek);
    const nextSaturday = new Date(today);
    nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);
    
    const nextSunday = new Date(nextSaturday);
    nextSunday.setDate(nextSunday.getDate() + 1);
    
    // Formatage des dates pour l'affichage
    const formatShortDate = (date: Date) => {
      const day = date.getDate();
      const month = monthNames[date.getMonth()].substring(0, 4).toLowerCase();
      return `${day} ${month}.`;
    };
    
    const formatWeekendRange = (start: Date, end: Date) => {
      const startDay = start.getDate();
      const endDay = end.getDate();
      const month = monthNames[start.getMonth()].substring(0, 4).toLowerCase();
      return `${startDay}–${endDay} ${month}.`;
    };
    
    return {
      today: {
        date: today,
        label: formatShortDate(today)
      },
      tomorrow: {
        date: tomorrow,
        label: formatShortDate(tomorrow)
      },
      weekend: {
        start: nextSaturday,
        end: nextSunday,
        label: formatWeekendRange(nextSaturday, nextSunday)
      }
    };
  }, [monthNames]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust so Monday = 0

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const handleDateClick = (day: Date) => {
    setSelectedQuickOption(null);
    
    // Si aucune date n'est sélectionnée, ou si les deux dates sont déjà sélectionnées, recommencer
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      onDatesChange?.(day, null);
    } 
    // Si seule la date de début est sélectionnée
    else if (startDate && !endDate) {
      // Si la date cliquée est avant la date de début, inverser
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
        onDatesChange?.(day, startDate);
      } else {
        setEndDate(day);
        onDatesChange?.(startDate, day);
      }
    }
  };

  const handleQuickDateSelect = (start: Date, end: Date, optionName: string) => {
    setSelectedQuickOption(optionName);
    setStartDate(start);
    setEndDate(end);
    onDatesChange?.(start, end);
  };

  const isStartDate = (day: Date) => {
    return startDate && day.getTime() === startDate.getTime();
  };

  const isEndDate = (day: Date) => {
    return endDate && day.getTime() === endDate.getTime();
  };

  const isInRange = (day: Date) => {
    if (!startDate || !endDate) return false;
    const dayTime = day.getTime();
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    return dayTime > startTime && dayTime < endTime;
  };

  const renderCalendar = (monthOffset: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + monthOffset, 1);
    const days = getDaysInMonth(date);
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return (
      <div className="flex-1">
        <h3 className="text-center text-[16px] mb-6" style={{ fontWeight: 600, color: '#222222' }}>
          {monthName} {year}
        </h3>
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => (
            <div key={index} className="text-center text-[12px] pb-2" style={{ fontWeight: 500, color: '#717171' }}>
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="aspect-square" />;
            }

            const isStart = isStartDate(day);
            const isEnd = isEndDate(day);
            const inRange = isInRange(day);
            const isSelected = isStart || isEnd;

            return (
              <div key={index} className="aspect-square flex items-center justify-center">
                <button
                  onClick={() => handleDateClick(day)}
                  className="w-full h-full flex items-center justify-center text-[14px] transition-colors relative"
                  style={{
                    fontWeight: 400,
                    color: isSelected ? '#FFFFFF' : '#222222',
                    backgroundColor: inRange ? '#F7F7F7' : 'transparent',
                    borderRadius: inRange ? '0' : '0',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected && !inRange) {
                      e.currentTarget.style.border = '1px solid #222222';
                      e.currentTarget.style.borderRadius = '50%';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected && !inRange) {
                      e.currentTarget.style.border = 'none';
                    }
                  }}
                >
                  <span style={{ 
                    position: 'relative', 
                    zIndex: 1,
                    backgroundColor: isSelected ? '#222222' : 'transparent',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {day.getDate()}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const renderMonthSelector = () => {
    const maxMonths = 12;
    const radius = 110;
    const centerX = 180;
    const centerY = 180;
    const angle = (selectedMonthCount / maxMonths) * 2 * Math.PI;

    // Calculer les dates de début et de fin basées sur selectedMonthCount
    const today = new Date(2026, 0, 6); // 6 janvier 2026
    const startDate = new Date(2026, 1, 1); // 1er février 2026
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + selectedMonthCount);
    endDate.setDate(endDate.getDate() - 1); // Dernier jour du dernier mois

    const monthNames = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    const dayNames = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];

    const startDateStr = `${dayNames[startDate.getDay()]} ${startDate.getDate()} ${monthNames[startDate.getMonth()]}`;
    const endDateStr = `${dayNames[endDate.getDay()]} ${endDate.getDate()} ${monthNames[endDate.getMonth()]}`;

    return (
      <div className="flex flex-col items-center py-12">
        <h2 className="text-[22px] mb-12" style={{ fontWeight: 600, color: '#222222' }}>
          Quand voulez-vous voyager ?
        </h2>
        
        <div className="relative" style={{ width: '360px', height: '360px' }}>
          {/* Cercle de fond blanc */}
          <svg className="absolute inset-0" viewBox="0 0 360 360">
            <defs>
              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
                <feOffset dx="0" dy="2" result="offsetblur"/>
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.2"/>
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <linearGradient id="pinkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#047857', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Fond gris clair */}
            <circle cx="180" cy="180" r="110" fill="#f0f0f0" filter="url(#shadow)" />
            
            {/* Cercle blanc intérieur */}
            <circle cx="180" cy="180" r="75" fill="white" />
          </svg>

          {/* Arc de sélection avec gradient et glow */}
          <svg className="absolute inset-0" viewBox="0 0 360 360" style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
            <circle
              cx="180"
              cy="180"
              r="110"
              fill="none"
              stroke="url(#pinkGradient)"
              strokeWidth="35"
              strokeDasharray={`${(selectedMonthCount / maxMonths) * 2 * Math.PI * 110} ${2 * Math.PI * 110}`}
              strokeLinecap="round"
              filter="url(#glow)"
            />
          </svg>

          {/* Points de graduation */}
          {Array.from({ length: maxMonths }).map((_, index) => {
            const dotAngle = (index / maxMonths) * 2 * Math.PI - Math.PI / 2;
            const x = centerX + radius * Math.cos(dotAngle);
            const y = centerY + radius * Math.sin(dotAngle);
            
            return (
              <div
                key={index}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: '#666666'
                }}
              />
            );
          })}

          {/* Curseur */}
          <div
            className="absolute w-12 h-12 bg-white rounded-full cursor-grab active:cursor-grabbing"
            style={{
              left: `${centerX + radius * Math.cos(angle - Math.PI / 2)}px`,
              top: `${centerY + radius * Math.sin(angle - Math.PI / 2)}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
            onMouseDown={(e) => {
              const rect = e.currentTarget.parentElement!.getBoundingClientRect();
              const handleMouseMove = (moveEvent: MouseEvent) => {
                const x = moveEvent.clientX - rect.left - centerX;
                const y = moveEvent.clientY - rect.top - centerY;
                let newAngle = Math.atan2(y, x) + Math.PI / 2;
                if (newAngle < 0) newAngle += 2 * Math.PI;
                const newMonthCount = Math.max(1, Math.min(maxMonths, Math.round((newAngle / (2 * Math.PI)) * maxMonths)));
                if (newMonthCount !== selectedMonthCount) {
                  setSelectedMonthCount(newMonthCount);
                }
              };
              const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
              };
              document.addEventListener('mousemove', handleMouseMove);
              document.addEventListener('mouseup', handleMouseUp);
            }}
          />

          {/* Texte central */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-[80px] leading-none" style={{ fontWeight: 700, color: '#222222' }}>
              {selectedMonthCount}
            </div>
            <div className="text-[16px] mt-1" style={{ fontWeight: 500, color: '#222222' }}>
              mois
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-[15px]">
            <span style={{ fontWeight: 400, color: '#222222' }}>{startDateStr}</span>
            <span style={{ color: '#717171' }}> au </span>
            <span style={{ fontWeight: 400, color: '#222222' }}>{endDateStr} </span>
            <span className="underline" style={{ fontWeight: 400, color: '#222222' }}>±2</span>
          </p>
        </div>
      </div>
    );
  };

  const getAllFlexibleMonths = () => {
    const months = [];
    const shortMonthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    for (let i = 0; i < 12; i++) {
      months.push({
        name: shortMonthNames[i],
        year: '2026'
      });
    }
    return months;
  };

  const renderFlexibleView = () => {
    const allMonths = getAllFlexibleMonths();
    const visibleMonths = allMonths.slice(flexibleMonthOffset, flexibleMonthOffset + 6);
    const canGoBack = flexibleMonthOffset > 0;
    const canGoForward = flexibleMonthOffset + 6 < allMonths.length;

    return (
      <div className="py-8 px-8">
        <h2 className="text-[22px] mb-8 text-center" style={{ fontWeight: 600, color: '#222222' }}>
          Quelle sera la durée de votre séjour ?
        </h2>
        
        <div className="flex gap-3 mb-12 justify-center">
          <button
            onClick={() => setSelectedDuration('weekend')}
            className={`px-6 py-3 rounded-full text-[14px] transition-all ${
              selectedDuration === 'weekend'
                ? 'bg-gray-900 text-white border-2 border-gray-900'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-900'
            }`}
            style={{ fontWeight: 500 }}
          >
            Un week-end
          </button>
          <button
            onClick={() => setSelectedDuration('week')}
            className={`px-6 py-3 rounded-full text-[14px] transition-all ${
              selectedDuration === 'week'
                ? 'bg-gray-900 text-white border-2 border-gray-900'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-900'
            }`}
            style={{ fontWeight: 500 }}
          >
            Une semaine
          </button>
          <button
            onClick={() => setSelectedDuration('month')}
            className={`px-6 py-3 rounded-full text-[14px] transition-all ${
              selectedDuration === 'month'
                ? 'bg-gray-900 text-white border-2 border-gray-900'
                : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-900'
            }`}
            style={{ fontWeight: 500 }}
          >
            Un mois
          </button>
        </div>

        <h2 className="text-[22px] mb-8 text-center" style={{ fontWeight: 600, color: '#222222' }}>
          Quand souhaitez-vous partir ?
        </h2>

        <div className="relative flex justify-center pb-8">
          <div className="inline-flex items-center gap-3 w-full">
            {/* Flèche gauche */}
            <button
              className={`absolute bg-white border-gray-300 shadow-sm -left-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                canGoBack ? 'hover:bg-gray-100' : 'bg-white opacity-30 cursor-not-allowed'
              }`}
              aria-label="Précédent"
              onClick={() => canGoBack && setFlexibleMonthOffset(flexibleMonthOffset - 6)}
              disabled={!canGoBack}
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#222222' }} />
            </button>

            {/* Grille de mois */}
            <div className="grid grid-cols-6 gap-2 w-full">
              {visibleMonths.map((month, index) => {
                const isSelected = selectedFlexibleMonth === `${month.name}-${month.year}`;
                return (
                  <button
                    key={`${month.name}-${month.year}`}
                    onClick={() => setSelectedFlexibleMonth(`${month.name}-${month.year}`)}
                    className={`relative p-4 rounded-xl border-2 transition-all hover:border-gray-900 ${
                      isSelected
                        ? 'border-gray-900 bg-gray-50'
                        : 'border-gray-300'
                    }`}
                    style={{ height:'144px' }}
                  >
                    {/* Icône calendrier simplifiée */}
                    <svg 
                      className="w-8 h-8 mb-2 mx-auto" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="#717171" 
                      strokeWidth="1.5"
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    
                    <div className="text-[14px] mb-0.5" style={{ fontWeight: 600, color: '#222222' }}>
                      {month.name}
                    </div>
                    <div className="text-[13px]" style={{ color: '#717171' }}>
                      {month.year}
                    </div>

                    {/* Coin plié pour la carte sélectionnée */}
                    {isSelected && (
                      <div 
                        className="absolute top-0 right-0"
                        style={{
                          width: '0',
                          height: '0',
                          borderStyle: 'solid',
                          borderWidth: '0 18px 18px 0',
                          borderColor: 'transparent #222222 transparent transparent',
                          borderTopRightRadius: '10px'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Flèche droite */}
            <button
              className={`absolute bg-white border-gray-300 shadow-sm -right-6 w-8 h-8 rounded-full flex items-center justify-center transition-colors flex-shrink-0 ${
                canGoForward ? 'hover:bg-gray-100' : 'opacity-30 cursor-not-allowed'
              }`}
              aria-label="Suivant"
              onClick={() => canGoForward && setFlexibleMonthOffset(flexibleMonthOffset + 6)}
              disabled={!canGoForward}
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-2 bg-white z-50"
      style={{ borderRadius: '24px', boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)' }}
    >
      {/* Tabs */}
      <div className="flex justify-center pt-8 pb-6 px-8">
        <div className="inline-flex bg-gray-200 rounded-full p-1">
          <button
            onClick={() => setActiveTab('dates')}
            className={`px-6 py-2.5 rounded-full text-[15px] transition-all ${
              activeTab === 'dates'
                ? 'bg-white text-gray-900 border border-gray-900 shadow-sm'
                : 'bg-transparent text-gray-900'
            }`}
            style={{ fontWeight: 600 }}
          >
            Dates
          </button>
          <button
            onClick={() => setActiveTab('mois')}
            className={`px-6 py-2.5 rounded-full text-[15px] transition-all ${
              activeTab === 'mois'
                ? 'bg-white text-gray-900 border border-gray-900 shadow-sm'
                : 'bg-transparent text-gray-900'
            }`}
            style={{ fontWeight: 600 }}
          >
            Mois
          </button>
          <button
            onClick={() => setActiveTab('flexible')}
            className={`px-6 py-2.5 rounded-full text-[15px] transition-all ${
              activeTab === 'flexible'
                ? 'bg-white text-gray-900 border border-gray-900 shadow-sm'
                : 'bg-transparent text-gray-900'
            }`}
            style={{ fontWeight: 600 }}
          >
            Flexible
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'dates' && (
        <div className="flex px-8 py-8 gap-8">
          {/* Left side - Quick date options */}
          <div className="w-[240px] space-y-4">
            <button
              className="w-full text-left px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors"
              style={{
                border: selectedQuickOption === 'today' ? '2px solid #222222' : '1px solid #DDDDDD',
              }}
              onClick={() => handleQuickDateSelect(quickDates.today.date, quickDates.today.date, 'today')}
            >
              <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Aujourd'hui
              </div>
              <div className="text-[14px]" style={{ color: '#717171' }}>
                {quickDates.today.label}
              </div>
            </button>

            <button
              className="w-full text-left px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors"
              style={{
                border: selectedQuickOption === 'tomorrow' ? '2px solid #222222' : '1px solid #DDDDDD',
              }}
              onClick={() => handleQuickDateSelect(quickDates.tomorrow.date, quickDates.tomorrow.date, 'tomorrow')}
            >
              <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Demain
              </div>
              <div className="text-[14px]" style={{ color: '#717171' }}>
                {quickDates.tomorrow.label}
              </div>
            </button>

            <button
              className="w-full text-left px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors"
              style={{
                border: selectedQuickOption === 'weekend' ? '2px solid #222222' : '1px solid #DDDDDD',
              }}
              onClick={() => handleQuickDateSelect(quickDates.weekend.start, quickDates.weekend.end, 'weekend')}
            >
              <div className="text-[16px] mb-1" style={{ fontWeight: 600, color: '#222222' }}>
                Ce week-end
              </div>
              <div className="text-[14px]" style={{ color: '#717171' }}>
                {quickDates.weekend.label}
              </div>
            </button>
          </div>

          {/* Right side - Calendar */}
          <div className="flex-1">
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5" style={{ color: '#222222' }} />
              </button>
              <h3 className="text-[16px]" style={{ fontWeight: 600, color: '#222222' }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5" style={{ color: '#222222' }} />
              </button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map((day, index) => (
                <div
                  key={index}
                  className="text-center text-[12px] py-1"
                  style={{ fontWeight: 600, color: '#717171' }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentMonth).map((day, index) => {
                if (!day) {
                  return <div key={index} />;
                }

                const isStart = isStartDate(day);
                const isEnd = isEndDate(day);
                const inRange = isInRange(day);
                const isSelected = isStart || isEnd;

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className="aspect-square flex items-center justify-center text-[14px] transition-colors relative"
                    style={{
                      fontWeight: 400,
                      color: isSelected ? '#FFFFFF' : '#222222',
                      backgroundColor: inRange ? '#F7F7F7' : 'transparent',
                      borderRadius: inRange ? '0' : '0',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected && !inRange) {
                        e.currentTarget.style.backgroundColor = '#F7F7F7';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected && !inRange) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span style={{ 
                      position: 'relative', 
                      zIndex: 1,
                      backgroundColor: isSelected ? '#222222' : 'transparent',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {day.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mois' && renderMonthSelector()}

      {activeTab === 'flexible' && renderFlexibleView()}
    </div>
  );
}