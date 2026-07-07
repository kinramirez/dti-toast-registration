import React, { useState, useEffect, useMemo } from 'react';
import { getEvents } from '@/api/events';
import { normalizeEvent, isEventUpcoming } from '@/lib/utils/eventUtils';
import HeroSection from '@/features/events/components/HeroSection';
import SearchBar from '@/features/events/components/SearchBar';
import FeaturedEvent from '@/features/events/components/FeaturedEvent';
import EventCard from '@/features/events/components/EventCard';
import EventPagination from '@/features/events/components/EventPagination';
import NewsletterBand from '@/features/events/components/NewsletterBand';

const GRID_PAGE_SIZE = 8;

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [allEvents, setAllEvents] = useState([]); // raw normalized events from API
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // Mobile "Load More" state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(GRID_PAGE_SIZE);

  // Detect mobile via matchMedia
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Fetch all events once, then paginate client-side
  useEffect(() => {
    let cancelled = false;
    async function loadAllEvents() {
      setEventsLoading(true);
      setEventsError(null);
      try {
        const data = await getEvents({ limit: 100 });
        if (!cancelled) {
          setAllEvents(data.events.map(normalizeEvent));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load events:', error);
          setEventsError('Unable to load events. Please try again later.');
        }
      } finally {
        if (!cancelled) setEventsLoading(false);
      }
    }

    loadAllEvents();
    return () => { cancelled = true; };
  }, []);

  // Filter to upcoming events only, then derive featured + grid
  const { featuredEvent, gridEvents, totalPages } = useMemo(() => {
    const upcoming = allEvents.filter(isEventUpcoming);

    const featured =
      upcoming.find((e) => e.isFeatured) ||
      upcoming[0] ||
      null;

    const grid = upcoming.filter((e) => e.id !== featured?.id);

    return {
      featuredEvent: featured,
      gridEvents: grid,
      totalPages: Math.max(1, Math.ceil(grid.length / GRID_PAGE_SIZE)),
    };
  }, [allEvents]);

  // Slice grid for current page
  const currentPageGrid = useMemo(() => {
    if (isMobile) {
      return gridEvents.slice(0, mobileVisibleCount);
    }
    const start = (currentPage - 1) * GRID_PAGE_SIZE;
    return gridEvents.slice(start, start + GRID_PAGE_SIZE);
  }, [gridEvents, currentPage, isMobile, mobileVisibleCount]);

  const handleLoadMore = () => {
    setMobileVisibleCount((prev) => prev + GRID_PAGE_SIZE);
  };

  const isEmpty = !eventsLoading && !eventsError && gridEvents.length === 0;
  const hasMoreMobile = isMobile && mobileVisibleCount < gridEvents.length;

  return (
    <div className="bg-white min-h-screen animate-page-in">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Bar */}
      <SearchBar />

      {/* Main content area */}
      <div className="max-w-container mx-auto px-4 md:px-8 max-sm:px-6 py-[60px]">
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
            {/* Featured Event — always shown if exists */}
            {featuredEvent && (
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

              {isEmpty && currentPage === 1 ? (
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
                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-[16px] md:gap-x-[10px] gap-y-[34px]"
                  >
                    {currentPageGrid.map((event, index) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        className="animate-fade-in-up"
                        style={{ animationDelay: `${index * 80}ms` }}
                      />
                    ))}
                  </div>

                  {/* Pagination (desktop) or Load More (mobile) */}
                  {isMobile ? (
                    hasMoreMobile && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleLoadMore}
                          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
                          style={{
                            background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                            textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = '0.9';
                            e.currentTarget.style.boxShadow = '0px 4px 12px rgba(197, 95, 97, 0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = '1';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          Load More
                        </button>
                      </div>
                    )
                  ) : (
                    totalPages > 1 && (
                      <EventPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )
                  )}
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
