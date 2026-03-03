import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface ServiceDatePickerProps {
  onClose: () => void;
  onSelect: (date: string) => void;
}

export function ServiceDatePicker({ onClose, onSelect }: ServiceDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  // Calculer dynamiquement les dates rapides
  const quickDates = useMemo(() => {
    const today = new Date();
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
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust so Monday is 0

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startMonth = monthNames[start.getMonth()].substring(0, 4).toLowerCase();
    const endMonth = monthNames[end.getMonth()].substring(0, 4).toLowerCase();
    
    if (start.getTime() === end.getTime()) {
      return `${start.getDate()} ${startMonth}.`;
    }
    
    return `${start.getDate()} ${startMonth}. - ${end.getDate()} ${endMonth}.`;
  };

  const handleQuickDateSelect = (start: Date, end: Date, optionName: string) => {
    setSelectedQuickOption(optionName);
    setStartDate(start);
    setEndDate(end);
    const dateText = formatDateRange(start, end);
    onSelect(dateText);
  };

  const handleDateClick = (day: Date) => {
    setSelectedQuickOption(null);
    
    // Si aucune date n'est sélectionnée, ou si les deux dates sont déjà sélectionnées, recommencer
    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
      const monthName = monthNames[day.getMonth()].substring(0, 4).toLowerCase();
      onSelect(`${day.getDate()} ${monthName}.`);
    } 
    // Si seule la date de début est sélectionnée
    else if (startDate && !endDate) {
      // Si la date cliquée est avant la date de début, inverser
      if (day < startDate) {
        setEndDate(startDate);
        setStartDate(day);
        const dateText = formatDateRange(day, startDate);
        onSelect(dateText);
      } else {
        setEndDate(day);
        const dateText = formatDateRange(startDate, day);
        onSelect(dateText);
      }
    }
  };

  const isDateInRange = (day: Date, start: Date, end: Date) => {
    const dayTime = day.getTime();
    const startTime = start.getTime();
    const endTime = end.getTime();
    return dayTime >= startTime && dayTime <= endTime;
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

  const days = getDaysInMonth(currentMonth);

  return (
    <div 
      className="absolute top-full mt-2 bg-white z-50"
      style={{ 
        borderRadius: '24px', 
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        width: '650px',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex px-8 py-8 gap-8">
        {/* Left side - Quick date options */}
        <div className="w-[240px] space-y-4">
          <button
            className="w-full text-left px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors"
            style={{
              border: selectedQuickOption === 'today' ? '2px solid #222222' : '1px solid #DDDDDD',
            }}
            onClick={() => {
              const range = { start: quickDates.today.date, end: quickDates.today.date };
              handleQuickDateSelect(range.start, range.end, 'today');
            }}
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
            onClick={() => {
              const range = { start: quickDates.tomorrow.date, end: quickDates.tomorrow.date };
              handleQuickDateSelect(range.start, range.end, 'tomorrow');
            }}
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
            onClick={() => {
              const range = { start: quickDates.weekend.start, end: quickDates.weekend.end };
              handleQuickDateSelect(range.start, range.end, 'weekend');
            }}
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
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
            <h3 className="text-[16px]" style={{ fontWeight: 600, color: '#222222' }}>
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" style={{ color: '#222222' }} />
            </button>
          </div>

          {/* Week days */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map((day, index) => (
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
            {days.map((day, index) => {
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
    </div>
  );
}