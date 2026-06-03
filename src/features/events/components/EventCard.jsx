import React, { useState, useMemo } from 'react';
import { MapPin, ArrowRight, CalendarCheck, CalendarX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import dtiLogo from '@/assets/dtilogo.png';
import ImageModal from '@/components/ui/ImageModal';
import { formatDate, formatTime } from '@/lib/utils/eventUtils';

const EventCard = ({ event, viewMode, className = '', style }) => {
  const navigate = useNavigate();
  const [isImageOpen, setIsImageOpen] = useState(false);

  if (viewMode === 'list') {
    return (
      <>
        <div
          className={`flex flex-col md:flex-row gap-8 items-center border-b pb-8 ${className}`}
          style={style}
        >
          <div
            className='relative w-48 h-48 shrink-0 overflow-hidden rounded-xl bg-slate-100 cursor-pointer group'
            onClick={() => setIsImageOpen(true)}
          >
            <div className='absolute -left-3 top-8 w-6 h-24 bg-blue-500 rounded-sm z-0'></div>
            {event.image ? (
              <img
                src={event.image || dtiLogo}
                alt={event.title}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = dtiLogo;
                }}
                className='w-full h-full object-cover group-hover:opacity-90 transition-opacity'
              />
            ) : (
              <div className='flex h-full items-center justify-center text-sm text-slate-500'>
                <img src={dtiLogo} alt='' srcset='' />
              </div>
            )}
            <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
              <span className='text-white text-[10px] font-bold bg-black/50 px-2 py-1 rounded-full'>
                View
              </span>
            </div>
          </div>

          <div className='grow'>
            {/* <span className='text-blue-500 font-bold text-sm mb-1 block'>
              {event.category}
            </span> */}
            <h4 className='text-lg font-bold text-gray-900 mb-2'>
              {event.title}
            </h4>
            <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
              {event.description}
            </p>

            <div className='flex flex-col gap-2 text-xs font-medium text-gray-600'>
              <div className='flex items-center gap-2'>
                <CalendarCheck className='h-4 w-4' />
                Start: {formatDate(event.startDate)} |{' '}
                {formatTime(event.event_start_time) || '12:00 AM'}
              </div>
              <div className='flex items-center gap-2'>
                <CalendarX className='h-4 w-4' />
                End: {formatDate(event.endDate)} |{' '}
                {formatTime(event.event_end_time) || '12:00 AM'}
              </div>
              <div className='flex items-center gap-2'>
                <MapPin className='h-4 w-4' /> {event.location}
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-3 w-full md:w-auto shrink-0'>
            <Button
              onClick={() => navigate('/event/register', { state: { event } })}
              className='rounded-full px-8 gap-2 to-blue-500 bg-linear-to-r from-blue-600 hover:from-blue-700 hover:to-blue-600 text-white'
            >
              {event.buttonText || 'Register'}{' '}
              <ArrowRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                navigate(`/event/${event.id}`, { state: { event } })
              }
              className='rounded-full w-40 justify-between px-6'
            >
              Full Details <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
        {isImageOpen && (
          <ImageModal
            src={event.image || dtiLogo}
            alt={event.title}
            onClose={() => setIsImageOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div
        className={`flex flex-col border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white pb-6 ${className}`}
        style={style}
      >
        <div className='w-full h-48 shrink-0 mb-4 overflow-hidden rounded-3xl bg-slate-100 cursor-pointer group relative'>
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = dtiLogo;
              }}
              className='w-full h-full object-cover group-hover:opacity-90 transition-opacity'
              onClick={() => setIsImageOpen(true)}
            />
          ) : (
            <div className='flex h-full items-center justify-center text-sm text-slate-500'>
              <img src={dtiLogo} alt='' srcset='' />
            </div>
          )}
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
            <span className='text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full'>
              View Fullscreen
            </span>
          </div>
        </div>

        <div className='flex flex-col grow px-6'>
          {/* <span className='text-blue-500 font-bold text-xs mb-1 uppercase tracking-wider'>
            {event.category}
          </span> */}
          <h4 className='text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-tight'>
            {event.title}
          </h4>
          <p className='text-gray-500 text-sm mb-4 line-clamp-3 grow'>
            {event.description}
          </p>

          <div className='flex flex-col gap-2 text-xs font-medium text-gray-500 mb-6'>
            <div className='flex items-start gap-2'>
              <CalendarCheck className='h-4 w-4 shrink-0 mt-0.5' />
              <span className='line-clamp-2'>
                Start: {formatDate(event.startDate)} |{' '}
                {formatTime(event.event_start_time) || '12:00 AM'}
              </span>
            </div>
            <div className='flex items-start gap-2'>
              <CalendarX className='h-4 w-4 shrink-0 mt-0.5' />
              <span className='line-clamp-2'>
                End: {formatDate(event.endDate)} |{' '}
                {formatTime(event.event_end_time) || '12:00 AM'}
              </span>
            </div>
            <div className='flex items-start gap-2'>
              <MapPin className='h-4 w-4 shrink-0 mt-0.5' />
              <span className='line-clamp-2'>{event.location}</span>
            </div>
          </div>

          <div className='flex flex-col gap-3 mt-auto'>
            <Button
              onClick={() => navigate('/event/register', { state: { event } })}
              className='rounded-full px-8 gap-2 to-blue-500 bg-linear-to-r from-blue-600 hover:from-blue-700 hover:to-blue-600 text-white'
            >
              {event.buttonText || 'Register'}
            </Button>
            <Button
              variant='outline'
              onClick={() =>
                navigate(`/event/${event.id}`, { state: { event } })
              }
              className='rounded-full w-full justify-center px-6'
            >
              Full Details
            </Button>
          </div>
        </div>
      </div>
      {isImageOpen && (
        <ImageModal
          src={event.image || dtiLogo}
          alt={event.title}
          onClose={() => setIsImageOpen(false)}
        />
      )}
    </>
  );
};

export default EventCard;
