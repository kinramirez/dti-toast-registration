import React from 'react';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dtiLogo from '@/assets/dtilogo.png';
import { formatDate } from '@/lib/utils/eventUtils';

const EventCard = ({ event, className = '', style }) => {
  const navigate = useNavigate();

  // Static placeholder city badge (resolved item 25)
  const cityBadge = 'MANILA';

  const handleViewDetails = () => {
    navigate(`/event/${event.id}`, { state: { event } });
  };

  return (
    <div
      className={`flex flex-col rounded-lg overflow-hidden bg-white ${className}`}
      style={style}
    >
      {/* Image container with city badge — click navigates to event details */}
      <div
        className="relative w-full h-56 overflow-hidden bg-slate-100 cursor-pointer shrink-0"
        onClick={handleViewDetails}
      >
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
        {/* City badge */}
        <div className="absolute top-3 left-3 bg-[#C55F61] text-white px-3 py-1 rounded text-xs font-bold font-satoshi">
          {cityBadge}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-5 gap-4">
        <h4 className="text-2xl font-bold text-[#121212] font-cormorant leading-tight line-clamp-2">
          {event.title}
        </h4>

        <div className="flex flex-col gap-2">
          {/* Date */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#606060] shrink-0" />
            <span className="text-sm text-[#606060] font-satoshi">
              {formatDate(event.startDate)}
              {event.endDate && ` - ${formatDate(event.endDate)}`}
            </span>
          </div>
          {/* Venue */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#606060] shrink-0" />
            <span className="text-sm text-[#606060] font-satoshi line-clamp-1">
              {event.location}
            </span>
          </div>
        </div>

        {/* View Details link */}
        <button
          onClick={handleViewDetails}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#AF5456] font-satoshi transition-all duration-200 hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61] rounded"
        >
          VIEW DETAILS
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default EventCard;
