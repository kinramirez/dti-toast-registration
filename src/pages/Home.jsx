import { useState, useEffect, useMemo } from 'react';
import { getEvents } from '@/api/events';
import { normalizeEvent } from '@/lib/utils/eventUtils';
import AboutSection from './sections/AboutSection';
import WhatWeOffer from './sections/WhatWeOffer';
import ProcessSection from './sections/ProcessSection';
import FeaturedEvent from './sections/FeaturedEvent';
import FaqsSection from './sections/FaqsSection';
import CtaBanner from './sections/CtaBanner';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      try {
        const data = await getEvents({ limit: 100 });
        setEvents(data.events.map(normalizeEvent));
      } catch (error) {
        console.error('Failed to load events:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => {
    return events;
  }, [events]);

  const featuredEvent =
    filteredEvents.length > 0
      ? filteredEvents.find((e) => e.isFeatured) || filteredEvents[0]
      : null;
  const upcomingEvents = featuredEvent
    ? filteredEvents.filter((e) => e.id !== featuredEvent.id)
    : [];
  const isDeterminingLocation = loading;
  const isNoLocalEvents = !isDeterminingLocation && filteredEvents.length === 0;

  return (
    <div className='min-h-screen bg-brand-dark'>
      <AboutSection />
      <section id='what-we-offer'>
        <WhatWeOffer />
      </section>
      <section id='process-section'>
        <ProcessSection />
      </section>
      <section id='featured-event'>
        {isDeterminingLocation ? (
          <div className='mb-16 rounded-3xl border border-slate-200 px-8 py-12 text-center mx-4 my-12 sm:mx-0'>
            <p className='text-gray-600 max-w-2xl mx-auto text-base leading-relaxed'>
              Loading events... This may take a few seconds.
            </p>
          </div>
        ) : isNoLocalEvents ? (
          <FeaturedEvent event={null} />
        ) : (
          <FeaturedEvent event={featuredEvent} events={upcomingEvents} />
        )}
      </section>
      <section id='faqs-section'>
        <FaqsSection />
      </section>
      <section id='cta-banner'>
        <CtaBanner />
      </section>
    </div>
  );
}
