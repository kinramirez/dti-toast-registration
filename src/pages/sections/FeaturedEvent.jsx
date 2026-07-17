import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import dtiLogo from '@/assets/dti_wedding_fair_logo_colored.svg';
import ImageModal from '@/components/ui/ImageModal';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const EventImage = ({ src, alt, className, onClick }) =>
  src ? (
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = dtiLogo;
      }}
      className={className}
      onClick={onClick}
    />
  ) : (
    <div className='flex h-full items-center justify-center' onClick={onClick}>
      <img
        src={dtiLogo}
        alt='DTI Logo'
        className='w-full h-full object-cover'
      />
    </div>
  );

export default function FeaturedEvent({ event, events = [] }) {
  const navigate = useNavigate();
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  console.log('Rendering FeaturedEvent with event:', event);

  const openImage = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsImageOpen(true);
  };

  return (
    <section className='py-24 px-8 bg-[#0f0f0f] text-white'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <motion.header
          className='mb-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: false, amount: 0.3 }}
        >
          <div className='flex flex-col'>
            <h3 className='text-gray-300 font-bold tracking-widest text-3xl uppercase'>
              HIGHLIGHTS
            </h3>
            <h2 className='text-[#1d76f2] text-6xl md:text-7xl lg:text-8xl font-black uppercase leading-none'>
              FEATURED EVENT
            </h2>
          </div>
          <Link
            to='/event#featured'
            className='bg-brand-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-full flex items-center shrink-0 mb-4 gap-2'
          >
            More Events <ArrowRight className='h-4 w-4' />
          </Link>
        </motion.header>
        {/* Featured Event Card */}
        {event ? (
          <motion.div
            className='mb-16'
            variants={fadeUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: false, amount: 0.2 }}
          >
            <h3 className='text-xl font-bold text-blue-600 mb-6'>
              FEATURED EVENT
            </h3>
            <div className='flex flex-col md:flex-row gap-8'>
              <div
                className='w-full h-64 sm:h-90 sm:w-1/3 md:h-[500px] md:w-1/3 overflow-hidden rounded-xl bg-white cursor-pointer group relative'
                onClick={() => openImage(event.image)}
              >
                <EventImage
                  src={event.image}
                  alt={event.title}
                  
                  className='w-full h-full object-cover group-hover:opacity-90 transition-opacity'
                />
                <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
                  <span className='text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full'>
                    View Fullscreen
                  </span>
                </div>
              </div>
              <div className='w-full md:w-2/3 flex flex-col justify-center'>
                <span className='text-blue-500 font-bold text-sm mb-2'>
                  {event.category}
                </span>
                <h4 className='text-2xl font-bold mb-4'>{event.title}</h4>
                <p className='text-gray-400 text-sm mb-6 leading-relaxed'>
                  {event.description}
                </p>
                <div className='flex flex-col gap-3 text-sm font-medium text-gray-300 mb-8'>
                  <div className='flex items-center gap-3'>
                    <Calendar className='h-5 w-5 text-gray-400' />
                    {event.displayDate}
                  </div>
                  <div className='flex items-center gap-3'>
                    <MapPin className='h-5 w-5 text-gray-400' />
                    {event.location}
                  </div>
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                  <button
                    onClick={() =>
                      navigate(`/event/${event.id}/register`, { state: { event } })
                    }
                    className='inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-full w-fit text-sm font-medium'
                  >
                    Register <ArrowRight className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/event/${event.id}`, { state: { event } })
                    }
                    className='inline-flex items-center gap-2 border border-white bg-white text-blue-600 px-8 py-2.5 rounded-full w-fit text-sm font-medium hover:bg-white hover:text-slate-900'
                  >
                    Full Details <ArrowRight className='h-4 w-4' />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className='mb-16 px-8 py-12 text-center text-black'>
            <p className='text-white font-bold tracking-widest text-2xl'>
              There are no current events in your area right now. Please check
              again later for new event listings.
            </p>
          </div>
        )}

        {/* Upcoming Events */}
        <motion.div
          variants={stagger}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: false, amount: 0.1 }}
        >
          <h3 className='text-xl font-bold text-blue-600 mb-6'>
            UPCOMING EVENTS
          </h3>
          <div className='flex flex-col gap-8'>
            {events.slice(0, 3).map((event) => (
              <motion.div
                key={event.id}
                className='flex flex-col md:flex-row gap-4 items-start'
                variants={cardVariant}
              >
                <div className='w-full md:w-52 h-64 shrink-0 overflow-hidden rounded-xl bg-white cursor-pointer group relative'>
                  <EventImage
                    src={event.image}
                    alt={event.title}
                    className='w-full h-full object-cover group-hover:opacity-90 transition-opacity'
                    onClick={() => openImage(event.image)}
                  />
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20'>
                    <span className='text-white text-[10px] font-bold bg-black/50 px-2 py-1 rounded-full'>
                      View
                    </span>
                  </div>
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='text-blue-500 text-xs font-bold uppercase tracking-widest mb-1'>
                    {event.category}
                  </p>
                  <h5 className='font-bold text-base mb-1'>{event.title}</h5>
                  <p className='text-gray-400 text-sm leading-relaxed line-clamp-3'>
                    {event.description}
                  </p>
                </div>
                <div className='flex flex-col items-center gap-3'>
                  <button
                    onClick={() =>
                      navigate(`/event/${event.id}/register`, { state: { event } })
                    }
                    className='inline-flex w-40 items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm'
                  >
                    Register <ArrowRight className='h-3 w-3' />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/event/${event.id}`, { state: { event } })
                    }
                    className='inline-flex w-40 items-center justify-center gap-2 border border-white bg-white text-blue-600 px-5 py-2 rounded-full text-sm hover:bg-white hover:text-slate-900'
                  >
                    Full Details <ArrowRight className='h-3 w-3' />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      {isImageOpen && (
        <ImageModal
          src={selectedImage}
          alt={event?.title}
          onClose={() => {
            setIsImageOpen(false);
            setSelectedImage(null);
          }}
        />
      )}
    </section>
  );
}
