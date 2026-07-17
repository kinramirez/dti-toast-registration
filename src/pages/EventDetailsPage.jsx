import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Star, ArrowRight, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { normalizeEvent } from '@/lib/utils/eventUtils';
import { getEventById } from '@/api/events';
import dtiLogo from '@/assets/dtilogo.png';
import ImageModal from '@/components/ui/ImageModal';
import ShareModal from '@/components/ui/ShareModal';
import Toast from '@/components/ui/Toast';
import EventOverviewCard from '@/features/events/components/EventOverviewCard';
import WhatToExpect from '@/features/events/components/WhatToExpect';
import VenueSection from '@/features/events/components/VenueSection';
import CtaBanner from '@/features/events/components/CtaBanner';
import ContactStrip from '@/features/events/components/ContactStrip';

const EventDetailsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [fetchedEvent, setFetchedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const shareButtonRef = useRef(null);

  // Path A: event from navigation state (instant)
  const stateEvent = useMemo(() => {
    const se = location.state?.event;
    return se ? normalizeEvent(se) : null;
  }, [location.state]);

  // Path B: fetch by ID if no state (direct URL / bookmark / refresh)
  useEffect(() => {
    if (stateEvent || !id) return;

    let cancelled = false;
    setIsLoading(true);
    setFetchError(null);

    getEventById(id)
      .then((ev) => {
        if (!cancelled) {
          setFetchedEvent(normalizeEvent(ev));
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setFetchError(
            err?.response?.data?.message ||
              err?.message ||
              'Failed to load event details.',
          );
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [id, stateEvent]);

  const event = stateEvent || fetchedEvent;

  const handleRegister = () => {
    if (event) {
      navigate(`/event/${event.id}/register`, { state: { event } });
    }
  };

  const handleToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
  };

  const handleShare = async () => {
    const shareData = {
      title: event?.title || 'Toast Wedding Fair',
      text: event?.description || 'Check out this wedding fair!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err?.name === 'AbortError') {
          // User cancelled — silently ignore
          return;
        }
        // NotAllowedError, DataError, or other — fall back to clipboard
        try {
          await navigator.clipboard.writeText(window.location.href);
          setToastMessage('Link copied to clipboard!');
          setToastVisible(true);
        } catch {
          setToastMessage('Failed to copy link');
          setToastVisible(true);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setToastMessage('Link copied to clipboard!');
        setToastVisible(true);
      } catch {
        setToastMessage('Failed to copy link');
        setToastVisible(true);
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="w-8 h-8 rounded-full border-4 border-[rgba(197,95,97,0.2)] border-t-[#C55F61] animate-spin mb-4" />
          <p className="text-[#737373] text-sm font-satoshi">
            Loading event…
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center py-32 text-center px-4">
          <h3 className="text-3xl font-bold text-[#5D5D5D] mb-4 font-satoshi">
            Something Went Wrong
          </h3>
          <p className="text-[#737373] max-w-lg text-sm leading-relaxed font-satoshi mb-6">
            {fetchError}
          </p>
          <button
            onClick={() => {
              setFetchError(null);
              setIsLoading(true);
              getEventById(id)
                .then((ev) => {
                  setFetchedEvent(ev);
                  setIsLoading(false);
                })
                .catch((err) => {
                  setFetchError(
                    err?.response?.data?.message ||
                      err?.message ||
                      'Failed to load event details.',
                  );
                  setIsLoading(false);
                });
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
            style={{
              background:
                'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // Not found state
  if (!event) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <div className="mt-10 rounded-2xl border bg-white p-8 text-center shadow-sm mx-4">
          <h3 className="text-xl font-semibold text-[#434343] mb-2 font-satoshi">
            Event not found
          </h3>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-satoshi font-medium text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
            style={{
              background:
                'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            Go back
          </button>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-white">
      {/* ============================================
          HERO SECTION
          Two-column: text left + full-bleed image right
          ============================================ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            'linear-gradient(180.87deg, #FFF6F3 0%, transparent 100%)',
        }}
      >
        <div className="max-w-container mx-auto px-8 max-sm:px-6">
          {/* Breadcrumb — above image on mobile */}
          <div className="lg:hidden pt-4">
            <Link
              to="/"
              className="inline-flex items-center text-[#737373] hover:text-[#C55F61] transition-colors font-satoshi font-bold text-base leading-[22px]"
            >
              ‹ Event Details
            </Link>
          </div>

          <div className="grid lg:grid-cols-[1fr_minmax(0,864px)] items-center min-h-[500px] lg:min-h-[600px]">
            {/* MOBILE-ONLY Hero Image (above text) */}
            <div className="block lg:hidden w-full">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsImageOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsImageOpen(true);
                  }
                }}
                className="relative w-full h-[250px] sm:h-[350px] cursor-pointer overflow-hidden"
              >
                <img
                  src={event.image || dtiLogo}
                  alt={event.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = dtiLogo;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* LEFT — Text Column */}
            <div className="relative z-20 py-8 lg:py-16 space-y-4 lg:space-y-6">
              {/* Breadcrumb (desktop only — mobile breadcrumb is above the image) */}
              <div className="hidden lg:block">
                <Link
                  to="/"
                  className="inline-flex items-center text-[#737373] hover:text-[#C55F61] transition-colors font-satoshi font-bold text-base leading-[22px]"
                >
                  ‹ Event Details
                </Link>
              </div>

              {/* Featured Badge */}
              {event.isFeatured && (
                <div
                  className="inline-flex items-center gap-1.5 bg-[#C55F61] text-white px-3 py-1.5 rounded text-xs font-bold font-satoshi"
                  style={{
                    boxShadow: '0px 4px 4px rgba(197, 95, 97, 0.15)',
                  }}
                >
                  <Star className="w-3.5 h-3.5 fill-[#FFB24E] text-[#FFB24E]" />
                  FEATURED EVENT
                </div>
              )}

              {/* Title */}
              <h1 className="font-cormorant font-bold text-[32px] sm:text-[40px] lg:text-[64px] leading-[1.2] lg:leading-[78px] text-[#121212]">
                {event.title}
              </h1>

              {/* Script Tagline */}
              <p className="font-corinthia text-[48px] sm:text-[64px] md:text-[80px] lg:text-[96px] leading-[1.2] lg:leading-[115px] text-[#C55F61]">
                {event?.tagline}
              </p>

              {/* Description */}
              <p
                className={`font-satoshi font-medium text-sm md:text-base leading-[20px] md:leading-[22px] text-[#606060] max-w-[635px] ${
                  !isDescExpanded ? 'line-clamp-2' : ''
                } md:line-clamp-none`}
              >
                {event.description}
              </p>

              {/* Read more / Show less toggle — mobile only */}
              <button
                onClick={() => setIsDescExpanded((prev) => !prev)}
                className="md:hidden inline-flex items-center gap-1 text-[#C55F61] font-satoshi font-bold text-sm hover:opacity-80 transition-opacity"
              >
                {isDescExpanded ? (
                  <>
                    Show less <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* CTA Row */}
              <div className="flex flex-wrap items-center gap-6">
                <button
                  onClick={handleRegister}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-white font-satoshi font-bold text-base leading-[22px] transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#C55F61]"
                  style={{
                    background:
                      'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                    e.currentTarget.style.boxShadow =
                      '0px 4px 12px rgba(197, 95, 97, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Register Now
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Share Event */}
                <button
                  ref={shareButtonRef}
                  onClick={() => setIsShareOpen(true)}
                  className="inline-flex items-center gap-2 text-[#C55F61] font-satoshi font-bold text-base leading-[22px] hover:opacity-80 transition-opacity"
                >
                  <Share2 className="w-4 h-4" />
                  Share Event
                </button>
              </div>
            </div>

            {/* RIGHT — Hero Image (full bleed to right edge, desktop only) */}
            <div className="hidden lg:block relative lg:absolute lg:right-0 lg:top-0 lg:h-full">
              <div
                onClick={() => setIsImageOpen(true)}
                className="relative w-full lg:w-[864px] h-[300px] sm:h-[400px] lg:h-full cursor-pointer group overflow-hidden"
              >
                <img
                  src={event.image || dtiLogo}
                  alt={event.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = dtiLogo;
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                {/* Blush gradient scrim on left edge of image for text legibility */}
                <div
                  className="absolute inset-y-0 left-0 w-32 lg:w-48 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(90deg, #FFF6F3 0%, transparent 100%)',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          OVERVIEW CARD (floating over hero bottom)
          ============================================ */}
      <div className="relative -mt-12 lg:-mt-16 z-10 px-8 max-sm:px-6 pb-8">
        <EventOverviewCard event={event} />
      </div>

      {/* ============================================
          WHAT TO EXPECT
          ============================================ */}
      <WhatToExpect event={event} />

      {/* ============================================
          VENUE SECTION
          ============================================ */}
      <VenueSection event={event} />

      {/* ============================================
          MID-PAGE CTA BANNER
          ============================================ */}
      <CtaBanner event={event} />

      {/* ============================================
          CONTACT STRIP
          ============================================ */}
      <ContactStrip />

      {/* ============================================
          IMAGE MODAL (conditional)
          ============================================ */}
      {isImageOpen && (
        <ImageModal
          src={event?.image || dtiLogo}
          alt={event?.title}
          onClose={() => setIsImageOpen(false)}
        />
      )}

      {/* Share Modal (conditional) */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        event={event}
        onToast={handleToast}
        triggerRef={shareButtonRef}
      />

      {/* Toast notification for share fallback */}
      <Toast
        message={toastMessage}
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default EventDetailsPage;
