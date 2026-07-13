import React from 'react';
import { Star, ArrowRight, MapPin, Clock, Calendar, SquareUser, UsersRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtiLogo from '@/assets/dtilogo.png';
import { formatDate, formatTime } from '@/lib/utils/eventUtils';

const RegisterButton = ({ className, onClick }) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 w-full focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] ${className}`}
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
    Register Now
    <ArrowRight className="w-4 h-4" />
  </button>
);

const FeaturedEvent = ({ event }) => {
  const navigate = useNavigate();

  if (!event) return null;

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const handleRegister = () => {
    navigate('/event/register', { state: { event } });
  };

  // Format date range with day names
  const formatDateRange = () => {
    if (!event.startDate) return '';
    const start = new Date(event.startDate);
    const end = event.endDate ? new Date(event.endDate) : null;

    const startFormatted = start.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });

    if (!end) return startFormatted;

    const endFormatted = end.toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });

    const startDay = start.toLocaleDateString('en-US', { weekday: 'long' });
    const endDay = end.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      range: `${startFormatted} - ${endFormatted}`,
      days: `${startDay} - ${endDay}`,
    };
  };

  // Format time range
  const formatTimeRange = () => {
    const startTime = formatTime(event.event_start_time) || 'TBA';
    const endTime = formatTime(event.event_end_time) || 'TBA';
    return {
      range: `${startTime} - ${endTime}`,
      label: 'Both Days',
    };
  };

  const dateInfo = formatDateRange();
  const timeInfo = formatTimeRange();

  return (
    <div className="mb-[60px]">
      <div
        className="flex flex-col lg:flex-row rounded-lg overflow-hidden border cursor-pointer"
        style={{ borderColor: '#C55F61', borderWidth: '0.5px' }}
        onClick={handleViewDetails}
      >
        {/* Left: Image with badge */}
        <div
          className="relative w-full lg:w-[360px] min-h-[200px] md:min-h-[360px] lg:self-stretch shrink-0 bg-slate-100 overflow-hidden"
        >
          <img
            src={event.image || dtiLogo}
            alt={event.title || 'Featured event image'}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = dtiLogo;
            }}
            className="w-full h-full object-cover"
          />
          {/* Featured badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#C55F61] text-white px-3 py-1.5 rounded text-xs font-bold font-satoshi">
            <Star className="w-3.5 h-3.5 fill-[#FFB24E] text-[#FFB24E]" />
            FEATURED EVENT
          </div>
        </div>

        {/* Center: Content */}
        <div className="flex-1 flex flex-col justify-center px-4 py-4 md:px-8 md:py-8 min-w-0">
          <span className="text-sm font-bold text-[#C55F61] font-satoshi uppercase tracking-wider mb-2">
            UP NEXT
          </span>
          <h3 className="text-[24px] md:text-[32px] font-bold text-[#121212] font-cormorant leading-tight mb-3">
            {event.title}
          </h3>
          <p className="text-sm text-[#737373] font-satoshi leading-relaxed mb-6 line-clamp-3">
            {event.description}
          </p>

          {/* Meta row with dividers */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-0">
            {/* Date */}
            <div className="flex items-start gap-2 sm:flex-1">
              <Calendar className="w-5 h-5 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#121212] font-satoshi">
                  {typeof dateInfo === 'string' ? dateInfo : dateInfo.range}
                </p>
                {typeof dateInfo !== 'string' && (
                  <p className="text-xs text-[#737373] font-satoshi mt-0.5">
                    {dateInfo.days}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-[#E8E8E8] mx-4" />

            {/* Time */}
            <div className="flex items-start gap-2 sm:flex-1">
              <Clock className="w-5 h-5 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#121212] font-satoshi">
                  {timeInfo.range}
                </p>
                <p className="text-xs text-[#737373] font-satoshi mt-0.5">
                  {timeInfo.label}
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-[#E8E8E8] mx-4" />

            {/* Venue */}
            <div className="flex items-start gap-2 sm:flex-1">
              <MapPin className="w-5 h-5 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#121212] font-satoshi">
                  {event.location}
                </p>
                <p className="text-xs text-[#737373] font-satoshi mt-0.5">
                  {event.location}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile Register button */}
          <div className="md:hidden mt-6">
            <RegisterButton
              onClick={(e) => {
                e.stopPropagation();
                handleRegister();
              }}
            />
          </div>
        </div>

        {/* Right: Stat pills + CTA */}
        <div className="hidden md:flex flex-col items-center justify-center gap-6 px-4 py-4 md:px-8 md:py-8 lg:border-l border-[#E8E8E8] shrink-0">
          {/* Stat pills — matching BenefitsCard layout */}
          <div className="flex flex-col gap-2 w-full">
            {/* Exhibitors */}
            <div className="flex flex-row items-center gap-3 bg-[#C55F611A] rounded-lg p-2">
              <SquareUser className="w-14 h-14 text-[#AF5456] shrink-0 mt-0.5 border rounded-full p-2" strokeWidth={1.1} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#121212] font-satoshi">
                  {event?.exhibitors != null ? `${event.exhibitors}+` : '—'}
                </span>
                <p className="text-sm text-[#737373] font-satoshi leading-relaxed">
                  Exhibitors
                </p>
              </div>
            </div>

            {/* Expected Guests */}
            <div className="flex flex-row items-center gap-3 bg-[#C55F611A] rounded-lg p-2">
              <UsersRound className="w-14 h-14 text-[#AF5456] shrink-0 mt-0.5 border rounded-full p-2" strokeWidth={1.1} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#121212] font-satoshi">
                  {event?.noOfParticipants != null
                    ? event.noOfParticipants.toLocaleString()
                    : '—'}
                </span>
                <p className="text-sm text-[#737373] font-satoshi leading-relaxed">
                  Expected Guests
                </p>
              </div>
            </div>

            {/* Days of Inspiration */}
            <div className="flex flex-row items-center gap-3 bg-[#C55F611A] rounded-lg p-2">
              <Calendar className="w-14 h-14 text-[#AF5456] shrink-0 mt-0.5 border rounded-full p-2" strokeWidth={1.1} />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#121212] font-satoshi">
                  {event?.daysOfInspiration != null
                    ? event.daysOfInspiration
                    : '—'}
                </span>
                <p className="text-sm text-[#737373] font-satoshi leading-relaxed">
                  Days of Inspiration
                </p>
              </div>
            </div>
          </div>

          {/* Register button */}
          <RegisterButton
            onClick={(e) => {
              e.stopPropagation();
              handleRegister();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;
