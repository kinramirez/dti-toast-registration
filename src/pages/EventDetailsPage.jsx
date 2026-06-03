import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  // Calendar,
  CalendarCheck,
  BookOpenText,
  CalendarX,
  MapPin,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { normalizeEvent } from '@/lib/utils/eventUtils';
import dtiLogo from '@/assets/dtilogo.png';
import ImageModal from '@/components/ui/ImageModal';
import { formatDate, formatTime } from '@/lib/utils/eventUtils';

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const event = useMemo(() => {
    const stateEvent = location.state?.event;
    return stateEvent ? normalizeEvent(stateEvent) : null;
  }, [location.state]);

  const handleRegister = () => {
    if (event) {
      navigate('/event/register', { state: { event } });
    }
  };

  const DESCRIPTION_LIMIT = 200;
  const shouldTruncate =
    event?.description && event.description.length > DESCRIPTION_LIMIT;
  const displayDescription =
    isDescriptionExpanded || !shouldTruncate
      ? event?.description
      : event?.description?.slice(0, DESCRIPTION_LIMIT) + '...';

  return (
    <section className='bg-gradient-to-b from-slate-50 to-white min-h-screen pb-16'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {!event ? (
          <div className='mt-10 rounded-2xl border bg-white p-8 text-center shadow-sm'>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              Event not found
            </h3>
            <Button onClick={() => navigate('/event')}>Go back</Button>
          </div>
        ) : (
          <>
            {/* HERO IMAGE */}
            <div
              onClick={() => setIsImageOpen(true)}
              className='relative mt-6 rounded-3xl overflow-hidden cursor-pointer group'
            >
              <img
                src={event.image || dtiLogo}
                alt={event.title}
                className='w-full object-contain group-hover:scale-105 transition duration-500'
              />

              {/* DARK OVERLAY */}
              <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent' />

              {/* TITLE OVER IMAGE */}
              <div className='absolute bottom-0 p-6 sm:p-8 text-white'>
                {/* <span className='text-xs uppercase tracking-widest text-blue-300'>
                  {event.category}
                </span> */}
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold mt-2 max-w-2xl'>
                  {event.title}
                </h1>
              </div>
            </div>

            {/* MAIN CONTENT */}
            <div className='grid lg:grid-cols-[1fr_360px] gap-8 mt-8'>
              {/* LEFT CONTENT */}
              <div className='space-y-6'>
                <div className='bg-white rounded-2xl p-5 sm:p-6 shadow-sm border'>
                  {/* META */}
                  <div className='flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-6'>
                    <div className='flex items-center gap-2'>
                      <CalendarCheck className='h-5 w-5 text-blue-500' />
                      <span className='text-sm sm:text-base'>
                        Start: {formatDate(event.startDate)} |{' '}
                        {formatTime(event.event_start_time)}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <CalendarX className='h-5 w-5 text-blue-500' />
                      <span className='text-sm sm:text-base'>
                        End: {formatDate(event.endDate)} |{' '}
                        {formatTime(event.event_end_time)}
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center gap-2 mb-4'>
                    <MapPin className='h-5 w-5 text-blue-500' />
                    <span className='text-sm sm:text-base'>
                      {event.location}
                    </span>
                  </div>

                  {/* DESCRIPTION */}
                  <div className='space-y-4 text-slate-700'>
                    {/* <p className='text-sm sm:text-base leading-relaxed'>
                      {displayDescription}
                    </p> */}
                    <div className='flex items-center gap-2'>
                      <BookOpenText className='h-5 w-5 text-blue-500' />
                      <span className='text-sm sm:text-base'>
                        {displayDescription}
                      </span>
                    </div>

                    {shouldTruncate && (
                      <button
                        onClick={() =>
                          setIsDescriptionExpanded(!isDescriptionExpanded)
                        }
                        className='text-blue-600 text-sm font-semibold flex items-center gap-1'
                      >
                        {isDescriptionExpanded ? (
                          <>
                            See less <ChevronUp className='h-4 w-4' />
                          </>
                        ) : (
                          <>
                            See more <ChevronDown className='h-4 w-4' />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* RIGHT SIDEBAR CTA */}
              <div className='lg:sticky lg:top-24 h-fit'>
                <div className='bg-white rounded-2xl border shadow-lg p-6 space-y-6'>
                  <div>
                    <p className='text-sm text-slate-500'>Secure your slot</p>
                    <h3 className='text-xl font-bold text-slate-900'>
                      Join this event
                    </h3>
                  </div>

                  <Button
                    onClick={handleRegister}
                    className='w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base'
                  >
                    {event.buttonText || 'Register Now'}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>

                  <p className='text-xs text-slate-400 text-center'>
                    Limited slots available
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {isImageOpen && (
        <ImageModal
          src={event?.image || dtiLogo}
          alt={event?.title}
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </section>
  );
};

export default EventDetailsPage;
