import React, { useState, useEffect } from 'react';
import { getEvents } from '@/api/events';
import { normalizeEvent, isEventUpcoming } from '@/lib/utils/eventUtils';
import HeroSection from '@/features/events/components/HeroSection';
import SearchBar from '@/features/events/components/SearchBar';
import FeaturedEvent from '@/features/events/components/FeaturedEvent';
import EventCard from '@/features/events/components/EventCard';
import EventPagination from '@/features/events/components/EventPagination';
import NewsletterBand from '@/features/events/components/NewsletterBand';

const Events = () => {
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
        const data = await getEvents({
          page: currentPage,
          limit: 8,
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
  }, [currentPage]);

  const featuredEvent =
    events.find((e) => e.isFeatured && isEventUpcoming(e)) ||
    events.find(isEventUpcoming) ||
    null;
  const upcomingEvents = events.filter(
    (e) => e.id !== featuredEvent?.id && isEventUpcoming(e),
  );

  const isEmpty = !eventsLoading && !eventsError && upcomingEvents.length === 0;

  return (
    <div className="bg-white min-h-screen animate-page-in">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Bar */}
      <SearchBar />

      {/* Main content area */}
      <div className="max-w-container mx-auto px-8 max-sm:px-6 py-[60px]">
        {eventsLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-8 h-8 rounded-full border-4 border-[rgba(197,95,97,0.2)] border-t-[#C55F61] animate-spin mb-4" />
            <p className="text-[#737373] text-sm font-satoshi">Loading events…</p>
          </div>
        ) : eventsError ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <h3 className="text-3xl font-bold text-[#5D5D5D] mb-4 font-satoshi">
              Something Went Wrong
            </h3>
            <p className="text-[#737373] max-w-lg text-sm leading-relaxed font-satoshi mb-6">
              {eventsError}
            </p>
            <button
              onClick={() => setCurrentPage((p) => p)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
              style={{
                background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
              }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Featured Event — only on page 1, always shown if exists */}
            {currentPage === 1 && featuredEvent && (
              <FeaturedEvent event={featuredEvent} />
            )}

            {/* Upcoming Wedding Fairs section */}
            <div className="animate-fade-in-up delay-100">
              <h2
                id="upcoming-fairs"
                className="text-xl font-bold text-[#121212] mb-6 font-satoshi uppercase tracking-wider"
              >
                UPCOMING WEDDING FAIRS
              </h2>

              {isEmpty ? (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <h3 className="text-2xl font-bold text-[#5D5D5D] mb-3 font-satoshi">
                    No Events Available at This Time
                  </h3>
                  <p className="text-sm text-[#ACACAC] max-w-md leading-relaxed font-satoshi">
                    There are currently no scheduled events. We'll announce new fairs soon.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[10px] gap-y-[34px]"
                  >
                    {upcomingEvents.map((event, index) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 80}ms` }}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  <EventPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Newsletter Band */}
      <NewsletterBand />
    </div>
  );
};

export default Events;
