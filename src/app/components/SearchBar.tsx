import {
  Search,
  Landmark,
  MapPin,
  X,
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { usePublicListings } from "../hooks/usePublicListings";
import { destinationSuggestions, filterSuggestions } from "@/shared/places";
import { ExperienceDatePicker } from "./ExperienceDatePicker";
import { GuestsPicker } from "./GuestsPicker";

interface SearchBarProps {
  onSearch?: (params: any) => void;
  type?: 'logements' | 'experiences' | 'services';
}

export function SearchBar({ onSearch, type = 'logements' }: SearchBarProps) {
  const [showDestinations, setShowDestinations] =
    useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] =
    useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [guestsCount, setGuestsCount] = useState({
    adults: 0,
    children: 0,
    babies: 0,
    pets: type === 'services' ? 0 : 0,
  });
  const [serviceType] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(
    null,
  );
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(
    null,
  );
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

  // Destinations où des annonces sont publiées, chargées à l'ouverture de la liste
  const { listings: destinationListings, failed: destinationsFailed } = usePublicListings(showDestinations);
  const suggestions = useMemo(
    () => destinationSuggestions(destinationListings ?? []),
    [destinationListings],
  );
  const filteredDestinations = filterSuggestions(suggestions, searchValue).slice(0, 12);

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
    <div
      className="px-4 sm:px-6 lg:px-12 pt-4 py-3 pb-10 relative bg-[#FCFCFC]"
    >
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

          {/* Section conditionnelle selon le type */}
          {type === 'services' ? (
            /* Type de service + Rechercher - Pour Services */
            <div className="flex-[1.2] relative">
              <div
                className="flex-1 py-0.5 flex items-center relative transition-all bg-transparent"
                style={{
                  borderRadius: "0 32px 32px 0",
                  ...(!showDestinations &&
                  !showDatePicker
                    ? {
                        borderTop: "1px solid #DDDDDD",
                        borderBottom: "1px solid #DDDDDD",
                        borderRight: "1px solid #DDDDDD",
                        borderLeft: "none",
                      }
                    : {}),
                }}
              >
                <div className="flex-1 flex flex-row items-center px-8 py-2 cursor-pointer relative">
                  <div className="w-1/3">
                    <label
                      className="block text-xs mb-1 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                      style={{ fontWeight: 600, color: "#222222" }}
                    >
                      Type de service
                    </label>
                    <div
                      className="w-full outline-none text-sm cursor-pointer"
                      style={{ color: "#717171" }}
                    >
                      <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
                        {serviceType || (
                          <span className="text-gray-400">
                            Ajouter un service...
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white rounded-full transition-all flex items-center gap-2"
                  onClick={handleSearchClick}
                  style={{
                    backgroundColor: "#5EC6D8",
                    padding:
                      showDestinations ||
                      showDatePicker
                        ? "14px 24px"
                        : "14px",
                  }}
                >
                  <Search className="w-4 h-4" />
                  {(showDestinations ||
                    showDatePicker) && (
                    <span
                      className="text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      Rechercher
                    </span>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Voyageurs + Rechercher - Pour Logements/Expériences */
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
                showPets={type === 'logements'}
              />
            )}
          </div>
          )}
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
                {!destinationListings && !destinationsFailed ? (
                  <p className="text-[13px] text-gray-500 py-4 text-center">
                    Chargement des destinations…
                  </p>
                ) : filteredDestinations.length > 0 ? (
                  filteredDestinations.map(
                    (destination) => {
                      const Icon = destination.kind === "province" ? Landmark : MapPin;
                      return (
                        <button
                          key={`${destination.kind}-${destination.label}`}
                          className="w-full flex items-center gap-4 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-left"
                          onClick={() => {
                            setSearchValue(destination.label);
                            setShowDestinations(false);
                            // Auto-focus sur le champ Dates après sélection d'une ville
                            setTimeout(() => {
                              setShowDatePicker(true);
                              dateButtonRef.current?.click();
                            }, 100);
                          }}
                        >
                          {destination.image ? (
                            <img
                              src={destination.image}
                              alt=""
                              className="flex-shrink-0 w-14 h-14 object-cover"
                              style={{ borderRadius: "10px" }}
                            />
                          ) : (
                            <div
                              className={`flex-shrink-0 w-14 h-14 flex items-center justify-center ${destination.kind === "province" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
                              style={{ borderRadius: "10px" }}
                            >
                              <Icon
                                className="w-5 h-5"
                                strokeWidth={1.5}
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[15px] mb-0.5"
                              style={{
                                fontWeight: 600,
                                color: "#222222",
                              }}
                            >
                              {destination.label}
                            </p>
                            <p
                              className="text-[13px]"
                              style={{ color: "#717171" }}
                            >
                              {destination.kind === "province" ? "Province · " : ""}
                              {destination.count} logement{destination.count > 1 ? "s" : ""}
                            </p>
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
