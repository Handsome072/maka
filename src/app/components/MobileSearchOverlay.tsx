import { useState, useEffect, useMemo } from 'react';
import { X, Search, Navigation, Building, Landmark, MapPin, ChevronDown, ChevronRight, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileSearchOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    currentPage: 'logements' | 'experiences' | 'services';
    onNavigate: (page: 'logements' | 'experiences' | 'services') => void;
    onSearch: (params: any) => void;
}

const destinations = [
    {
        icon: Navigation,
        title: "À proximité",
        description: "Découvrez les options à proximité",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        icon: Building,
        title: "Marseille, Provence-Alpes-Côte d'Azur",
        description: "Destination balnéaire prisée",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
    },
    {
        icon: Landmark,
        title: "Lyon, Auvergne-Rhône-Alpes",
        description: "Célèbre pour des sites comme : Basilique Notre-Dame de Fourvière",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
    },
    {
        icon: Building,
        title: "Montpellier, Occitanie",
        description: "Populaire auprès des voyageurs à proximité",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
    },
    {
        icon: Landmark,
        title: "Toulouse, Occitanie",
        description: "Célèbre pour des sites comme : Basilique Saint-Sernin",
        bgColor: "bg-pink-100",
        iconColor: "text-pink-600",
    },
    {
        icon: Landmark,
        title: "Barcelone, Espagne",
        description: "Destination balnéaire prisée",
        bgColor: "bg-orange-100",
        iconColor: "text-orange-600",
    },
    {
        icon: MapPin,
        title: "Bordeaux, Nouvelle-Aquitaine",
        description: "À 415 km",
        bgColor: "bg-gray-100",
        iconColor: "text-gray-600",
    },
];

const serviceTypes = [
    "Ménage",
    "Jardinage",
    "Bricolage",
    "Déménagement",
    "Garde d'enfants",
    "Cours particuliers",
    "Livraison",
    "Autre",
];

const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export function MobileSearchOverlay({
    isOpen,
    onClose,
    currentPage,
    onNavigate,
    onSearch,
}: MobileSearchOverlayProps) {
    const [searchValue, setSearchValue] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [isDestinationExpanded, setIsDestinationExpanded] = useState(false);

    const [expandedSection, setExpandedSection] = useState<'destination' | 'dates' | 'guests' | 'service' | null>('destination');

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedQuickOption, setSelectedQuickOption] = useState<string | null>(null);

    const [visibleMonthCount, setVisibleMonthCount] = useState(4); // mois actuel + 3 suivants

    const [guestsCount, setGuestsCount] = useState({
        adults: 0,
        children: 0,
        babies: 0,
        pets: 0,
    });

    const [selectedServiceType, setSelectedServiceType] = useState('');

    // Fermer automatiquement l'overlay en mode desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                onClose();
            }
        };
        window.addEventListener('resize', handleResize);
        // Vérifier au montage
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [onClose]);

    const handleSearch = () => {
        onSearch({
            destination: selectedDestination || searchValue,
            checkInDate: startDate,
            checkOutDate: endDate,
            guestsCount,
            serviceType: selectedServiceType,
        });
        onClose();
    };

    const handleClearAll = () => {
        setSearchValue('');
        setSelectedDestination('');
        setStartDate(null);
        setEndDate(null);
        setGuestsCount({ adults: 0, children: 0, babies: 0, pets: 0 });
        setSelectedServiceType('');
    };

    const handleTabClick = (page: 'logements' | 'experiences' | 'services') => {
        onNavigate(page);
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = (firstDay.getDay() + 6) % 7;

        const days: (Date | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(new Date(year, month, day));
        }
        return days;
    };

    // Dates rapides : Aujourd'hui, Demain, Ce week-end
    const quickDates = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Prochain week-end (samedi - dimanche)
        const dayOfWeek = today.getDay(); // 0 = dimanche ... 6 = samedi
        const daysUntilSaturday = dayOfWeek === 0 ? 6 : (6 - dayOfWeek);
        const nextSaturday = new Date(today);
        nextSaturday.setDate(nextSaturday.getDate() + daysUntilSaturday);

        const nextSunday = new Date(nextSaturday);
        nextSunday.setDate(nextSunday.getDate() + 1);

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
                label: formatShortDate(today),
            },
            tomorrow: {
                date: tomorrow,
                label: formatShortDate(tomorrow),
            },
            weekend: {
                start: nextSaturday,
                end: nextSunday,
                label: formatWeekendRange(nextSaturday, nextSunday),
            },
        };
    }, []);

    const handleQuickDateSelect = (start: Date, end: Date, optionName: string) => {
        setSelectedQuickOption(optionName);
        setStartDate(start);
        setEndDate(end);
    };

    const handleDateClick = (day: Date) => {
        // Dès qu'on clique manuellement sur une date, on sort du mode \"rapide\"
        setSelectedQuickOption(null);

        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (day < startDate) {
                setEndDate(startDate);
                setStartDate(day);
            } else {
                setEndDate(day);
            }
        }
    };

    const isStartDate = (day: Date) => startDate && day.getTime() === startDate.getTime();
    const isEndDate = (day: Date) => endDate && day.getTime() === endDate.getTime();
    const isInRange = (day: Date) => {
        if (!startDate || !endDate) return false;
        return day.getTime() > startDate.getTime() && day.getTime() < endDate.getTime();
    };

    const formatDateRange = () => {
        if (!startDate) return "Ajouter des dates";
        const startStr = `${startDate.getDate()} ${monthNames[startDate.getMonth()].substring(0, 4).toLowerCase()}.`;
        if (!endDate) return startStr;
        const endStr = `${endDate.getDate()} ${monthNames[endDate.getMonth()].substring(0, 4).toLowerCase()}.`;
        return `${startStr} - ${endStr}`;
    };

    const updateGuestCount = (key: 'adults' | 'children' | 'babies' | 'pets', delta: number) => {
        setGuestsCount(prev => ({
            ...prev,
            [key]: Math.max(0, prev[key] + delta)
        }));
    };

    const totalGuests = guestsCount.adults + guestsCount.children + guestsCount.babies;
    const guestsText = totalGuests > 0 ? `${totalGuests} voyageur${totalGuests > 1 ? 's' : ''}` : "Ajouter des voyageurs";

    // Mois de base pour le scroll vertical (tronqué au début du mois)
    const baseMonth = useMemo(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1);
    }, []);

    const monthsToRender = useMemo(() => {
        const months: Date[] = [];
        for (let i = 0; i < visibleMonthCount; i++) {
            const monthDate = new Date(baseMonth.getFullYear(), baseMonth.getMonth() + i, 1);
            months.push(monthDate);
        }
        return months;
    }, [baseMonth, visibleMonthCount]);

    const showPets = currentPage === 'logements';
    const showServiceType = currentPage === 'services';

    const isFinalStep = (!showServiceType && expandedSection === 'guests') || (showServiceType && expandedSection === 'service');

    const handlePrimaryAction = () => {
        // Si on est sur la dernière étape (Voyageurs ou Type de service), lancer la recherche
        if (isFinalStep) {
            handleSearch();
            return;
        }

        // Sinon, avancer à l'étape suivante
        if (expandedSection === 'destination') {
            setExpandedSection('dates');
        } else if (expandedSection === 'dates') {
            setExpandedSection(showServiceType ? 'service' : 'guests');
        } else {
            // Fallback : lancer la recherche
            handleSearch();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-[#F7F7F7] flex flex-col"
                    initial={{ opacity: 0, y: '100%' }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: '100%' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                    {/* Header avec tabs et bouton X - masqué en mode étendu */}
                    <AnimatePresence>
                        {!isDestinationExpanded && (
                            <motion.div
                                className="flex items-center justify-between px-4 py-4 border-b border-gray-200"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center justify-around flex-1">
                                    <button
                                        onClick={() => handleTabClick('logements')}
                                        className={`flex flex-col items-center gap-1 px-4 ${currentPage === 'logements' ? 'text-black' : 'text-gray-400'}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span className={`text-xs font-medium ${currentPage === 'logements' ? 'border-b-2 border-black pb-1' : ''}`}>Logements</span>
                                    </button>

                                    <button
                                        onClick={() => handleTabClick('experiences')}
                                        className={`flex flex-col items-center gap-1 px-4 ${currentPage === 'experiences' ? 'text-black' : 'text-gray-400'}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                        <span className={`text-xs font-medium ${currentPage === 'experiences' ? 'border-b-2 border-black pb-1' : ''}`}>Expériences</span>
                                    </button>

                                    <button
                                        onClick={() => handleTabClick('services')}
                                        className={`flex flex-col items-center gap-1 px-4 ${currentPage === 'services' ? 'text-black' : 'text-gray-400'}`}
                                    >
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                                            <path d="M9 3V21M15 3V21M3 9H21M3 15H21" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        <span className={`text-xs font-medium ${currentPage === 'services' ? 'border-b-2 border-black pb-1' : ''}`}>Services</span>
                                    </button>
                                </div>

                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-full bg-white border border-gray-300 hover:bg-gray-100 transition-colors ml-2 shadow-md"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Contenu scrollable */}
                    <div className="flex-1 overflow-y-auto bg-[#F7F7F7]">
                        {/* Section Où */}
                        <div
                            className={`mx-4 mt-4 bg-white rounded-2xl overflow-hidden transition-all ${expandedSection === 'destination' ? 'shadow-xl border-2 border-gray-200' : 'shadow-sm border border-gray-100'}`}
                            onClick={() => setExpandedSection('destination')}
                        >
                            {expandedSection === 'destination' ? (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-4">Où ?</h2>
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher une destination"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            onFocus={() => setIsDestinationExpanded(true)}
                                            className={`w-full pl-12 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-gray-200 ${isDestinationExpanded ? 'pr-12' : 'pr-4'}`}
                                        />
                                        {isDestinationExpanded && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsDestinationExpanded(false);
                                                }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                            >
                                                <ChevronRight className="w-5 h-5 text-gray-500" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">Suggestions de destinations</p>
                                    <div className="space-y-2">
                                        {destinations.slice(0, isDestinationExpanded ? destinations.length : 3).map((dest, index) => {
                                            const Icon = dest.icon;
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedDestination(dest.title);
                                                        setSearchValue(dest.title);
                                                        setIsDestinationExpanded(false);
                                                        setExpandedSection('dates');
                                                    }}
                                                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${selectedDestination === dest.title ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                                                >
                                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${dest.bgColor}`}>
                                                        <Icon className={`w-5 h-5 ${dest.iconColor}`} />
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-medium text-sm">{dest.title}</p>
                                                        <p className="text-xs text-gray-500">{dest.description}</p>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {!isDestinationExpanded && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsDestinationExpanded(true);
                                            }}
                                            className="w-full flex items-center justify-center gap-1 py-3 text-gray-500 hover:text-gray-700"
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-4 flex items-center justify-between cursor-pointer">
                                    <span className="text-gray-500 font-medium">Où</span>
                                    <span className="text-gray-900">{selectedDestination || searchValue || "N'importe où"}</span>
                                </div>
                            )}
                        </div>

                        {/* Section Quand - masquée en mode étendu */}
                        <AnimatePresence>
                            {!isDestinationExpanded && (
                                <motion.div
                                    className={`mx-4 mt-4 bg-white rounded-2xl overflow-hidden transition-all ${expandedSection === 'dates' ? 'shadow-xl border-2 border-gray-200' : 'shadow-sm border border-gray-100'}`}
                                    onClick={() => setExpandedSection('dates')}
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {expandedSection === 'dates' ? (
                                        <div className="p-6">
                                            <h2 className="text-xl font-semibold mb-4">Quand ?</h2>

                                            {/* Options rapides : Aujourd'hui / Demain / Ce week-end */}
                                            <div className="flex gap-2 mb-4 overflow-x-auto">
                                                <button
                                                    className={`w-fit px-3 py-3 rounded-xl border text-left transition-colors ${selectedQuickOption === 'today'
                                                        ? 'border-gray-900 bg-gray-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuickDateSelect(quickDates.today.date, quickDates.today.date, 'today');
                                                    }}
                                                >
                                                    <div className="text-sm font-semibold">Aujourd'hui</div>
                                                    <div className="text-xs text-gray-500">{quickDates.today.label}</div>
                                                </button>

                                                <button
                                                    className={`w-fit px-3 py-3 rounded-xl border text-left transition-colors ${selectedQuickOption === 'tomorrow'
                                                        ? 'border-gray-900 bg-gray-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuickDateSelect(quickDates.tomorrow.date, quickDates.tomorrow.date, 'tomorrow');
                                                    }}
                                                >
                                                    <div className="text-sm font-semibold">Demain</div>
                                                    <div className="text-xs text-gray-500">{quickDates.tomorrow.label}</div>
                                                </button>

                                                <button
                                                    className={`w-fit px-3 py-3 rounded-xl border text-left transition-colors ${selectedQuickOption === 'weekend'
                                                        ? 'border-gray-900 bg-gray-50'
                                                        : 'border-gray-300 hover:border-gray-400'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuickDateSelect(quickDates.weekend.start, quickDates.weekend.end, 'weekend');
                                                    }}
                                                >
                                                    <div className="text-sm font-semibold">Ce week-end</div>
                                                    <div className="text-xs text-gray-500">{quickDates.weekend.label}</div>
                                                </button>
                                            </div>

                                            {/* Calendrier vertical multi-mois */}
                                            <div className="relative max-h-80 overflow-y-auto space-y-6 pb-4">
                                                {/* En-tête des jours fixe */}
                                                <div className="sticky top-0 z-10 bg-white pb-2">
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {weekDays.map((day, index) => (
                                                            <div key={index} className="text-center text-xs font-semibold text-gray-500 py-1">
                                                                {day}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {monthsToRender.map((monthDate) => {
                                                    const days = getDaysInMonth(monthDate);
                                                    return (
                                                        <div key={`${monthDate.getFullYear()}-${monthDate.getMonth()}`}>
                                                            <div className="flex items-center justify-center mb-2">
                                                                <h3 className="text-base font-semibold">
                                                                    {monthNames[monthDate.getMonth()]} {monthDate.getFullYear()}
                                                                </h3>
                                                            </div>

                                                            {/* Jours du mois */}
                                                            <div className="grid grid-cols-7 gap-1">
                                                                {days.map((day, index) => {
                                                                    if (!day) return <div key={index} />;
                                                                    const isStart = isStartDate(day);
                                                                    const isEnd = isEndDate(day);
                                                                    const inRange = isInRange(day);
                                                                    const isSelected = isStart || isEnd;

                                                                    return (
                                                                        <button
                                                                            key={index}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDateClick(day);
                                                                            }}
                                                                            className={`aspect-square flex items-center justify-center text-sm transition-colors ${isSelected
                                                                                ? 'bg-gray-900 text-white rounded-full'
                                                                                : inRange
                                                                                    ? 'bg-gray-100'
                                                                                    : 'hover:bg-gray-50'
                                                                                }`}
                                                                        >
                                                                            {day.getDate()}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Afficher plus de dates (en bas du scroll) */}
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setVisibleMonthCount((prev) => prev + 3);
                                                        }}
                                                        className="w-full py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-50"
                                                    >
                                                        Afficher plus de dates
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-500 font-medium">Quand</span>
                                            <span className="text-gray-900">{formatDateRange()}</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Section Voyageurs ou Type de service - masquée en mode étendu */}
                        <AnimatePresence>
                            {!isDestinationExpanded && showServiceType && (
                                <motion.div
                                    className={`mx-4 mt-4 mb-4 bg-white rounded-2xl overflow-hidden transition-all ${expandedSection === 'service' ? 'shadow-xl border-2 border-gray-200' : 'shadow-sm border border-gray-100'}`}
                                    onClick={() => setExpandedSection('service')}
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {expandedSection === 'service' ? (
                                        <div className="p-6">
                                            <h2 className="text-xl font-semibold mb-4">Type de service</h2>
                                            <div className="grid grid-cols-2 gap-2">
                                                {serviceTypes.map((type, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedServiceType(type);
                                                        }}
                                                        className={`p-3 rounded-xl border text-sm font-medium transition-colors ${selectedServiceType === type
                                                            ? 'border-gray-900 bg-gray-50'
                                                            : 'border-gray-200 hover:border-gray-400'
                                                            }`}
                                                    >
                                                        {type}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-500 font-medium">Type de service</span>
                                            <span className="text-gray-900">{selectedServiceType || "Ajouter un service"}</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <AnimatePresence>
                            {!isDestinationExpanded && !showServiceType && (
                                <motion.div
                                    className={`mx-4 mt-4 mb-4 bg-white rounded-2xl overflow-hidden transition-all ${expandedSection === 'guests' ? 'shadow-xl border-2 border-gray-200' : 'shadow-sm border border-gray-100'}`}
                                    onClick={() => setExpandedSection('guests')}
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {expandedSection === 'guests' ? (
                                        <div className="p-6">
                                            <h2 className="text-xl font-semibold mb-4">Voyageurs</h2>

                                            {/* Adultes */}
                                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                                <div>
                                                    <div className="font-semibold">Adultes</div>
                                                    <div className="text-sm text-gray-500">13 ans et plus</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateGuestCount('adults', -1); }}
                                                        disabled={guestsCount.adults <= 0}
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guestsCount.adults <= 0 ? 'opacity-40' : ''}`}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-6 text-center">{guestsCount.adults}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateGuestCount('adults', 1); }}
                                                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Enfants */}
                                            <div className="flex items-center justify-between py-4 border-b border-gray-200">
                                                <div>
                                                    <div className="font-semibold">Enfants</div>
                                                    <div className="text-sm text-gray-500">De 2 à 12 ans</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateGuestCount('children', -1); }}
                                                        disabled={guestsCount.children <= 0}
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guestsCount.children <= 0 ? 'opacity-40' : ''}`}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-6 text-center">{guestsCount.children}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateGuestCount('children', 1); }}
                                                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Bébés */}
                                            <div className={`flex items-center justify-between py-4 ${showPets ? 'border-b border-gray-200' : ''}`}>
                                                <div>
                                                    <div className="font-semibold">Bébés</div>
                                                    <div className="text-sm text-gray-500">- de 2 ans</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateGuestCount('babies', -1); }}
                                                        disabled={guestsCount.babies <= 0}
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guestsCount.babies <= 0 ? 'opacity-40' : ''}`}
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-6 text-center">{guestsCount.babies}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); updateGuestCount('babies', 1); }}
                                                        className="w-8 h-8 rounded-full border flex items-center justify-center"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Animaux - uniquement pour Logements */}
                                            {showPets && (
                                                <div className="flex items-center justify-between py-4">
                                                    <div>
                                                        <div className="font-semibold">Animaux domestiques</div>
                                                        <div className="text-sm text-gray-500 underline">Vous voyagez avec un animal d'assistance ?</div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateGuestCount('pets', -1); }}
                                                            disabled={guestsCount.pets <= 0}
                                                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${guestsCount.pets <= 0 ? 'opacity-40' : ''}`}
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                        <span className="w-6 text-center">{guestsCount.pets}</span>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); updateGuestCount('pets', 1); }}
                                                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                                                        >
                                                            <Plus className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="p-4 flex items-center justify-between cursor-pointer">
                                            <span className="text-gray-500 font-medium">Voyageurs</span>
                                            <span className="text-gray-900">{guestsText}</span>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer avec actions */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                        <button
                            onClick={handleClearAll}
                            className="text-base font-medium underline text-gray-700 hover:text-black"
                        >
                            Tout effacer
                        </button>

                        <button
                            onClick={handlePrimaryAction}
                            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white font-medium transition-colors"
                            style={{ backgroundColor: isFinalStep ? '#E91E63' : '#222222' }}
                        >
                            {isFinalStep && <Search className="w-4 h-4" />}
                            <span>{isFinalStep ? 'Rechercher' : 'Suivant'}</span>
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
