import EventFormPage from './EventFormPage';

/**
 * Hardcoded event data for the Toast Wedding Fair (Event ID 36).
 * Sourced from the TOAST API: GET /events/36
 *
 * This is a temporary override — the root route (/) renders the registration
 * form pre-wired for this event instead of the normal events listing page.
 */
const HARDCODED_EVENT = {
  id: 36,
  guid: '35e60ba5-5153-468b-853c-e22abc9521a7',
  title: 'Toast Wedding Fair',
  description:
    'Discover top wedding suppliers, bridal designers, and premier caterers all in one place. Plan your dream wedding with exclusive deals, creative inspiration, and expert advice from the best in the industry.',
  startDate: '2026-08-08T02:00:00.000Z',
  endDate: '2026-08-09T12:00:00.000Z',
  location: 'SMX Convention Center Manila',
  region: 'PASAY',
  image:
    'https://dti-event.myiiap.com/DtiAdmin/files/1783582450463-toast-success-hero.png',
  isFeatured: true,
  event_start_time: null,
  event_end_time: null,
};

export default function TemporaryLanding() {
  return (
    <EventFormPage
      event={HARDCODED_EVENT}
      hideBackLink
      hideViewEventButton
    />
  );
}
