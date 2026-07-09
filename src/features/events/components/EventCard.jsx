import React from 'react';
import { MapPin, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtiLogo from '@/assets/dtilogo.png';
import { formatDate } from '@/lib/utils/eventUtils';

const EventCard = ({ event, className = '', style }) => {
  const navigate = useNavigate();

  // Derive city badge from event.rawRegion (preserved original value from API)
  const cityBadge = (event.rawRegion || event.region || 'MANILA').toUpperCase();

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewDetails();
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E8E8E8] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(197,95,97,0.15)] cursor-pointer ${className}`}
      style={style}
      role="button"
      tabIndex={0}
      onClick={handleViewDetails}
      onKeyDown={handleKeyDown}
    >
      {/* Image container with city badge and featured badge */}
      <div className="relative w-full h-56 overflow-hidden bg-slate-100 shrink-0">
        <img
          src={event.image || dtiLogo}
          alt={event.title || 'Event image'}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = dtiLogo;
          }}
          className="w-full h-full object-cover"
        />
        {/* Featured badge — upper left when featured */}
        {event.isFeatured && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#C55F61] text-white px-2 py-1 md:px-3 md:py-1.5 rounded text-[10px] md:text-xs font-bold font-satoshi">
            <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-[#FFB24E] text-[#FFB24E]" />
            FEATURED
          </div>
        )}
        {/* City badge — below featured badge when both present, upper left when not */}
        <div className={`absolute bg-[#C55F61] text-white px-2 py-0.5 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold font-satoshi ${event.isFeatured ? 'top-12 left-3' : 'top-3 left-3'}`}>
          {cityBadge}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-3 md:p-5 gap-3 md:gap-4">
        <h4 className="text-lg md:text-2xl font-bold text-[#121212] font-cormorant leading-tight line-clamp-2">
          {event.title}
        </h4>

        <div className="flex flex-col gap-2">
          {/* Date */}
          <div className="flex items-start gap-1.5 md:gap-2">
            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#606060] shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-[#606060] font-satoshi">
              {formatDate(event.startDate)}
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          {/* Venue */}
          <div className="flex items-start gap-1.5 md:gap-2">
            <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#606060] shrink-0 mt-0.5" />
            <span className="text-xs md:text-sm text-[#606060] font-satoshi line-clamp-1">
              {event.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
