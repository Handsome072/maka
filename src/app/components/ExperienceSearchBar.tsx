import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ExperienceDestinationPicker } from "./ExperienceDestinationPicker";
import { ExperienceDatePicker } from "./ExperienceDatePicker";
import { ExperienceGuestsPicker } from "./ExperienceGuestsPicker";
import backgroundImage from '@/assets/ea9a43f19f699f5eeca472b649d75293c416f15e.png';

export function ExperienceSearchBar() {
  const [showDestinations, setShowDestinations] =
    useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestsPicker, setShowGuestsPicker] =
    useState(false);
  const [guestsCount, setGuestsCount] = useState({
    adults: 0,
    children: 0,
    babies: 0,
  });
  const [selectedDestination, setSelectedDestination] =
    useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowDestinations(false);
        setShowDatePicker(false);
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

  const totalGuests =
    guestsCount.adults +
    guestsCount.children +
    guestsCount.babies;
  const guestsText =
    totalGuests > 0
      ? `${totalGuests} voyageur${totalGuests > 1 ? "s" : ""}`
      : "";

  const handleClearGuests = () => {
    setGuestsCount({ adults: 0, children: 0, babies: 0 });
  };

  return (
    <div 
      className="relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="px-4 sm:px-6 lg:px-20 py-6">
        <div
          className="max-w-5xl mx-auto relative"
          ref={searchBarRef}
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
              className={`flex-1 px-8 py-4.5 cursor-pointer relative transition-all ${
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
              }}
            >
              <label
                className="block text-xs mb-1 cursor-pointer"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Destination
              </label>
              <div className="w-full outline-none text-sm cursor-pointer">
                {selectedDestination ? (
                  <span style={{ color: "#717171" }}>
                    {selectedDestination}
                  </span>
                ) : (
                  <span className="text-gray-400">
                    Ville, musée ou monument
                  </span>
                )}
              </div>
            </div>

            {/* Separator */}
            {!showDestinations && !showDatePicker && (
              <div className="w-px h-8 bg-gray-300"></div>
            )}

            {/* Dates */}
            <div
              className={`flex-1 px-8 py-4.5 cursor-pointer relative transition-all ${
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
            >
              <label
                className="block text-xs mb-1 cursor-pointer"
                style={{ fontWeight: 600, color: "#222222" }}
              >
                Dates
              </label>
              <div className="w-full outline-none text-sm cursor-pointer">
                {selectedDate ? (
                  <span style={{ color: "#717171" }}>
                    {selectedDate}
                  </span>
                ) : (
                  <span className="text-gray-400">Quand ?</span>
                )}
              </div>
            </div>

            {/* Separator */}
            {!showDatePicker && !showGuestsPicker && (
              <div className="w-px h-8 bg-gray-300"></div>
            )}

            {/* Voyageurs + Rechercher */}
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
                className="w-full flex-1 flex flex-row items-center px-8 py-4 cursor-pointer relative"
                onClick={() => {
                  setShowGuestsPicker(true);
                  setShowDestinations(false);
                  setShowDatePicker(false);
                }}
              >
                <div className='w-1/3'>
                  <label
                    className="block text-xs mb-1 overflow-hidden cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{
                      fontWeight: 600,
                      color: "#222222",
                    }}
                  >
                    Voyageurs
                  </label>
                  <div
                    className="w-full outline-none text-sm cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                    style={{
                      color: "#717171",
                    }}
                  >
                    {guestsText ? (
                      <span style={{ color: "#717171" }}>
                        {guestsText}
                      </span>
                    ) : (
                      <span className="text-gray-400">
                        Ajouter des...
                      </span>
                    )}
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
                style={{
                  backgroundColor: "#00BCD4",
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
          </div>

          {/* Dropdowns positioned relative to search bar container */}
          {showDestinations && (
            <ExperienceDestinationPicker
              onClose={() => setShowDestinations(false)}
              onSelect={(destination) =>
                setSelectedDestination(destination)
              }
            />
          )}

          {showDatePicker && (
            <ExperienceDatePicker
              onClose={() => setShowDatePicker(false)}
              onSelect={(date) => setSelectedDate(date)}
            />
          )}

          {showGuestsPicker && (
            <ExperienceGuestsPicker
              onClose={() => setShowGuestsPicker(false)}
              onGuestsChange={(guests) =>
                setGuestsCount(guests)
              }
              currentGuests={guestsCount}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function CompactExperienceSearchBar() {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-20 py-4">
        <div className="w-fit mx-auto">
          <div className="flex items-center gap-3 border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow bg-white px-6 py-2.5">
            <button
              className="text-sm hover:underline"
              style={{ fontWeight: 600 }}
            >
              N'importe où
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
              className="text-sm hover:underline"
              style={{ fontWeight: 600 }}
            >
              Dates flexibles
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button className="text-sm text-gray-500 hover:underline">
              Ajouter des voyageurs
            </button>
            <div className="ml-auto bg-[#10B981] hover:bg-[#047857] text-white p-2 rounded-full transition-colors">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}