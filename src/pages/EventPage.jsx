import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getEvents } from '@/api/events';
import { normalizeEvent, isEventUpcoming, isEventInDateRange } from '@/lib/utils/eventUtils';
import HeroSection from '@/features/events/components/HeroSection';
import SearchBar from '@/features/events/components/SearchBar';
import FeaturedEvent from '@/features/events/components/FeaturedEvent';
import EventCard from '@/features/events/components/EventCard';
import EventPagination from '@/features/events/components/EventPagination';
import NewsletterBand from '@/features/events/components/NewsletterBand';

const GRID_PAGE_SIZE = 8;
const FULL_FETCH_LIMIT = 100;

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

  // Detect mobile via matchMedia — also reset pagination on breakpoint change
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const handler = (e) => {
      setIsMobile(e.matches);
      setCurrentPage(1);
      setMobilePage(1);
    };
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

  // Ref to track the previous values of fetch-relevant params.
  // Used to detect genuine changes vs. no-op re-renders (e.g., paging through
  // client-side-filtered results should not trigger a redundant server fetch).
  const prevFetchParamsRef = useRef({
    region: '',
    isMobile: false,
    refreshTrigger: 0,
    hasClientSide: false,
  });

  // Fetch events with server-side pagination by default.
  // When client-side filters are active (keyword or date range), we fetch all events
  // in one call (limit=FULL_FETCH_LIMIT) and paginate client-side via paginatedEvents.
  // Date filters are never sent to the server because the API only checks startDate,
  // which excludes multi-month events whose startDate is in the past but endDate is in the future.
  useEffect(() => {
    let cancelled = false;

    const hasClientSide = searchFilters.keyword || searchFilters.startDateFrom || searchFilters.startDateTo;
    // When client-side filters are active, bypass mobile Load More accumulation —
    // the full fetch already returns all events on page 1.
    const isLoadMore = isMobile && mobilePage > 1 && !hasClientSide;

    // Compare current fetch-relevant params against previous values.
    // This catches both genuine changes AND no-op object reference changes
    // (e.g., handleSearch called with the same filter values).
    const prev = prevFetchParamsRef.current;
    const fetchParamsChanged =
      prev.region !== searchFilters.region ||
      prev.isMobile !== isMobile ||
      prev.refreshTrigger !== refreshTrigger ||
      prev.hasClientSide !== hasClientSide;

    // If nothing that matters for the server query changed, and we're in
    // client-side mode, skip the fetch. The data is already in `events` state.
    if (!fetchParamsChanged && hasClientSide) {
      // Ensure loading is false (may have been set by a previous effect cleanup)
      setEventsLoading(false);
      return;
    }

    // Update the ref for next comparison
    prevFetchParamsRef.current = {
      region: searchFilters.region,
      isMobile,
      refreshTrigger,
      hasClientSide,
    };

    async function loadEvents() {
      // Only show full-page spinner on initial load or desktop page change, not on mobile Load More
      if (!isLoadMore) {
        setEventsLoading(true);
      }
      setEventsError(null);
      try {
        // When client-side filters are active, fetch all events in one call (page=1, limit=FULL_FETCH_LIMIT).
        // Otherwise, use normal server-side pagination (page=N, limit=GRID_PAGE_SIZE+1).
        const page = hasClientSide ? 1 : (isMobile ? mobilePage : currentPage);
        const params = {
          page,
          limit: hasClientSide ? FULL_FETCH_LIMIT : GRID_PAGE_SIZE + 1,
        };

        // Add search filters if present (date filters are applied client-side — see dateFilteredEvents)
        if (searchFilters.region) params.region = searchFilters.region;

        const data = await getEvents(params);

        if (!cancelled) {
          const rawEvents = data.events || [];
          const normalized = rawEvents.map(normalizeEvent);
          // Determine whether to apply the upcoming-only filter.
          // When the user has applied date filters, bypass isEventUpcoming so they can
          // search the full event directory (including past events) within their chosen range.
          const hasDateFilter = searchFilters.startDateFrom || searchFilters.startDateTo;
          const filtered = hasDateFilter
            ? normalized
            : normalized.filter(isEventUpcoming);
          // Mobile Load More: accumulate events; Desktop/initial: replace
          if (isLoadMore) {
            setEvents((prev) => [...prev, ...filtered]);
          } else {
            setEvents(filtered);
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
  }, [currentPage, mobilePage, searchFilters.region, searchFilters.keyword, searchFilters.startDateFrom, searchFilters.startDateTo, refreshTrigger, isMobile]);

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
  const hasActiveFilters = searchFilters.region || searchFilters.startDateFrom || searchFilters.startDateTo || searchFilters.keyword;

  // Client-side-only filters (keyword and date range) require a full fetch because
  // the API does not support keyword search and date filters are applied client-side.
  // Region is excluded — it is sent to the API and filtered server-side.
  const hasClientSideFilters = useMemo(
    () => searchFilters.keyword || searchFilters.startDateFrom || searchFilters.startDateTo,
    [searchFilters.keyword, searchFilters.startDateFrom, searchFilters.startDateTo],
  );

  // Grid events: filter out featured from current page events
  // Skip dedup when filters are active — the featured event was fetched without filters
  // and may be the only matching result in the filtered grid
  const gridEvents = useMemo(() => {
    if (!featuredEvent || hasActiveFilters) return events;
    return events.filter((e) => e.id !== featuredEvent.id);
  }, [events, featuredEvent, hasActiveFilters]);

  // Client-side keyword filter over grid events
  const keywordFilteredEvents = useMemo(() => {
    if (!searchFilters.keyword) return gridEvents;
    const kw = searchFilters.keyword.toLowerCase();
    return gridEvents.filter(
      (e) =>
        e.title?.toLowerCase().includes(kw) ||
        e.description?.toLowerCase().includes(kw) ||
        e.location?.toLowerCase().includes(kw),
    );
  }, [gridEvents, searchFilters.keyword]);

  // Client-side date-range filter over keyword-filtered events
  // Uses isEventInDateRange() to correctly handle multi-month events whose
  // startDate may be before the filter window but whose endDate is within it.
  const dateFilteredEvents = useMemo(() => {
    if (!searchFilters.startDateFrom && !searchFilters.startDateTo) return keywordFilteredEvents;
    return keywordFilteredEvents.filter((event) =>
      isEventInDateRange(event, searchFilters.startDateFrom, searchFilters.startDateTo),
    );
  }, [keywordFilteredEvents, searchFilters.startDateFrom, searchFilters.startDateTo]);

  // Effective total pages: when client-side filters are active, compute from the
  // filtered array length (client-side pagination); otherwise use the API's totalPages.
  const displayTotalPages = useMemo(() => {
    if (hasClientSideFilters) {
      return Math.max(1, Math.ceil(dateFilteredEvents.length / GRID_PAGE_SIZE));
    }
    return apiTotalPages;
  }, [hasClientSideFilters, dateFilteredEvents.length, apiTotalPages]);

  // Final paginated slice for rendering.
  // When client-side filters are active, slice the full filtered array for the current page.
  // Otherwise, dateFilteredEvents already contains exactly one page from the API.
  const paginatedEvents = useMemo(() => {
    if (!hasClientSideFilters) {
      return dateFilteredEvents;
    }
    if (isMobile) {
      // Mobile: accumulate — show events 0 through mobilePage * GRID_PAGE_SIZE.
      // This mirrors the server-side accumulation pattern (isLoadMore → [...prev, ...filtered])
      // but operates on the already-fetched dateFilteredEvents array.
      return dateFilteredEvents.slice(0, mobilePage * GRID_PAGE_SIZE);
    }
    // Desktop: show one page at a time
    const startIndex = (currentPage - 1) * GRID_PAGE_SIZE;
    return dateFilteredEvents.slice(startIndex, startIndex + GRID_PAGE_SIZE);
  }, [hasClientSideFilters, dateFilteredEvents, currentPage, mobilePage, isMobile]);

  const isEmpty = !eventsLoading && !eventsError && paginatedEvents.length === 0 && currentPage === 1 && mobilePage === 1;
  const hasMoreMobile = isMobile && mobilePage < displayTotalPages;


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
              // Determine if featured event should be shown — validate against ALL active filters
              const showFeatured = (() => {
                if (!featuredEvent || featuredLoading) return false;
                if (!hasActiveFilters) return true;

                // Check date range overlap (not just startDate) — correctly handles
                // multi-month events whose startDate is before the filter but endDate is within it
                if (searchFilters.startDateFrom || searchFilters.startDateTo) {
                  if (!isEventInDateRange(featuredEvent, searchFilters.startDateFrom, searchFilters.startDateTo)) return false;
                }
                // Check region: case-insensitive substring match on rawRegion
                if (searchFilters.region) {
                  const featRegion = (featuredEvent.rawRegion || '').toLowerCase();
                  const filterRegion = searchFilters.region.toLowerCase();
                  if (!featRegion.includes(filterRegion)) return false;
                }
                // Check keyword: case-insensitive match on title
                if (searchFilters.keyword) {
                  const kw = searchFilters.keyword.toLowerCase();
                  if (!(featuredEvent.title || '').toLowerCase().includes(kw)) return false;
                }
                return true;
              })();

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
                    {paginatedEvents.map((event, index) => (
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
                    displayTotalPages > 1 && (
                      <EventPagination
                        currentPage={currentPage}
                        totalPages={displayTotalPages}
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
