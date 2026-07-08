import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react';

const locationOptions = ['All Locations', 'Manila', 'Cebu', 'Davao', 'Iloilo'];
const dateOptions = ['All Dates', 'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026'];

const SearchBar = () => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [date, setDate] = useState('All Dates');
  const [openDropdown, setOpenDropdown] = useState(null); // 'location' | 'date' | null
  const locationRef = useRef(null);
  const dateRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationRef.current && !locationRef.current.contains(e.target)) {
        if (openDropdown === 'location') setOpenDropdown(null);
      }
      if (dateRef.current && !dateRef.current.contains(e.target)) {
        if (openDropdown === 'date') setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const selectOption = (type, value) => {
    if (type === 'location') setLocation(value);
    if (type === 'date') setDate(value);
    setOpenDropdown(null);
  };

  return (
    <div className="relative z-20 -mt-6">
      <div className="max-w-container mx-auto px-8 max-sm:px-6">
        <div
          className="bg-white rounded-2xl p-2 flex flex-col lg:flex-row items-stretch gap-2"
          style={{ boxShadow: '0px 4px 4px rgba(18, 18, 18, 0.15)' }}
        >
          {/* Keyword input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-[14px] min-w-0">
            <Search className="w-5 h-5 text-[#ACACAC] shrink-0" aria-hidden="true" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search Wedding Fair..."
              aria-label="Search Wedding Fair"
              className="w-full bg-transparent text-sm text-[#121212] placeholder-[#ACACAC] font-satoshi outline-none border-none focus:ring-0"
            />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-[#E8E8E8] self-stretch my-2" />

          {/* Location dropdown */}
          <div className="relative flex-shrink-0" ref={locationRef}>
            <button
              onClick={() => toggleDropdown('location')}
              className="flex items-center gap-3 px-4 py-[14px] text-sm text-[#121212] font-satoshi whitespace-nowrap w-full lg:w-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] rounded-lg"
              aria-label="Select location"
              aria-expanded={openDropdown === 'location'}
            >
              <MapPin className="w-5 h-5 text-[#ACACAC] shrink-0" aria-hidden="true" />
              <span className={location === 'All Locations' ? 'text-[#ACACAC]' : 'text-[#121212]'}>
                {location}
              </span>
              <ChevronDown className="w-4 h-4 text-[#ACACAC] shrink-0" />
            </button>
            {openDropdown === 'location' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md py-1 z-30"
                style={{ boxShadow: '0px 6px 16px rgba(18, 18, 18, 0.15)' }}
              >
                {locationOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption('location', opt)}
                    className={`w-full text-left px-4 py-2 text-sm font-satoshi transition-colors hover:bg-[rgba(197,95,97,0.05)] ${
                      location === opt ? 'text-[#C55F61] font-medium' : 'text-[#121212]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-[#E8E8E8] self-stretch my-2" />

          {/* Date dropdown */}
          <div className="relative flex-shrink-0" ref={dateRef}>
            <button
              onClick={() => toggleDropdown('date')}
              className="flex items-center gap-3 px-4 py-[14px] text-sm text-[#121212] font-satoshi whitespace-nowrap w-full lg:w-auto focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] rounded-lg"
              aria-label="Select date"
              aria-expanded={openDropdown === 'date'}
            >
              <Calendar className="w-5 h-5 text-[#ACACAC] shrink-0" aria-hidden="true" />
              <span className={date === 'All Dates' ? 'text-[#ACACAC]' : 'text-[#121212]'}>
                {date}
              </span>
              <ChevronDown className="w-4 h-4 text-[#ACACAC] shrink-0" />
            </button>
            {openDropdown === 'date' && (
              <div
                className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md py-1 z-30 max-h-60 overflow-y-auto"
                style={{ boxShadow: '0px 6px 16px rgba(18, 18, 18, 0.15)' }}
              >
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => selectOption('date', opt)}
                    className={`w-full text-left px-4 py-2 text-sm font-satoshi transition-colors hover:bg-[rgba(197,95,97,0.05)] ${
                      date === opt ? 'text-[#C55F61] font-medium' : 'text-[#121212]'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-8 py-[14px] rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
            style={{
              background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.boxShadow = '0px 4px 12px rgba(197, 95, 97, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Search Wedding Fairs
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
