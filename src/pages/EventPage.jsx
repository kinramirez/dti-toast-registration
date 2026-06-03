import React, { useState, useMemo, useEffect } from 'react';
import { getEvents } from '@/api/events';
import { normalizeEvent } from '@/lib/utils/eventUtils';
import EventControls from '@/features/events/components/EventControls';
import MonthTabs from '@/features/events/components/MonthTabs';
import FeaturedEvent from '@/features/events/components/FeaturedEvent';
import EventCard from '@/features/events/components/EventCard';
import EventPagination from '@/features/events/components/EventPagination';

const Events = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [viewMode, setViewMode] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  useEffect(() => {
    async function loadEvents() {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const [year, month] = selectedMonth.split('-').map(Number);
        const data = await getEvents({
          page: currentPage,
          limit: 10,
          month,
          year,
        });
        setEvents(data.events.map(normalizeEvent));
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
      } catch (error) {
        console.error('Failed to load events:', error);
        setEventsError('Unable to load events. Please try again later.');
      } finally {
        setEventsLoading(false);
      }
    }

    loadEvents();
  }, [selectedMonth, currentPage]);

  const handleMonthChange = (newMonth) => {
    setSelectedMonth(newMonth);
    setCurrentPage(1);
  };

  const filteredEvents = useMemo(() => {
    return events;
  }, [events]);

  const featuredEvent =
    filteredEvents.find((e) => e.isFeatured) || filteredEvents[0];
  const upcomingEvents = filteredEvents.filter(
    (e) => e.id !== featuredEvent?.id,
  );

  return (
    <section className='bg-white min-h-screen -mt-10 relative z-10 animate-page-in'>
      <div className='max-w-6xl mx-auto px-8 max-sm:px-6 py-10'>
        <EventControls viewMode={viewMode} onViewModeChange={setViewMode} />

        <MonthTabs
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />

        {eventsLoading ? (
          <div className='flex flex-col items-center justify-center py-32 text-center'>
            <div className='w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mb-4' />
            <p className='text-gray-400 text-sm'>Loading events…</p>
          </div>
        ) : eventsError ? (
          <div className='flex flex-col items-center justify-center py-32 text-center'>
            <h3 className='text-3xl font-bold text-gray-500 mb-4'>
              No Events Found
            </h3>
            <p className='text-gray-400 max-w-lg text-sm leading-relaxed'>
              {eventsError}
            </p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-32 text-center'>
            <h3 className='text-3xl font-bold text-gray-400 mb-4'>
              No Events This Month
            </h3>
            <p className='text-gray-400 max-w-lg text-sm leading-relaxed'>
              No events are available for this month.
            </p>
          </div>
        ) : (
          <>
            {currentPage === 1 && <FeaturedEvent event={featuredEvent} />}
            <div className='animate-fade-in-up delay-100'>
              <h3 className='text-xl font-bold text-blue-600 mb-6'>
                UPCOMING EVENTS
              </h3>
              <div
                className={
                  viewMode === 'list'
                    ? 'flex flex-col gap-8'
                    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                }
              >
                {upcomingEvents.map((event, index) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    viewMode={viewMode}
                    className='animate-fade-in-up'
                    style={{ animationDelay: `${index * 80}ms` }}
                  />
                ))}
              </div>
            </div>
            <EventPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default Events;
