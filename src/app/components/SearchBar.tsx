import {
  Search,
  Navigation,
  Building,
  Landmark,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { DatePicker } from "./DatePicker";
import { ExperienceDatePicker } from "./ExperienceDatePicker";
import { GuestsPicker } from "./GuestsPicker";

const allDestinations = [
  {
    icon: Navigation,
    title: "À proximité",
    description: "Découvrez les options à proximité",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    searchKey: "proximite",
  },
  {
    icon: Building,
    title: "Marseille, Provence-Alpes-Côte d'Azur",
    description: "Destination balnéaire prisée",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
    searchKey: "marseille",
  },
  {
    icon: Landmark,
    title: "Lyon, Auvergne-Rhône-Alpes",
    description:
      "Célèbre pour des sites comme : Basilique Notre-Dame de Fourvière",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
    searchKey: "lyon",
  },
  {
    icon: Building,
    title: "Montpellier, Occitanie",
    description: "Populaire auprès des voyageurs à proximité",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    searchKey: "montpellier",
  },
  {
    icon: Landmark,
    title: "Toulouse, Occitanie",
    description:
      "Célèbre pour des sites comme : Basilique Saint-Sernin",
    bgColor: "bg-pink-100",
    iconColor: "text-pink-600",
    searchKey: "toulouse",
  },
  {
    icon: Landmark,
    title: "Barcelone, Espagne",
    description: "Destination balnéaire prisée",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
    searchKey: "barcelone",
  },
  {
    icon: MapPin,
    title: "Bruxelles, Nouvelle-Aquitaine",
    description: "À 415 km",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    searchKey: "bruxelles",
  },
  {
    icon: MapPin,
    title: "Île de Reem, Abou Dabi, Émirats arabes unis",
    description: "",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    searchKey: "reem ree ile emirats",
  },
  {
    icon: MapPin,
    title: "Reeuwijk, Pays-Bas",
    description: "",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    searchKey: "reeuwijk ree pays-bas",
  },
  {
    icon: MapPin,
    title: "Reefton, West Coast, Nouvelle-Zélande",
    description: "",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    searchKey: "reefton ree nouvelle-zelande",
  },
  {
    icon: MapPin,
    title: "Reeperbahn, Allemagne",
    description: "",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    searchKey: "reeperbahn ree allemagne",
  },
  {
    icon: MapPin,
    title: "Reepham, Royaume-Uni",
    description: "",
    bgColor: "bg-gray-100",
    iconColor: "text-gray-600",
    searchKey: "reepham ree royaume-uni",
  },
];

export function SearchBar({ onSearch }: { onSearch?: (params: any) => void }) {
  const [showDestinations, setShowDestinations] =
    useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] =
    useState(false);
  const [dateTab, setDateTab] = useState<
    "dates" | "mois" | "flexible"
  >("dates");
  const [searchValue, setSearchValue] = useState("");
  const [currentMonth, setCurrentMonth] = useState(
    new Date(2026, 0),
  ); // Janvier 2026
  const [selectedMonthCount, setSelectedMonthCount] =
    useState(3);
  const [selectedDuration, setSelectedDuration] = useState<
    "weekend" | "week" | "month" | null
  >(null);
  const [guestsCount, setGuestsCount] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: 0,
  });
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    null,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const guestsDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dateButtonRef = useRef<HTMLDivElement>(null);
  const guestsButtonRef = useRef<HTMLDivElement>(null);

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch({
        destination: searchValue,
        checkInDate,
        checkOutDate,
        guestsCount,
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDestinations(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDatePicker(false);
      }
      if (
        guestsDropdownRef.current &&
        !guestsDropdownRef.current.contains(
          event.target as Node,
        )
      ) {
        setShowGuestsPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  // Auto-focus sur le champ Voyageurs après sélection des dates
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      setTimeout(() => {
        setShowDatePicker(false);
        setShowGuestsPicker(true);
        setShowDestinations(false);
      }, 300);
    }
  }, [checkInDate, checkOutDate]);

  const filteredDestinations = searchValue.trim()
    ? allDestinations.filter(
        (dest) =>
          dest.searchKey
            .toLowerCase()
            .includes(searchValue.toLowerCase()) ||
          dest.title
            .toLowerCase()
            .includes(searchValue.toLowerCase()),
      )
    : allDestinations.slice(0, 7);

  const handleClearSearch = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const handleClearGuests = () => {
    setGuestsCount({
      adults: 0,
      children: 0,
      babies: 0,
      pets: 0,
    });
  };

  const handleDatesChange = (
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    setCheckInDate(startDate);
    setCheckOutDate(endDate);
  };

  const formatDateRange = () => {
    if (!checkInDate) return "";

    const monthNames = [
      "janv.",
      "févr.",
      "mars",
      "avr.",
      "mai",
      "juin",
      "juil.",
      "août",
      "sept.",
      "oct.",
      "nov.",
      "déc.",
    ];
    const checkInStr = `${checkInDate.getDate()} ${monthNames[checkInDate.getMonth()]}`;

    if (!checkOutDate) return checkInStr;

    const checkOutStr = `${checkOutDate.getDate()} ${monthNames[checkOutDate.getMonth()]}`;
    return `${checkInStr} - ${checkOutStr}`;
  };

  const totalGuests =
    guestsCount.adults +
    guestsCount.children +
    guestsCount.babies;
  const guestsText =
    totalGuests > 0
      ? `${totalGuests} voyageur${totalGuests > 1 ? "s" : ""}`
      : "";

  return (
    <div className="px-4 sm:px-6 lg:px-20 pt-4 py-3 pb-10 relative bg-[#F7F7F7]">
      <div
        className="max-w-4xl mx-auto relative"
        ref={dropdownRef}
      >
        <div
          className="flex items-center rounded-full shadow-sm hover:shadow-md transition-shadow relative"
          style={{
            backgroundColor:
              showDestinations ||
              showDatePicker ||
              showGuestsPicker
                ? "#EBEBEB"
                : "white",
          }}
        >
          {/* Destination */}
          <div
            className={`flex-1 px-8 py-2 cursor-pointer relative transition-all ${
              showDestinations
                ? "bg-white shadow-md z-10"
                : "bg-transparent"
            }`}
            style={{
              borderRadius: showDestinations
                ? "100px"
                : "32px 0 0 32px",
              ...(!showDestinations &&
              !showDatePicker &&
              !showGuestsPicker
                ? {
                    borderTop: "1px solid #DDDDDD",
                    borderBottom: "1px solid #DDDDDD",
                    borderLeft: "1px solid #DDDDDD",
                    borderRight: "none",
                  }
                : {}),
            }}
            onClick={() => {
              setShowDestinations(true);
              setShowDatePicker(false);
              setShowGuestsPicker(false);
              inputRef.current?.focus();
            }}
          >
            <label
              className="block text-xs mb-1 cursor-pointer"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Destination
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher une destination"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full outline-none text-sm placeholder:text-gray-400 bg-transparent cursor-text pr-6"
              style={{ color: "#717171" }}
              onFocus={() => {
                setShowDestinations(true);
                setShowDatePicker(false);
                setShowGuestsPicker(false);
              }}
            />
            {searchValue && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSearch();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              >
                <X className="w-3 h-3 text-gray-700" />
              </button>
            )}
          </div>

          {/* Separator */}
          {!showDestinations && !showDatePicker && (
            <div className="w-px h-8 bg-gray-300"></div>
          )}

          {/* Dates */}
          <div
            className={`flex-[0.8] px-8 py-2 cursor-pointer relative transition-all ${
              showDatePicker
                ? "bg-white shadow-md z-10"
                : "bg-transparent"
            }`}
            style={{
              borderRadius: showDatePicker ? "100px" : "0",
              ...(!showDestinations &&
              !showDatePicker &&
              !showGuestsPicker
                ? {
                    borderTop: "1px solid #DDDDDD",
                    borderBottom: "1px solid #DDDDDD",
                    borderLeft: "none",
                    borderRight: "none",
                  }
                : {}),
            }}
            onClick={() => {
              setShowDatePicker(true);
              setShowDestinations(false);
              setShowGuestsPicker(false);
            }}
            ref={dateButtonRef}
          >
            <label
              className="block text-xs mb-1 cursor-pointer"
              style={{ fontWeight: 600, color: "#222222" }}
            >
              Dates
            </label>
            <input
              type="text"
              placeholder="Quand ?"
              className="w-full outline-none text-sm placeholder:text-gray-400 bg-transparent cursor-pointer"
              style={{ color: "#717171" }}
              readOnly
              value={formatDateRange()}
            />
          </div>

          {/* Separator */}
          {!showDatePicker && !showGuestsPicker && (
            <div className="w-px h-8 bg-gray-300"></div>
          )}

          {/* Voyageurs + Rechercher - Wrapper with ref */}
          <div ref={guestsDropdownRef} className="flex-[1.2] relative">
            <div
              className={`flex-1 py-0.5 flex items-center relative transition-all ${
                showGuestsPicker
                  ? "bg-white shadow-md z-10"
                  : "bg-transparent"
              }`}
              style={{
                borderRadius: showGuestsPicker
                  ? "100px"
                  : "0 32px 32px 0",
                ...(!showDestinations &&
                !showDatePicker &&
                !showGuestsPicker
                  ? {
                      borderTop: "1px solid #DDDDDD",
                      borderBottom: "1px solid #DDDDDD",
                      borderRight: "1px solid #DDDDDD",
                      borderLeft: "none",
                    }
                  : {}),
              }}
            >
              <div
                className="flex-1 flex flex-row items-center px-8 py-2 cursor-pointer relative"
                onClick={() => {
                  setShowGuestsPicker(true);
                  setShowDestinations(false);
                  setShowDatePicker(false);
                }}
                ref={guestsButtonRef}
              >
                <div className="w-1/3">
                  <label
                    className="block text-xs mb-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{ fontWeight: 600, color: "#222222" }}
                  >
                    Voyageurs
                  </label>
                  <div
                    className="w-full outline-none text-sm cursor-pointer"
                    style={{ color: "#717171" }}
                  >
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                      {guestsText || (
                        <span className="text-gray-400">
                          Ajouter des...
                        </span>
                      )}
                    </span>
                  </div>
                </div>
                {totalGuests > 0 && showGuestsPicker && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearGuests();
                    }}
                    className="absolute w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors z-20"
                    style={{
                      right:
                        showDestinations ||
                        showDatePicker ||
                        showGuestsPicker
                          ? "165px"
                          : "60px",
                    }}
                  >
                    <X className="w-3 h-3 text-gray-700" />
                  </button>
                )}
              </div>

              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white rounded-full transition-all flex items-center gap-2"
                onClick={handleSearchClick}
                style={{
                  backgroundColor: "#5EC6D8",
                  padding:
                    showDestinations ||
                    showDatePicker ||
                    showGuestsPicker
                      ? "14px 24px"
                      : "14px",
                }}
              >
                <Search className="w-4 h-4" />
                {(showDestinations ||
                  showDatePicker ||
                  showGuestsPicker) && (
                  <span
                    className="text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    Rechercher
                  </span>
                )}
              </button>
            </div>

            {/* Guests Picker Dropdown - inside the ref wrapper */}
            {showGuestsPicker && (
              <GuestsPicker
                onClose={() => setShowGuestsPicker(false)}
                onGuestsChange={(guests) =>
                  setGuestsCount(guests)
                }
                currentGuests={guestsCount}
              />
            )}
          </div>
        </div>

        {/* Dropdown suggestions */}
        {showDestinations && (
          <div
            className="absolute top-full left-0 w-[500px] mt-2 bg-white z-50"
            style={{
              borderRadius: "20px",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="max-h-[420px] overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <h3
                className="text-[13px] mb-4 px-2"
                style={{ fontWeight: 500, color: "#717171" }}
              >
                Suggestions de destinations
              </h3>
              <div className="space-y-0">
                {filteredDestinations.length > 0 ? (
                  filteredDestinations.map(
                    (destination, index) => {
                      const Icon = destination.icon;
                      return (
                        <button
                          key={index}
                          className="w-full flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          onClick={() => {
                            setSearchValue(destination.title);
                            setShowDestinations(false);
                            // Auto-focus sur le champ Dates après sélection d'une ville
                            setTimeout(() => {
                              setShowDatePicker(true);
                              dateButtonRef.current?.click();
                            }, 100);
                          }}
                        >
                          <div
                            className={`flex-shrink-0 w-12 h-12 flex items-center justify-center ${destination.bgColor} ${destination.iconColor}`}
                            style={{ borderRadius: "8px" }}
                          >
                            <Icon
                              className="w-5 h-5"
                              strokeWidth={1.5}
                            />
                          </div>
                          <div className="flex-1 min-w-0 pt-0.5">
                            <p
                              className="text-[15px] mb-0.5"
                              style={{
                                fontWeight: 600,
                                color: "#222222",
                              }}
                            >
                              {destination.title}
                            </p>
                            {destination.description && (
                              <p
                                className="text-[13px]"
                                style={{ color: "#717171" }}
                              >
                                {destination.description}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    },
                  )
                ) : (
                  <p className="text-[13px] text-gray-500 py-4 text-center">
                    Aucune destination trouvée
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Date Picker Dropdown */}
        {showDatePicker && (
          <div ref={dateDropdownRef}>
            <ExperienceDatePicker
              onClose={() => setShowDatePicker(false)}
              onSelect={(dateText) => {
                setSelectedDate(dateText);
              }}
              onDatesChange={(start, end) => {
                setCheckInDate(start);
                setCheckOutDate(end);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export function CompactSearchBar({ currentPage, onOpen }: { currentPage: 'logements' | 'experiences' | 'services'; onOpen?: () => void }) {
  return (
    <div className="w-fit mx-auto">
      <button 
        onClick={onOpen}
        className="flex items-center border border-gray-200 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white pl-6 pr-2 py-2 cursor-pointer"
        style={{
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Icône spécifique selon la page */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {currentPage === 'logements' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.5 6.5V14.5H10V11C10 10.4477 9.55228 10 9 10H7C6.44772 10 6 10.4477 6 11V14.5H2.5V6.5" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M0.5 8L8 1.5L15.5 8" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {currentPage === 'experiences' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5Z" stroke="#222222" strokeWidth="1.5"/>
              <path d="M8 4V8L10.5 9.5" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {currentPage === 'services' && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1.5" y="1.5" width="5" height="5" rx="1" stroke="#222222" strokeWidth="1.5"/>
              <rect x="9.5" y="1.5" width="5" height="5" rx="1" stroke="#222222" strokeWidth="1.5"/>
              <rect x="1.5" y="9.5" width="5" height="5" rx="1" stroke="#222222" strokeWidth="1.5"/>
              <rect x="9.5" y="9.5" width="5" height="5" rx="1" stroke="#222222" strokeWidth="1.5"/>
            </svg>
          )}
        </div>

        {/* N'importe où */}
        <div
          className="text-sm px-4 rounded-full transition-colors flex-shrink-0"
          style={{ fontWeight: 600, color: '#222222' }}
        >
          N'importe où
        </div>
        
        {/* Séparateur */}
        <div className="w-px h-6 bg-gray-300 flex-shrink-0"></div>
        
        {/* Dates flexibles */}
        <div
          className="text-sm px-4 rounded-full transition-colors flex-shrink-0"
          style={{ fontWeight: 600, color: '#222222' }}
        >
          Dates flexibles
        </div>
        
        {/* Séparateur */}
        <div className="w-px h-6 bg-gray-300 flex-shrink-0"></div>
        
        {/* Ajouter (texte change selon la page) */}
        <div 
          className="text-sm px-4 rounded-full transition-colors flex-shrink-0"
          style={{ color: '#717171' }}
        >
          {currentPage === 'services' ? 'Ajouter' : 'Ajouter des voyageurs'}
        </div>
        
        {/* Bouton de recherche */}
        <div className="ml-auto flex-shrink-0">
          <div
            className="bg-[#5EC6D8] text-white p-2.5 rounded-full"
            aria-label="Rechercher"
          >
            <Search className="w-3.5 h-3.5" />
          </div>
        </div>
      </button>
    </div>
  );
}