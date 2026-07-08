import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
  const [events, setEvents] = useState([]); // single page of results
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Search filters state
  const [searchFilters, setSearchFilters] = useState({
    keyword: '',
    region: '',
    startDateFrom: '',
    startDateTo: '',
  });

  // Featured event from dedicated API call
  const [featuredEvent, setFeaturedEvent] = useState(null);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // API-derived total pages
  const [apiTotalPages, setApiTotalPages] = useState(1);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePage, setMobilePage] = useState(1);

  // Detect mobile via matchMedia
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Fetch featured event — fetch all events without date filter, then find featured client-side
  // This avoids the startDateFrom issue where a featured multi-month event
  // (startDate in past, endDate in future) would be excluded by the server.
  useEffect(() => {
    let cancelled = false;
    async function loadFeatured() {
      setFeaturedLoading(true);
      try {
        // Fetch all events (no startDateFrom) to find the featured one
        const data = await getEvents({ limit: 100 });
        if (!cancelled) {
          const rawEvents = data.events || [];
          const normalized = rawEvents.map(normalizeEvent);
          // Filter upcoming, then find featured (or first upcoming as fallback)
          const upcoming = normalized.filter(isEventUpcoming);
          const featured = upcoming.find((e) => e.isFeatured) || upcoming[0] || null;
          setFeaturedEvent(featured);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to load featured event:', error);
          setFeaturedEvent(null);
        }
      } finally {
        if (!cancelled) setFeaturedLoading(false);
      }
    }
    loadFeatured();
    return () => { cancelled = true; };
  }, [refreshTrigger]);

  // Fetch events page (server-side pagination)
  // NOTE: We do NOT pass startDateFrom to the server because the API filters by startDate,
  // which excludes multi-month events whose startDate is in the past but endDate is in the future.
  // Instead, we filter client-side with isEventUpcoming() which checks endDate.
  useEffect(() => {
    let cancelled = false;
    const isLoadMore = isMobile && mobilePage > 1;

    async function loadEvents() {
      // Only show full-page spinner on initial load or desktop page change, not on mobile Load More
      if (!isLoadMore) {
        setEventsLoading(true);
      }
      setEventsError(null);
      try {
        const page = isMobile ? mobilePage : currentPage;
        // Fetch +1 extra to account for the featured event being removed from the grid
        const params = {
          page,
          limit: GRID_PAGE_SIZE + 1,
        };

        // Add search filters if present (user-initiated date filters still passed through)
        if (searchFilters.region) params.region = searchFilters.region;
        if (searchFilters.startDateFrom) params.startDateFrom = searchFilters.startDateFrom;
        if (searchFilters.startDateTo) params.startDateTo = searchFilters.startDateTo;

        const data = await getEvents(params);

        if (!cancelled) {
          const rawEvents = data.events || [];
          const normalized = rawEvents.map(normalizeEvent);
          // Filter upcoming client-side — correctly handles multi-month events
          // (events with startDate in the past but endDate in the future)
          const upcoming = normalized.filter(isEventUpcoming);
          // Mobile Load More: accumulate events; Desktop/initial: replace
          if (isLoadMore) {
            setEvents((prev) => [...prev, ...upcoming]);
          } else {
            setEvents(upcoming);
          }
          setApiTotalPages(data.totalPages || 1);
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

    loadEvents();
    return () => { cancelled = true; };
  }, [currentPage, mobilePage, searchFilters, refreshTrigger, isMobile]);

  // Handle search from SearchBar
  const handleSearch = useCallback((filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    setMobilePage(1);
  }, []);

  // Handle page change (desktop pagination only — mobile uses handleLoadMore)
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Mobile "Load More" increments mobilePage
  const handleLoadMore = () => {
    setMobilePage((prev) => prev + 1);
  };

  // Check if any search filter is active
  const hasActiveFilters = searchFilters.region || searchFilters.startDateFrom || searchFilters.startDateTo;

  // Grid events: filter out featured from current page events
  // Skip dedup when filters are active — the featured event was fetched without filters
  // and may be the only matching result in the filtered grid
  const gridEvents = useMemo(() => {
    if (!featuredEvent || hasActiveFilters) return events;
    return events.filter((e) => e.id !== featuredEvent.id);
  }, [events, featuredEvent, hasActiveFilters]);

  const isEmpty = !eventsLoading && !eventsError && gridEvents.length === 0 && currentPage === 1 && mobilePage === 1;
  const hasMoreMobile = isMobile && mobilePage < apiTotalPages;


  return (
    <div className="bg-white min-h-screen animate-page-in">
      {/* Hero Section */}
      <HeroSection />

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Main content area */}
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8 py-[60px]">
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
              onClick={() => setRefreshTrigger((n) => n + 1)}
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
            {/* Featured Event — with fallback when no featured event exists
                or when the featured event doesn't match the active date filter */}
            {(() => {
              // Determine if featured event should be shown
              const showFeatured =
                featuredEvent &&
                !featuredLoading &&
                (!hasActiveFilters ||
                  !searchFilters.startDateFrom ||
                  new Date(featuredEvent.startDate) >= new Date(searchFilters.startDateFrom));

              if (showFeatured) {
                return <FeaturedEvent event={featuredEvent} />;
              }

              // Fallback: left-aligned section heading + centered empty state
              return (
                <div className="animate-fade-in-up">
                  <h2 className="text-xl font-bold text-[#121212] mb-6 font-satoshi uppercase tracking-wider text-left">
                    FEATURED EVENTS
                  </h2>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <h3 className="text-2xl font-bold text-[#5D5D5D] mb-3 font-satoshi">
                      No Featured Events Available
                    </h3>
                    <p className="text-sm text-[#ACACAC] max-w-md leading-relaxed font-satoshi">
                      No featured events at this time. Check back soon!
                    </p>
                  </div>
                </div>
              );
            })()}

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
                    className="grid grid-cols-2 lg:grid-cols-4 gap-x-[16px] md:gap-x-[10px] gap-y-[34px]"
                  >
                    {gridEvents.map((event, index) => (
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
                    apiTotalPages > 1 && (
                      <EventPagination
                        currentPage={currentPage}
                        totalPages={apiTotalPages}
                        onPageChange={handlePageChange}
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
