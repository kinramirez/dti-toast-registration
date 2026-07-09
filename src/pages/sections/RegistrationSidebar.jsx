import { Ticket, SquareChartGantt, Trophy, Lightbulb } from 'lucide-react';

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

export default function RegistrationSidebar({ showWhyRegister = true }) {
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
          Free Entrance for those who register now until July 29, 2026, 5PM.
          Submission of this form confirms that you agree to receive updates 
          about Toast Wedding Fair! If you receive the form auto reply, it means 
          we have received your form and you are guaranteed
          FREE ENTRY!
        </p>
        <p className='text-[16px] font-bold text-danger-red leading-relaxed'>
          This pre-registration is valid per individual/guest only.
        </p>
        <p className='text-[16px] font-bold text-danger-red leading-relaxed'>
          If you are registering as a couple, family, or group, each individual must register separately.
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
