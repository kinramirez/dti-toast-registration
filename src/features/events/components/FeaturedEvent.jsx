import React, { useState } from 'react';
import { CalendarCheck, CalendarX, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageModal from '@/components/ui/ImageModal';
import { useNavigate } from 'react-router-dom';
import dtiLogo from '@/assets/dtilogo.png';
import { formatDate, formatTime } from '@/lib/utils/eventUtils';

const FeaturedEvent = ({ event, events = [] }) => {
  const navigate = useNavigate();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsImageOpen(true);
  };

  const handleNavigate = () => {
    if (event?.image) {
      const img = new Image();
      img.src = event.image;
    }
    navigate(`/event/${event.id}`, { state: { event } });
  };

  const handleRegister = () => {
    if (event?.image) {
      const img = new Image();
      img.src = event.image;
    }
    navigate('/event/register', { state: { event } });
  };

  if (!event) {
    return (
      <div className='mb-16 rounded-3xl border border-slate-200 bg-white px-8 py-12 text-center'>
        <h3 className='text-xl font-bold text-blue-600 mb-4'>FEATURED EVENT</h3>
        <p className='text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed'>
          There are no current events in your area right now. Please check again
          later for new event listings.
        </p>
      </div>
    );
  }

  return (
    <div className='mb-16'>
      <h3 className='text-xl font-bold text-blue-600 mb-6'>FEATURED EVENT</h3>
      <div className='flex flex-col md:flex-row gap-8'>
        <div
          className='w-full md:w-1/3 bg-slate-100 h-64 sm:h-90 md:h-[400px] overflow-hidden rounded-xl cursor-pointer group relative'
          onClick={() => openImage(event.image)}
        >
          <img
            src={event.image || dtiLogo}
            alt={event.title || 'Event image'}
            loading='lazy'
            decoding='async'
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = dtiLogo;
            }}
            className='w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90'
          />
          <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
            <span className='text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full'>
              View Fullscreen
            </span>
          </div>
        </div>

        <div className='w-full md:w-2/3 flex flex-col justify-center'>
          {/* <span className='text-blue-500 font-bold text-sm mb-2'>
            {event.category}
          </span> */}
          <h4 className='text-2xl font-bold text-gray-900 mb-4'>
            {event.title}
          </h4>
          <p className='text-gray-600 text-sm mb-6 leading-relaxed'>
            {event.description}
          </p>

          <div className='flex flex-col gap-3 text-sm font-medium text-gray-800 mb-8'>
            <div className='flex items-center gap-3'>
              <CalendarCheck className='h-5 w-5 text-gray-600' />
              Start: {formatDate(event.startDate)} |{' '}
              {formatTime(event.event_start_time) || '12:00 AM'}
            </div>
            <div className='flex items-center gap-3'>
              <CalendarX className='h-5 w-5 text-gray-600' />
              End: {formatDate(event.endDate)} |{' '}
              {formatTime(event.event_end_time) || '12:00 AM'}
            </div>
            <div className='flex items-center gap-3'>
              <MapPin className='h-5 w-5 text-gray-600' />
              {event.location}
            </div>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            <Button
              onClick={handleRegister}
              className='rounded-full px-8 gap-2 to-blue-500 bg-linear-to-r from-blue-600 hover:from-blue-700 hover:to-blue-600 text-white'
            >
              Register <ArrowRight className='h-4 w-4' />
            </Button>

            <Button
              variant='outline'
              onClick={handleNavigate}
              className='rounded-full w-40 justify-between px-6'
            >
              Full Details <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      {events && events.length > 0 && (
        <div className='mt-12'>
          <h3 className='text-xl font-bold text-blue-600 mb-6'>
            UPCOMING EVENTS
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {events.slice(0, 3).map((upEvent) => (
              <div
                key={upEvent.id}
                className='border rounded-xl overflow-hidden bg-white group'
              >
                <div
                  className='h-48 overflow-hidden relative cursor-pointer group'
                  onClick={() => openImage(upEvent.image)}
                >
                  <img
                    src={upEvent.image || dtiLogo}
                    alt={upEvent.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                  />
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
                    <span className='text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full'>
                      View Fullscreen
                    </span>
                  </div>
                </div>
                <div className='p-4'>
                  <h5 className='font-bold text-gray-900 mb-2 line-clamp-1'>
                    {upEvent.title}
                  </h5>
                  <p className='text-gray-600 text-sm line-clamp-2 mb-4'>
                    {upEvent.description}
                  </p>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full rounded-full'
                    onClick={() =>
                      navigate(`/event/${upEvent.id}`, {
                        state: { event: upEvent },
                      })
                    }
                  >
                    Details <ArrowRight className='h-3 w-3 ml-2' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isImageOpen && (
        <ImageModal
          src={selectedImage || dtiLogo}
          alt={event?.title}
          onClose={() => {
            setIsImageOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </div>
  );
};

export default FeaturedEvent;
