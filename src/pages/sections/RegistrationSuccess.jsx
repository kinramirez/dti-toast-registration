import { useNavigate } from 'react-router-dom';
import {
  Mail,
  Calendar,
  Ticket,
  Heart,
  Clock,
  MapPin,
  Check,
  QrCode,
  Search,
  PartyPopper,
} from 'lucide-react';
import toastSuccessBg from '@/assets/toast-success-bg.png';
import Footer from '@/components/Footer';
import ContactStrip from '@/features/events/components/ContactStrip';
import { formatDate, formatTime } from '@/lib/utils/eventUtils';

/* ───────────────────────────────────────────
   Static data
   ─────────────────────────────────────────── */

const INFO_STRIP_ITEMS = [
  {
    icon: Mail,
    heading: 'CHECK YOUR EMAIL',
    body: "We've sent you a confirmation with your QR code and important details.",
  },
  {
    icon: Calendar,
    heading: 'SAVE THE DATE',
    body: "Add the event to your calendar so you won't miss out on amazing offers and activities.",
  },
  {
    icon: Ticket,
    heading: 'FREE ADMISSION',
    body: 'Your registration grants you free admission to the Toast Wedding Fair.',
  },
];

const TIMELINE_STEPS = [
  {
    icon: Mail,
    title: 'Confirm Your Email',
    body: 'Please check your inbox (and spam folder) for your registration confirmation email.',
  },
  {
    icon: QrCode,
    title: 'Get Your QR Code',
    body: 'Your QR code is in the email. Show it at the event entrance for quick and easy check-in.',
  },
  {
    icon: Search,
    title: 'Prepare & Plan',
    body: 'Explore the event details, exhibitors, and activities before you arrive.',
  },
  {
    icon: PartyPopper,
    title: 'Enjoy the Event!',
    body: 'Meet the best wedding suppliers, discover exclusive deals, and be inspired!',
  },
];

const REMINDERS = [
  'Registration is non-transferable.',
  'Bring a valid ID for verification.',
  'Save your QR code for easy entry.',
  'Free admission for pre-registered guests only.',
  'Schedules and event details are subject to change without prior notice.',
];

/* ───────────────────────────────────────────
   Sub-components (inline)
   ─────────────────────────────────────────── */

function SuccessHero({ userEmail }) {
  const emailText = userEmail
    ? `A confirmation email has been sent to ${userEmail}`
    : 'A confirmation email has been sent to your registered address.';

  return (
    <section
      aria-label="Registration success hero"
      className="relative w-full flex flex-col items-center justify-center text-center px-4"
      style={{
        height: '635px',
        backgroundImage: `url(${toastSuccessBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex flex-col items-center gap-4 max-w-[900px]">
        <span
          className="font-corinthia text-[96px] leading-[115px]"
          style={{ color: '#C55F61' }}
        >
          Thank you
        </span>
        <h1
          className="font-cormorant font-bold text-[48px] sm:text-[56px] md:text-[64px] leading-tight"
          style={{ color: '#121212' }}
        >
          Your Registration Was Successful
        </h1>
        <p
          className="font-satoshi font-medium text-[16px] sm:text-[18px] md:text-[20px] max-w-[700px]"
          style={{ color: '#606060' }}
        >
          We are excited to have you join us at Toast Wedding Fair.{' '}
          {emailText}
        </p>
      </div>
    </section>
  );
}

function FloatingInfoStrip() {
  return (
    <section aria-label="Next steps" className="w-full max-w-container mx-auto px-8 max-sm:px-6 -mt-12 relative z-10">
      <div
        className="bg-white rounded-lg p-8 sm:p-10 flex flex-col md:flex-row gap-8 md:gap-12"
        style={{ boxShadow: '0px 9px 4px 1px rgba(18, 18, 18, 0.05)' }}
      >
        {INFO_STRIP_ITEMS.map((item) => (
          <div key={item.heading} className="flex-1 flex flex-row items-start gap-4">
            {/* Icon circle */}
            <div
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'rgba(197, 95, 97, 0.15)' }}
              aria-hidden="true"
            >
              <item.icon size={24} color="#C55F61" />
            </div>
            {/* Text stack */}
            <div className="flex flex-col gap-1">
              <span className="font-satoshi font-bold text-[12px] uppercase" style={{ color: '#C55F61' }}>
                {item.heading}
              </span>
              <span className="font-satoshi font-medium text-[12px]" style={{ color: '#121212' }}>
                {item.body}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatsNextTimeline() {
  return (
    <section aria-label="What's next timeline" className="w-full max-w-container mx-auto px-8 max-sm:px-6 py-16">
      {/* Heading + divider */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <h2 className="font-cormorant font-bold text-[32px] text-center" style={{ color: '#121212' }}>
          What's Next?
        </h2>
        <div className="flex items-center gap-4 w-full max-w-[400px]">
          <div className="flex-1 border-t" style={{ borderColor: '#C55F61' }} />
          <Heart size={24} color="#C55F61" aria-hidden="true" />
          <div className="flex-1 border-t" style={{ borderColor: '#C55F61' }} />
        </div>
      </div>

      {/* Stepper (Icons, Lines, and Text in unified columns) */}
      <ol className="flex flex-col md:flex-row w-full gap-8 md:gap-0">
        {TIMELINE_STEPS.map((step, idx) => (
          <li key={step.title} className="flex flex-col items-center text-center flex-1 relative px-2">
            
            {/* Dashed connector to next icon (only on desktop) */}
            {idx < TIMELINE_STEPS.length - 1 && (
              <div
                className="hidden md:block absolute top-[26px] z-0"
                style={{
                  /* Starts at center + 32px (26px radius + 6px gap) */
                  left: 'calc(50% + 32px)',
                  /* Width spans exactly to the next center minus the gaps */
                  width: 'calc(100% - 64px)',
                  borderTop: '2px dashed #C55F61'
                }}
                aria-hidden="true"
              />
            )}

            {/* Icon circle */}
            <div
              className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10 bg-white"
              style={{ border: '1px solid #C55F61' }}
              aria-hidden="true"
            >
              <step.icon size={22} color="#C55F61" />
            </div>

            {/* Title & Body (constrained inside the flexible column) */}
            <div className="flex flex-col items-center max-w-[284px] mx-auto mt-6">
              <h3 className="font-cormorant font-bold text-[24px] mb-2" style={{ color: '#121212' }}>
                {step.title}
              </h3>
              <p className="font-satoshi font-medium text-[12px] leading-[18px]" style={{ color: '#121212' }}>
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function RegisteredEventCard({ event }) {
  const navigate = useNavigate();

  if (!event) {
    return (
      <section aria-label="Registered event" className="w-full max-w-container mx-auto px-8 max-sm:px-6 py-8">
        <div
          className="bg-white rounded-lg p-8 sm:p-12 flex items-center justify-center"
          style={{ boxShadow: '0px 9px 4px 1px rgba(18, 18, 18, 0.05)' }}
        >
          <p className="font-satoshi text-[16px]" style={{ color: '#808080' }}>
            Event details are not available.
          </p>
        </div>
      </section>
    );
  }

  const eventImage = event.image || '';
  const eventTitle = event.title || 'Toast Wedding Fair';
  const eventId = event.id ?? event.guid;

  // Date formatting
  const startDateStr = event.startDate ? formatDate(event.startDate) : '';
  const endDateStr = event.endDate ? formatDate(event.endDate) : '';
  const dateRange = endDateStr && endDateStr !== startDateStr
    ? `${startDateStr} – ${endDateStr}`
    : startDateStr;

  // Day-of-week labels
  const getDayLabel = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'long' });
  };
  const startDay = getDayLabel(event.startDate);
  const endDay = getDayLabel(event.endDate);
  const dayLabels = startDay && endDay && startDay !== endDay
    ? `${startDay} – ${endDay}`
    : startDay;

  // Time formatting
  const startTimeRaw = event.event_start_time ? formatTime(event.event_start_time) : '';
  const endTimeRaw = event.event_end_time ? formatTime(event.event_end_time) : '';
  const isFallbackTime = (t) => t === 'Time To Be Announced';
  const timeRange =
    startTimeRaw && endTimeRaw && !isFallbackTime(startTimeRaw) && !isFallbackTime(endTimeRaw)
      ? startTimeRaw !== endTimeRaw
        ? `${startTimeRaw} – ${endTimeRaw}`
        : startTimeRaw
      : startTimeRaw && !isFallbackTime(startTimeRaw)
        ? startTimeRaw
        : 'to be announced';

  // Location
  const locationName = event.location || '';
  const cityName = event.city || event.venueAddress || '';

  const isFeatured = event.featured || event.isFeatured;

  return (
    <section aria-label="Registered event" className="w-full max-w-container mx-auto px-8 max-sm:px-6 py-8">
      {/* "Your Registered Event" label — above the card, top-left */}
      <span className="font-satoshi font-bold text-[24px] mb-4 block" style={{ color: '#121212' }}>
        Your Registered Event
      </span>

      <div
        className="bg-white rounded-lg p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8"
        style={{ boxShadow: '0px 9px 4px 1px rgba(18, 18, 18, 0.05)' }}
      >
        {/* Left: Event Photo */}
        <div className="flex-shrink-0">
          {eventImage ? (
            <img
              src={eventImage}
              alt={eventTitle}
              className="w-full lg:w-[360px] h-[240px] lg:h-[360px] rounded-lg object-cover"
            />
          ) : (
            <div
              className="w-full lg:w-[360px] h-[240px] lg:h-[360px] rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#F1F1F1' }}
            >
              <span className="font-satoshi text-[14px]" style={{ color: '#808080' }}>
                No image available
              </span>
            </div>
          )}
        </div>

        {/* Center: Event Details */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {isFeatured && (
            <div
              className="inline-flex items-center gap-1 self-start px-[6px] py-1 rounded font-satoshi font-bold text-[12px]"
              style={{ backgroundColor: '#FFFFFF', color: '#434343' }}
            >
              <span style={{ color: '#FFB24E' }} aria-hidden="true">★</span>
              FEATURED EVENT
            </div>
          )}

          <h3 className="font-cormorant font-bold text-[28px] sm:text-[32px]" style={{ color: '#121212' }}>
            {eventTitle}
          </h3>

          {/* Date row */}
          <div className="flex items-start gap-3">
            <Calendar size={24} color="#C55F61" aria-hidden="true" className="flex-shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-satoshi font-medium text-[16px]" style={{ color: '#606060' }}>
                {dateRange || 'Date TBA'}
              </span>
              {dayLabels && (
                <span className="font-satoshi text-[12px]" style={{ color: '#606060' }}>
                  {dayLabels}
                </span>
              )}
            </div>
          </div>

          {/* Time row */}
          {timeRange && (
            <div className="flex items-start gap-3">
              <Clock size={24} color="#C55F61" aria-hidden="true" className="flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-satoshi font-medium text-[16px]" style={{ color: '#606060' }}>
                  {timeRange}
                </span>
                <span className="font-satoshi text-[12px]" style={{ color: '#606060' }}>
                  Both Days
                </span>
              </div>
            </div>
          )}

          {/* Location row */}
          {locationName && (
            <div className="flex items-start gap-3">
              <MapPin size={24} color="#C55F61" aria-hidden="true" className="flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="font-satoshi font-medium text-[16px]" style={{ color: '#606060' }}>
                  {locationName}
                </span>
                {cityName && (
                  <span className="font-satoshi text-[12px]" style={{ color: '#606060' }}>
                    {cityName}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Important Reminders Panel */}
        <div
          className="flex-shrink-0 w-full lg:w-[495px] rounded-lg p-6 sm:p-8 flex flex-col gap-4"
          style={{ backgroundColor: 'rgba(197, 95, 97, 0.10)' }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-satoshi font-bold text-[12px] uppercase" style={{ color: '#C55F61' }}>
              IMPORTANT REMINDERS
            </span>
            <span className="font-satoshi font-medium text-[12px]" style={{ color: '#121212' }}>
              Double-check your details so we can welcome you smoothly at the fair.
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {REMINDERS.map((reminder) => (
              <li key={reminder} className="flex items-start gap-3">
                {/* Gradient check circle */}
                <div
                  className="w-[16px] h-[16px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
                  }}
                  aria-hidden="true"
                >
                  <Check size={10} color="#FFFFFF" strokeWidth={3} />
                </div>
                <span className="font-satoshi font-medium text-[14px]" style={{ color: '#606060' }}>
                  {reminder}
                </span>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              if (eventId) {
                navigate(`/event/${eventId}`, { state: { event } });
              } else {
                navigate('/event');
              }
            }}
            className="inline-flex items-center justify-center gap-2 px-6 h-[48px] rounded-lg font-satoshi font-bold text-[16px] text-white transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(180deg, #F57E80 0%, #C55F61 100%)',
              textShadow: '0px 1px 2px rgba(0, 0, 0, 0.15)',
            }}
          >
            View Event Details &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────
   Main RegistrationSuccess component
   ─────────────────────────────────────────── */

export default function RegistrationSuccess({ userEmail, event, onBackToHome }) {
  return (
    <div className="relative z-10 bg-white min-h-screen flex flex-col">
      {/* Content area — fills available space, pushes footer down */}
      <div className="flex-1">
        {/* 1. Hero Section */}
        <SuccessHero userEmail={userEmail} />

        {/* 2. Floating Info Strip (overlaps hero) */}
        <FloatingInfoStrip />

        {/* 3. What's Next? Timeline */}
        <WhatsNextTimeline />

        {/* 4. Registered Event Card */}
        <RegisteredEventCard event={event} />

        {/* 5. Support Strip — reuses existing ContactStrip from event details page */}
        <ContactStrip />
      </div>

      {/* 6. Footer — sticks to bottom */}
      <Footer />
    </div>
  );
}
