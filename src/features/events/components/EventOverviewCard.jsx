import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  IdCard,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatDate, formatTime, parseDateAsLocal } from '@/lib/utils/eventUtils';

const DESCRIPTION_LIMIT = 200;

const EventOverviewCard = ({ event }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const description = event?.description || '';
  const shouldTruncate = description.length > DESCRIPTION_LIMIT;
  const displayDescription =
    isDescriptionExpanded || !shouldTruncate
      ? description
      : description.slice(0, DESCRIPTION_LIMIT) + '...';

  const startDateFormatted = formatDate(event?.startDate);
  const endDateFormatted = formatDate(event?.endDate);
  const startTimeFormatted = formatTime(event?.event_start_time);
  const endTimeFormatted = formatTime(event?.event_end_time);

  // Compute day-of-week labels
  const getDayLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = parseDateAsLocal(dateStr);
    if (!d) return '';
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };
  const startDay = getDayLabel(event?.startDate);
  const endDay = getDayLabel(event?.endDate);

  const dateRangeLabel =
    startDateFormatted && endDateFormatted
      ? `${startDateFormatted} – ${endDateFormatted}`
      : startDateFormatted || endDateFormatted || 'TBA';

  const dayRangeLabel =
    startDay && endDay && startDay !== endDay
      ? `${startDay} - ${endDay}`
      : startDay || '';

  const timeRangeLabel =
    startTimeFormatted && endTimeFormatted && startTimeFormatted !== endTimeFormatted
      ? `${startTimeFormatted} - ${endTimeFormatted}`
      : startTimeFormatted || 'TBA';

  return (
    <div
      className="bg-white rounded-lg mx-auto"
      style={{
        boxShadow: '0px 9px 4px rgba(18, 18, 18, 0.05)',
        maxWidth: '1728px',
      }}
    >
      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#C55F61]">
        {/* LEFT PANEL — Event Overview */}
        <div className="p-8 lg:p-12">
          <h2 className="font-satoshi font-bold text-2xl leading-8 text-[#121212] mb-8">
            Event Overview
          </h2>

          <div className="space-y-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi font-medium text-base leading-[22px] text-[#121212]">
                  {dateRangeLabel}
                </p>
                {dayRangeLabel && (
                  <p className="font-satoshi font-normal text-xs leading-4 text-[#606060] mt-0.5">
                    {dayRangeLabel}
                  </p>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi font-medium text-base leading-[22px] text-[#121212]">
                  {timeRangeLabel}
                </p>
                <p className="font-satoshi font-normal text-xs leading-4 text-[#606060] mt-0.5">
                  {event?.daysOfInspiration != null
                    ? `All ${event.daysOfInspiration} Days`
                    : 'Both Days'}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi font-medium text-base leading-[22px] text-[#121212]">
                  {event?.location}
                </p>
                <p className="font-satoshi font-normal text-xs leading-4 text-[#606060] mt-0.5">
                  {event?.venueAddress}
                </p>
              </div>
            </div>

            {/* Attendees */}
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi font-medium text-base leading-[22px] text-[#121212]">
                  {event?.noOfParticipants != null
                    ? `${event.noOfParticipants.toLocaleString()}+ Attendees`
                    : 'Attendee count to be announced'}
                </p>
                <p className="font-satoshi font-normal text-xs leading-4 text-[#606060] mt-0.5">
                  Expected Attendees
                </p>
              </div>
            </div>

            {/* Exhibitors */}
            <div className="flex items-start gap-3">
              <IdCard className="w-6 h-6 text-[#C55F61] shrink-0 mt-0.5" />
              <div>
                <p className="font-satoshi font-medium text-base leading-[22px] text-[#121212]">
                  {event?.exhibitors != null
                    ? `${event.exhibitors}+ Exhibitors`
                    : 'No exhibitors at the moment'}
                </p>
                <p className="font-satoshi font-normal text-xs leading-4 text-[#606060] mt-0.5">
                  Exhibitors
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — About the event */}
        <div className="p-8 lg:p-12">
          <h2 className="font-satoshi font-bold text-2xl leading-8 text-[#121212] mb-6">
            About the event
          </h2>

          <p className="font-satoshi font-medium text-base leading-[22px] text-[#606060] mb-4">
            {displayDescription}
          </p>

          {shouldTruncate && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-[#C55F61] font-satoshi font-bold text-sm flex items-center gap-1 mb-6 hover:opacity-80 transition-opacity"
            >
              {isDescriptionExpanded ? (
                <>
                  See less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  See more <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          )}

          {/* Checklist */}
          <div className="space-y-4">
            {(event?.highlights || []).map((item, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-5 h-5 rounded-full bg-[rgba(197,95,97,0.1)] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-[#C55F61]" />
                </div>
                <p className="font-satoshi font-medium text-sm leading-[19px] text-[#606060]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventOverviewCard;
