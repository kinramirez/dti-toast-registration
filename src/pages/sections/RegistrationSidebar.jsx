import { Ticket, SquareChartGantt, Trophy, Lightbulb } from 'lucide-react';
import { formatDate } from '@/lib/utils/eventUtils';

/**
 * RegistrationSidebar — Right sidebar with Reminder card and "Why Register?" card.
 *
 * Design spec §2.10–2.11, §4.11–4.12:
 * - Width: 532px
 * - Stacked cards with 32px gap
 *
 * Reminder Card (532×360px):
 * - White bg, shadow: 0px 9px 4px 1px rgba(18,18,18,0.05)
 * - Heading: "Reminder" — Cormorant Garamond 28px, rose
 * - Body + warning text (moved from old RegistrationStep1 disclaimers)
 * - Registration deadline text is derived from event.endDate (the event's
 *   last day) rather than hardcoded, so it always stays in sync with
 *   EventOverviewCard. Venue name is likewise pulled from event.location.
 * - Event name in the body copy comes from event?.title (falling back to
 *   "Toast Wedding Fair" only when no event data is available) instead of
 *   being hardcoded, since this page serves multiple different client
 *   events, not just Toast.
 *
 * "Why Register?" Card (532×256px):
 * - Background: rgba(197,95,97,0.2), shadow: 0px 6px 4px rgba(18,18,18,0.15)
 * - 2×2 icon grid with circular outline icons + bold rose label + gray description
 */

const WHY_REGISTER_ITEMS = [
  {
    icon: Ticket,
    label: 'FREE ADMISSION',
    description: 'Open to all couples and their families',
  },
  {
    icon: SquareChartGantt,
    label: 'EXCLUSIVE DEALS',
    description: 'Enjoy special promos only at the event',
  },
  {
    icon: Trophy,
    label: 'RAFFLE PRIZES',
    description: 'Amazing prizes await you',
  },
  {
    icon: Lightbulb,
    label: 'EXPERT ADVICE',
    description: 'Get tips from wedding experts',
  },
];

/**
 * @param {object} event - Event data (same object passed to EventOverviewCard
 *   and RegistrationStep1). Provides `title` (event name), `location` (venue
 *   name), and `endDate` (used as the registration deadline — the last day
 *   of the event).
 * @param {boolean} showWhyRegister - Toggles the "Why Register?" card.
 */
export default function RegistrationSidebar({ event, showWhyRegister = true }) {
  const eventName = event?.title || 'Toast Wedding Fair';
  const venueText = event?.location ? ` at ${event.location}` : '';

  // Registration deadline = the event's last day (endDate)
  const registrationDeadline = formatDate(event?.endDate) || 'the event date';

  return (
    <aside className='w-full lg:w-[532px] flex-shrink-0 flex flex-col gap-8'>
      {/* ── Reminder Card ── */}
      <div
        className='bg-white rounded-lg p-8 font-satoshi'
        style={{
          boxShadow: '0px 9px 4px 1px rgba(18, 18, 18, 0.05)',
        }}
      >
        <h3
          className='font-cormorant text-[28px] font-bold mb-4'
          style={{ color: '#C55F61' }}
        >
          Reminder
        </h3>
        <p className='text-[16px] text-brand-dark leading-relaxed mb-4'>
          Free entrance for those who register now until {registrationDeadline}!
          Submission of this form confirms that you agree to receive updates
          about {eventName}! If you receive the form auto reply, it means
          we have received your form and you are guaranteed FREE ENTRY! Valid ID
          should be presented{venueText} on the day. Name should match valid ID.
        </p>
        <p className='text-[16px] font-bold text-danger-red leading-relaxed'>
          1 Registration = 1 Person = 1 Full Day Entry.
        </p>
        <p className='text-[16px] font-bold text-danger-red leading-relaxed'>
          Only 1 full day entry is free so no need to register the same person
          twice.
        </p>
      </div>

      {/* ── Why Register? Card ── */}
      {showWhyRegister && (
        <div
          className='rounded-lg p-8 font-satoshi'
          style={{
            backgroundColor: 'rgba(197, 95, 97, 0.2)',
            boxShadow: '0px 6px 4px rgba(18, 18, 18, 0.15)',
          }}
        >
          <h3 className='font-cormorant text-[28px] font-bold text-brand-dark mb-6'>
            Why Register?
          </h3>
          <div className='grid grid-cols-2 gap-6'>
            {WHY_REGISTER_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className='flex flex-col items-center text-center gap-2'>
                  {/* Circular outline icon */}
                  <div
                    className='w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center flex-shrink-0'
                    style={{ borderColor: '#C55F61' }}
                    aria-hidden='true'
                  >
                    <Icon className='w-6 h-6' style={{ color: '#C55F61' }} />
                  </div>
                  <span
                    className='text-[14px] font-bold leading-tight'
                    style={{ color: '#C55F61' }}
                  >
                    {item.label}
                  </span>
                  <span className='text-[12px] text-neutral-gray leading-tight'>
                    {item.description}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </aside>
  );
}